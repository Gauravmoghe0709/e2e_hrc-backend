const express = require('express');
const upload = require('../../middleware/upload.middleware');
const protectedRoute = require('../../middleware/auth.middleware');
const employerController = require('../../controllers/HomeControllers/EmployerController');

const router = express.Router();

router.post('/public/employer', upload.single('attachment'), employerController.createEmployer);

router.get('/admin/employers', protectedRoute, employerController.getAllEmployers);
router.get('/admin/employers/:id', protectedRoute, employerController.getEmployerById);
router.patch('/admin/employers/:id/status', protectedRoute, employerController.updateEmployerStatus);
router.delete('/admin/employers/:id', protectedRoute, employerController.deleteEmployer);

module.exports = router;
