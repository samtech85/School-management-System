const express = require("express");
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/gradingController");

const router = express.Router();
router.get("/", auth, controller.listGrades);
module.exports = router;
