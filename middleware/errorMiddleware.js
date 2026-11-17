function errorMiddleware(error, req, res, next) {
  console.error(error);
  if (res.headersSent) {
    return next(error);
  }
  return res.status(error.status || 500).json({
    error: process.env.NODE_ENV === "production"
      ? "An unexpected error occurred."
      : error.message
  });
}

module.exports = errorMiddleware;
