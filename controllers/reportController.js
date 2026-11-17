const { pool } = require("../config/db");
const { sendCsv } = require("../utils/exportHelper");

async function exportStudents(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT id, first_name, last_name, email FROM users WHERE role = 'student' ORDER BY last_name, first_name"
    );
    return sendCsv(res, "students.csv", result.rows, [
      { key: "id", label: "ID" },
      { key: "first_name", label: "First name" },
      { key: "last_name", label: "Last name" },
      { key: "email", label: "Email" }
    ]);
  } catch (error) {
    return next(error);
  }
}

module.exports = { exportStudents };
