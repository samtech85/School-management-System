require("dotenv").config();

const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { PORT } = require("./config/constants");
const { pool } = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", async (req, res, next) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/academics", require("./routes/academicRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/grades", require("./routes/gradingRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/backups", require("./routes/backupRoutes"));

app.use("/api", (req, res) => res.status(404).json({ error: "API endpoint not found." }));
app.use(errorMiddleware);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`School Management System listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
