const { pool } = require("../config/db");

async function getSummary(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT
         (SELECT COUNT(*)::int FROM users WHERE role = 'student' AND is_active = TRUE) AS students,
         (SELECT COUNT(*)::int FROM users WHERE role = 'teacher' AND is_active = TRUE) AS teachers,
         (SELECT COUNT(*)::int FROM courses) AS courses,
         (SELECT COUNT(*)::int FROM enrollments WHERE status = 'active') AS enrollments`
    );
    return res.json({ summary: result.rows[0] });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getSummary };
