/**
 * Role-Based Access Control (RBAC) middleware factory.
 * Restricts access to routes based on allowed user roles.
 * @param {string[]} allowedRoles - Array of roles permitted to access the route
 */
function authorizeRoles(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. User session not found.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access forbidden. Role '${req.user.role}' is not authorized to access this resource.` 
      });
    }

    next();
  };
}

module.exports = {
  authorizeRoles
};