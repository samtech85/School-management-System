function notFoundHandler(req, res, next) {
  res.status(404).json({ error: 'Endpoint not found' });
}

function errorHandler(err, req, res, next) {
  console.error('[Error]', err.stack || err.message);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};