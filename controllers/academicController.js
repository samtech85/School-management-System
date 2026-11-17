const db = require('../config/db');
const { sanitizeString } = require('../utils/validators');

// --- TERMS ---
async function getTerms(req, res, next) {
  try {
    const result = await db.query('SELECT * FROM terms ORDER BY start_date DESC');
    res.json({ terms: result.rows });
  } catch (err) {
    next(err);
  }
}

async function createTerm(req, res, next) {
  try {
    let { name, start_date, end_date, status } = req.body;
    name = sanitizeString(name);

    if (!name || !start_date || !end_date) {
      return res.status(400).json({ error: 'Name, start date, and end date are required.' });
    }

    const termStatus = status || 'closed';
    const result = await db.query(
      'INSERT INTO terms (name, start_date, end_date, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, start_date, end_date, termStatus]
    );

    res.status(201).json({ message: 'Term created successfully', term: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function updateTermStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['open', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid term status. Must be "open" or "closed".' });
    }

    const result = await db.query(
      'UPDATE terms SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Term not found.' });
    }

    res.json({ message: `Term status updated to ${status}`, term: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// --- COURSES ---
async function getCourses(req, res, next) {
  try {
    const result = await db.query('SELECT * FROM courses ORDER BY code ASC');
    res.json({ courses: result.rows });
  } catch (err) {
    next(err);
  }
}

async function createCourse(req, res, next) {
  try {
    let { code, name, description } = req.body;
    code = sanitizeString(code).toUpperCase();
    name = sanitizeString(name);
    description = sanitizeString(description);

    if (!code || !name) {
      return res.status(400).json({ error: 'Course code and name are required.' });
    }

    const existing = await db.query('SELECT id FROM courses WHERE code = $1', [code]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Course code already exists.' });
    }

    const result = await db.query(
      'INSERT INTO courses (code, name, description) VALUES ($1, $2, $3) RETURNING *',
      [code, name, description || null]
    );

    res.status(201).json({ message: 'Course created successfully', course: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// --- CLASSES ---
async function getClasses(req, res, next) {
  try {
    const query = `
      SELECT c.id, c.name as class_name, c.course_id, c.term_id, c.teacher_id,
             crs.code as course_code, crs.name as course_name,
             t.name as term_name, t.status as term_status,
             u.first_name as teacher_first_name, u.last_name as teacher_last_name
      FROM classes c
      JOIN courses crs ON c.course_id = crs.id
      JOIN terms t ON c.term_id = t.id
      LEFT JOIN users u ON c.teacher_id = u.id
      ORDER BY t.start_date DESC, c.name ASC
    `;
    const result = await db.query(query);
    res.json({ classes: result.rows });
  } catch (err) {
    next(err);
  }
}

async function createClass(req, res, next) {
  try {
    let { course_id, term_id, teacher_id, name } = req.body;
    name = sanitizeString(name);

    if (!course_id || !term_id || !name) {
      return res.status(400).json({ error: 'Course, term, and class name are required.' });
    }

    const result = await db.query(
      'INSERT INTO classes (course_id, term_id, teacher_id, name) VALUES ($1, $2, $3, $4) RETURNING *',
      [course_id, term_id, teacher_id || null, name]
    );

    res.status(201).json({ message: 'Class created successfully', class: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function deleteClass(req, res, next) {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM classes WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Class not found.' });
    }
    res.json({ message: 'Class deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTerms,
  createTerm,
  updateTermStatus,
  getCourses,
  createCourse,
  getClasses,
  createClass,
  deleteClass
};