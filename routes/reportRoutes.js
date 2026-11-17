const express = require("express");
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/reportController");

const router = express.Router();
router.get("/students.csv", auth, controller.exportStudents);
module.exports = router;
