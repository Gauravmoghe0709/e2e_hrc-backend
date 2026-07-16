const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
const employeeTestimonialController = require('../../controllers/EmployeeControllers/employeeTestimonial.controller');

// ============================================================
// PUBLIC API
// ============================================================
router.get('/employee/testimonials', employeeTestimonialController.getPublicEmployeeTestimonials);

// ============================================================
// ADMIN SECTION APIs
// ============================================================
router.post(
  '/admin/employee/testimonial-section',
  upload.single('backgroundImage'),
  employeeTestimonialController.createEmployeeTestimonialSection
);

router.get(
  '/admin/employee/testimonial-section',
  employeeTestimonialController.getAdminEmployeeTestimonialSections
);

router.put(
  '/admin/employee/testimonial-section/:id',
  employeeTestimonialController.updateEmployeeTestimonialSection
);

router.delete(
  '/admin/employee/testimonial-section/:id',
  employeeTestimonialController.deleteEmployeeTestimonialSection
);



// ============================================================
// ADMIN CARD APIs
// ============================================================
router.post(
  '/admin/employee/testimonial-cards',
  upload.single('companyLogo'),
  employeeTestimonialController.createEmployeeTestimonialCard
);

router.get(
  '/admin/employee/testimonial-cards',
  employeeTestimonialController.getAdminEmployeeTestimonialCards
);

router.get(
  '/admin/employee/testimonial-cards/:id',
  employeeTestimonialController.getAdminEmployeeTestimonialCardById
);

router.put(
  '/admin/employee/testimonial-cards/:id',
  employeeTestimonialController.updateEmployeeTestimonialCard
);

router.delete(
  '/admin/employee/testimonial-cards/:id',
  employeeTestimonialController.deleteEmployeeTestimonialCard
);

router.patch(
  '/admin/employee/testimonial-cards/:id/logo',
  upload.single('companyLogo'),
  employeeTestimonialController.updateEmployeeTestimonialCardLogo
);

module.exports = router;
