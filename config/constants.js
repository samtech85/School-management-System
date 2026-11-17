const ROLES = Object.freeze({
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student"
});

module.exports = {
  PORT: Number(process.env.PORT) || 3000,
  ROLES,
  ALLOWED_ROLES: Object.values(ROLES)
};
