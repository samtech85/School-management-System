const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');

router.use(authenticateToken);

router.get('/', authorizeRoles(['Admin', 'Accounting']), enrollmentController.getEnrollments);
router.post('/', authorizeRoles(['Admin']), enrollmentController.createEnrollment);
router.put('/:id', authorizeRoles(['Admin', 'Accounting']), enrollmentController.updateEnrollment);
router.delete('/:id', authorizeRoles(['Admin']), enrollmentController.deleteEnrollment);

module.exports = router;