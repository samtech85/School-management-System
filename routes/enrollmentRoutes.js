const express = require("express");
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/enrollmentController");

const router = express.Router();
router.get("/", auth, controller.listEnrollments);
module.exports = router;
