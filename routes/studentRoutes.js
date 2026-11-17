const express = require("express");
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/studentController");

const router = express.Router();
router.get("/", auth, controller.listStudents);
module.exports = router;
