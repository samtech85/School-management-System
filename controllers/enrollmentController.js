const db = require('../config/db');
const { sanitizeString } = require('../utils/validators');

/**
 * Get all enrollments with student, class, course, and payment details
 */
async function getEnrollments(req, res, next) {
  try {
    const query = `
      SELECT e.id, e.student_id, e.class_id, e.fee, e.fee_paid, e.scholarship, e.receipt_id, e.created_at,
             u.first_name as student_first_name, u.last_name as student_last_name, u.username as student_username,
             cl.name as class_name, crs.code as course_code, crs.name as course_name,
             t.name as term_name
      FROM enrollments e
      JOIN users u ON e.student_id = u.id
      JOIN classes cl ON e.class_id = cl.id
      JOIN courses crs ON cl.course_id = crs.id
      JOIN terms t ON cl.term_id = t.id
      ORDER BY e.created_at DESC
    `;
    const result = await db.query(query);
    res.json({ enrollments: result.rows });
  } catch (err) {
    next(err);
  }
}

/**
 * Enroll a student in a class with fee (HTG) and scholarship option
 */
async function createEnrollment(req, res, next) {
  try {
    let { student_id, class_id, fee, scholarship } = req.body;

    if (!student_id || !class_id || fee === undefined) {
      return res.status(400).json({ error: 'Student ID, class ID, and fee are required.' });
    }

    const numericFee = parseFloat(fee);
    if (isNaN(numericFee) || numericFee < 0) {
      return res.status(400).json({ error: 'Invalid fee amount.' });
    }

    const isScholarship = scholarship === true || scholarship === 'true';
    const finalFee = isScholarship ? 0.00 : numericFee;
    const receipt_id = isScholarship ? null : `RCP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const queryText = `
      INSERT INTO enrollments (student_id, class_id, fee, fee_paid, scholarship, receipt_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [student_id, class_id, finalFee, isScholarship ? 0.00 : finalFee, isScholarship, receipt_id];
    const result = await db.query(queryText, values);

    res.status(201).json({
      message: 'Student enrolled successfully.',
      enrollment: result.rows[0]
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Student is already enrolled in this class.' });
    }
    next(err);
  }
}

/**
 * Update payment or scholarship status
 */
async function updateEnrollment(req, res, next) {
  try {
    const { id } = req.params;
    let { fee_paid, scholarship } = req.body;

    const check = await db.query('SELECT * FROM enrollments WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Enrollment not found.' });
    }

    const current = check.rows[0];
    const isScholarship = scholarship !== undefined ? scholarship : current.scholarship;
    const paid = fee_paid !== undefined ? parseFloat(fee_paid) : current.fee_paid;
    const receipt_id = !isScholarship && !current.receipt_id ? `RCP-${Date.now()}-${Math.floor(Math.random() * 1000)}` : current.receipt_id;

    const queryText = `
      UPDATE enrollments
      SET fee_paid = $1, scholarship = $2, receipt_id = $3
      WHERE id = $4
      RETURNING *
    `;
    const result = await db.query(queryText, [paid, isScholarship, isScholarship ? null : receipt_id, id]);

    res.json({
      message: 'Enrollment payment updated successfully.',
      enrollment: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Remove an enrollment
 */
async function deleteEnrollment(req, res, next) {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM enrollments WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enrollment not found.' });
    }
    res.json({ message: 'Enrollment removed successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getEnrollments,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment
};