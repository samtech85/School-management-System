const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");
const { ROLES } = require("../config/constants");

async function register(req, res, next) {
  const { first_name, last_name, email, password } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, first_name, last_name, email, role`,
      [first_name, last_name, email, passwordHash, ROLES.STUDENT]
    );
    return res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "An account with that email already exists." });
    }
    return next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT id, first_name, last_name, email, role, password_hash FROM users WHERE email = $1 AND is_active = TRUE",
      [email]
    );
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
    delete user.password_hash;
    return res.json({ token, user });
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login };
