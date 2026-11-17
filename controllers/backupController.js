const db = require('../config/db');

/**
 * Generate a JSON data export of core system tables as a backup snapshot
 */
async function exportBackup(req, res, next) {
  try {
    const [users, terms, courses, classes, enrollments, grades, rules] = await Promise.all([
      db.query('SELECT id, username, first_name, last_name, email, phone, role, status, created_at FROM users'),
      db.query('SELECT * FROM terms'),
      db.query('SELECT * FROM courses'),
      db.query('SELECT * FROM classes'),
      db.query('SELECT * FROM enrollments'),
      db.query('SELECT * FROM grades'),
      db.query('SELECT * FROM grading_rules')
    ]);

    const backupData = {
      version: '1.0',
      currency: 'HTG',
      export_timestamp: new Date().toISOString(),
      data: {
        users: users.rows,
        terms: terms.rows,
        courses: courses.rows,
        classes: classes.rows,
        enrollments: enrollments.rows,
        grades: grades.rows,
        grading_rules: rules.rows
      }
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=school_ms_backup_${Date.now()}.json`);
    res.status(200).send(JSON.stringify(backupData, null, 2));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  exportBackup
};