const { body, param } = require("express-validator");

const emailValidator = body("email")
  .isEmail()
  .withMessage("A valid email address is required.")
  .normalizeEmail();

const idValidator = param("id").isInt({ min: 1 }).withMessage("A valid ID is required.");

module.exports = { emailValidator, idValidator };
