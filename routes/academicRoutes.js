const express = require("express");
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/academicController");

const router = express.Router();
router.get("/years", auth, controller.listYears);
router.get("/courses", auth, controller.listCourses);
module.exports = router;
