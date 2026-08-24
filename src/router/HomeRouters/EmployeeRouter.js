const express = require('express');
const upload = require('../../middleware/upload.middleware');
const protectedRoute = require('../../middleware/auth.middleware');
const employeeController = require('../../controllers/HomeControllers/EmployeeController');

const router = express.Router();

router.post('/public/employee', upload.single('attachment'), employeeController.createEmployee);

router.get('/admin/employees', protectedRoute, employeeController.getAllEmployees);
router.get('/admin/employees/:id', protectedRoute, employeeController.getEmployeeById);
router.patch('/admin/employees/:id/status', protectedRoute, employeeController.updateEmployeeStatus);
router.delete('/admin/employees/:id', protectedRoute, employeeController.deleteEmployee);

module.exports = router;
