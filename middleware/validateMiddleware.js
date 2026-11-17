const { validationResult } = require("express-validator");

function validateMiddleware(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed.",
      details: result.array()
    });
  }
  return next();
}

module.exports = validateMiddleware;
