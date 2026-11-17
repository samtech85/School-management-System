const express = require("express");
const auth = require("../middleware/authMiddleware");
const requireRoles = require("../middleware/rbacMiddleware");
const { ROLES } = require("../config/constants");
const controller = require("../controllers/userController");

const router = express.Router();
router.get("/", auth, requireRoles(ROLES.ADMIN), controller.listUsers);
module.exports = router;
