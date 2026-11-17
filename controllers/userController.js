const { pool } = require("../config/db");

async function listUsers(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT id, first_name, last_name, email, role, is_active, created_at FROM users ORDER BY id"
    );
    return res.json({ users: result.rows });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listUsers };
