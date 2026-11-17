const { pool } = require("../config/db");

async function listGrades(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT g.id, g.student_id, g.course_id, g.grade, g.graded_at,
              u.first_name, u.last_name, c.course_code, c.course_name
       FROM grades g
       JOIN users u ON u.id = g.student_id
       JOIN courses c ON c.id = g.course_id
       ORDER BY g.graded_at DESC`
    );
    return res.json({ grades: result.rows });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listGrades };
