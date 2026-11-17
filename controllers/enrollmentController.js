const { pool } = require("../config/db");

async function listEnrollments(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT e.id, e.student_id, e.course_id, e.academic_year_id, e.status, e.enrolled_at,
              u.first_name, u.last_name, c.course_code, c.course_name
       FROM enrollments e
       JOIN users u ON u.id = e.student_id
       JOIN courses c ON c.id = e.course_id
       ORDER BY e.id`
    );
    return res.json({ enrollments: result.rows });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listEnrollments };
