const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeEntryController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');

router.use(authenticateToken);

router.get('/', gradeController.getGrades);
router.post('/', authorizeRoles(['Admin', 'Teacher']), gradeController.upsertGrade);

module.exports = router;