const { pool } = require("../config/db");

async function listStudents(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, created_at
       FROM users WHERE role = 'student' AND is_active = TRUE
       ORDER BY last_name, first_name`
    );
    return res.json({ students: result.rows });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listStudents };
