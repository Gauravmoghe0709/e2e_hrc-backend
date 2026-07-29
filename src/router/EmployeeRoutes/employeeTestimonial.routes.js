const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
const protectedRoute =  require("../../middleware/auth.middleware")
const employeeTestimonialController = require('../../controllers/EmployeeControllers/employeeTestimonial.controller');

//PUBLIC API
router.get('/employee/testimonials', employeeTestimonialController.getPublicEmployeeTestimonials);

// ADMIN SECTION APIs
router.post(
  '/admin/employee/testimonial-section',
  protectedRoute,
  upload.single('backgroundImage'),
  employeeTestimonialController.createEmployeeTestimonialSection
);

router.get(
  '/admin/employee/testimonial-section',
  protectedRoute,
  employeeTestimonialController.getAdminEmployeeTestimonialSections
);

router.put(
  '/admin/employee/testimonial-section/:id',
  protectedRoute,
  employeeTestimonialController.updateEmployeeTestimonialSection
);

router.delete(
  '/admin/employee/testimonial-section/:id',
  protectedRoute,
  employeeTestimonialController.deleteEmployeeTestimonialSection
);

// ADMIN CARD APIs
router.post(
  '/admin/employee/testimonial-cards',
  protectedRoute,
  upload.single('companyLogo'),
  employeeTestimonialController.createEmployeeTestimonialCard
);

router.get(
  '/admin/employee/testimonial-cards',
  protectedRoute,
  employeeTestimonialController.getAdminEmployeeTestimonialCards
);

router.get(
  '/admin/employee/testimonial-cards/:id',
  protectedRoute,
  employeeTestimonialController.getAdminEmployeeTestimonialCardById
);

router.put(
  '/admin/employee/testimonial-cards/:id',
  protectedRoute,
  employeeTestimonialController.updateEmployeeTestimonialCard
);

router.delete(
  '/admin/employee/testimonial-cards/:id',protectedRoute,
  employeeTestimonialController.deleteEmployeeTestimonialCard
);

router.patch(
  '/admin/employee/testimonial-cards/:id/logo',
  protectedRoute,
  upload.single('companyLogo'),
  employeeTestimonialController.updateEmployeeTestimonialCardLogo
);

module.exports = router;
