const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { sanitizeString } = require('../utils/validators');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_school_jwt_key_2026';

async function register(req, res, next) {
  try {
    let { username, first_name, last_name, email, phone, password, role } = req.body;

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

    const queryText = `
      INSERT INTO users (username, first_name, last_name, email, phone, password_hash, role, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
      RETURNING id, username, first_name, last_name, role, status, created_at
    `;
    const values = [username, first_name, last_name, email || null, phone || null, password_hash, role];
    const result = await db.query(queryText, values);

    res.status(201).json({
      message: 'Registration successful. Your account is pending Admin approval.',
      user: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    let { username, password } = req.body;
    username = sanitizeString(username).toLowerCase();

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const user = result.rows[0];

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Your account has been suspended.' });
    }

    if (user.status === 'pending') {
      return res.status(403).json({ error: 'Your account is pending Admin approval.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const tokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '8h' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        status: user.status
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };