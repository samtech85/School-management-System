const bcrypt = require('bcrypt');
const db = require('../config/db');
const { sanitizeString } = require('../utils/validators');

/**
 * List all users with optional role and status filters, and search query
 */
async function getUsers(req, res, next) {
  try {
    const { role, status, search } = req.query;
    let queryText = 'SELECT id, username, first_name, last_name, email, phone, role, status, created_at FROM users WHERE 1=1';
    const queryParams = [];
    let paramIndex = 1;

    if (role) {
      queryText += ` AND role = $${paramIndex++}`;
      queryParams.push(role);
    }

    if (status) {
      queryText += ` AND status = $${paramIndex++}`;
      queryParams.push(status);
    }

    if (search) {
      queryText += ` AND (first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR username ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      queryParams.push(`%search%`.replace('search', search));
      paramIndex++;
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await db.query(queryText, queryParams);
    res.json({ users: result.rows });
  } catch (err) {
    next(err);
  }
}

/**
 * Add a new user (Admin action)
 */
async function createUser(req, res, next) {
  try {
    let { username, first_name, last_name, email, phone, password, role, status } = req.body;

    username = sanitizeString(username).toLowerCase();
    first_name = sanitizeString(first_name);
    last_name = sanitizeString(last_name);
    email = sanitizeString(email).toLowerCase();
    phone = sanitizeString(phone);

    if (!username || !first_name || !last_name || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields (username, first_name, last_name, password, role).' });
    }

    const validRoles = ['Admin', 'Teacher', 'Student', 'Accounting'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified.' });
    }

    const existing = await db.query('SELECT id FROM users WHERE username = $1', [username]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Username is already taken.' });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    const userStatus = status || 'active';

    const queryText = `
      INSERT INTO users (username, first_name, last_name, email, phone, password_hash, role, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, username, first_name, last_name, email, phone, role, status, created_at
    `;
    const values = [username, first_name, last_name, email || null, phone || null, password_hash, role, userStatus];
    const result = await db.query(queryText, values);

    res.status(201).json({
      message: 'User created successfully.',
      user: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Modify an existing user
 */
async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    let { first_name, last_name, email, phone, role, status } = req.body;

    first_name = sanitizeString(first_name);
    last_name = sanitizeString(last_name);
    email = sanitizeString(email).toLowerCase();
    phone = sanitizeString(phone);

    const checkUser = await db.query('SELECT id FROM users WHERE id = $1', [id]);
    if (checkUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const queryText = `
      UPDATE users 
      SET first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          email = COALESCE($3, email),
          phone = COALESCE($4, phone),
          role = COALESCE($5, role),
          status = COALESCE($6, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING id, username, first_name, last_name, email, phone, role, status
    `;
    const values = [first_name, last_name, email, phone, role, status, id];
    const result = await db.query(queryText, values);

    res.json({
      message: 'User updated successfully.',
      user: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Suspend or reactivate user status
 */
async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const result = await db.query(
      'UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, username, status',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      message: `User status updated to ${status}.`,
      user: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Soft delete or remove user
 */
async function removeUser(req, res, next) {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'User removed successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
  updateStatus,
  removeUser
};