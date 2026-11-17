const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');

router.use(authenticateToken);

router.get('/financial', authorizeRoles(['Admin', 'Accounting']), reportController.getFinancialSummary);
router.get('/academic', authorizeRoles(['Admin', 'Teacher']), reportController.getAcademicSummary);

module.exports = router;