const { pool } = require("../config/db");

async function listYears(req, res, next) {
  try {
    const result = await pool.query("SELECT * FROM academic_years ORDER BY starts_on DESC");
    return res.json({ academicYears: result.rows });
  } catch (error) {
    return next(error);
  }
}

async function listCourses(req, res, next) {
  try {
    const result = await pool.query("SELECT * FROM courses ORDER BY course_code");
    return res.json({ courses: result.rows });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listYears, listCourses };
