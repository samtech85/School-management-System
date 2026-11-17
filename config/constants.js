module.exports = {
  PORT: process.env.PORT || 3000,
  CURRENCY: "HTG",
  ROLES: {
    ADMIN: "Admin",
    TEACHER: "Teacher",
    STUDENT: "Student",
    ACCOUNTING: "Accounting"
  },
  USER_STATUS: {
    PENDING: "pending",
    ACTIVE: "active",
    SUSPENDED: "suspended"
  },
  GRADE_COMPONENTS: [
    { name: "Quiz 1", weight: 0.15 },
    { name: "Quiz 2", weight: 0.15 },
    { name: "Midterm", weight: 0.30 },
    { name: "Final", weight: 0.40 }
  ]
};