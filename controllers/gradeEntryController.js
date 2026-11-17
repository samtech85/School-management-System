const db = require('../config/db');

/**
 * Get grades for a specific class or student
 */
async function getGrades(req, res, next) {
  try {
    const { class_id, student_id } = req.query;
    let query = `
      SELECT g.id, g.enrollment_id, g.component_name, g.score, g.max_score, g.created_at,
             e.student_id, e.class_id,
             u.first_name as student_first_name, u.last_name as student_last_name,
             cl.name as class_name, crs.code as course_code, crs.name as course_name
      FROM grades g
      JOIN enrollments e ON g.enrollment_id = e.id
      JOIN users u ON e.student_id = u.id
      JOIN classes cl ON e.class_id = cl.id
      JOIN courses crs ON cl.course_id = crs.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (class_id) {
      query += ` AND e.class_id = $${idx++}`;
      params.push(class_id);
    }
    if (student_id) {
      query += ` AND e.student_id = $${idx++}`;
      params.push(student_id);
    }

    query += ' ORDER BY u.last_name ASC';
    const result = await db.query(query, params);
    res.json({ grades: result.rows });
  } catch (err) {
    next(err);
  }
}

/**
 * Enter or update a student's grade for a specific component
 */
async function upsertGrade(req, res, next) {
  try {
    const { enrollment_id, component_name, score, max_score } = req.body;

    if (!enrollment_id || !component_name || score === undefined || max_score === undefined) {
      return res.status(400).json({ error: 'Enrollment ID, component name, score, and max score are required.' });
    }

    const queryText = `
      INSERT INTO grades (enrollment_id, component_name, score, max_score)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (enrollment_id, component_name)
      DO UPDATE SET score = EXCLUDED.score, max_score = EXCLUDED.max_score, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await db.query(queryText, [enrollment_id, component_name, score, max_score]);

    res.json({
      message: 'Grade saved successfully.',
      grade: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getGrades,
  upsertGrade
};