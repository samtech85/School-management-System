const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const validate = require("../middleware/validateMiddleware");

const router = express.Router();
const email = body("email").isEmail().withMessage("A valid email address is required.").normalizeEmail();

router.post(
  "/register",
  [
    body("first_name").trim().notEmpty().withMessage("First name is required."),
    body("last_name").trim().notEmpty().withMessage("Last name is required."),
    email,
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
  ],
  validate,
  authController.register
);
router.post(
  "/login",
  [email, body("password").notEmpty().withMessage("Password is required.")],
  validate,
  authController.login
);

module.exports = router;
