const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');

// All academic routes require authentication; modifications require Admin role
router.use(authenticateToken);

router.get('/terms', academicController.getTerms);
router.post('/terms', authorizeRoles(['Admin']), academicController.createTerm);
router.patch('/terms/:id/status', authorizeRoles(['Admin']), academicController.updateTermStatus);

router.get('/courses', academicController.getCourses);
router.post('/courses', authorizeRoles(['Admin']), academicController.createCourse);

router.get('/classes', academicController.getClasses);
router.post('/classes', authorizeRoles(['Admin']), academicController.createClass);
router.delete('/classes/:id', authorizeRoles(['Admin']), academicController.deleteClass);

module.exports = router;