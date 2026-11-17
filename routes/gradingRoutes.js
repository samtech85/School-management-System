const express = require('express');
const router = express.Router();
const gradingController = require('../controllers/gradingController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');

router.use(authenticateToken);

router.get('/rules', gradingController.getGradingRules);
router.post('/rules', authorizeRoles(['Admin']), gradingController.upsertGradingRule);

module.exports = router;