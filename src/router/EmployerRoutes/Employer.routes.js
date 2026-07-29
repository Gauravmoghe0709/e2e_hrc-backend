const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const EmployerController = require("../../controllers/Employercontrollers/employer.controller");
const protectedRoute = require("../../middleware/auth.middleware");

// Public route to get active employer hero (singular path used by frontend)
router.get("/employer/hero", EmployerController.getEmployerHero);
// Admin Routes
router.post("/admin/employer/hero", protectedRoute, upload.single("heroImage"), EmployerController.createEmployerHero);
router.post("/admin/employers/hero", protectedRoute, upload.single("heroImage"), EmployerController.createEmployerHero);
router.put("/admin/employer/hero/:id", protectedRoute, upload.single("heroImage"), EmployerController.updateEmployerHero);
router.put("/admin/employers/hero/:id", protectedRoute, upload.single("heroImage"), EmployerController.updateEmployerHero);
router.delete("/admin/employer/hero/:id", protectedRoute, EmployerController.deleteEmployerHero);
router.delete("/admin/employers/hero/:id", protectedRoute, EmployerController.deleteEmployerHero);
router.post("/admin/employer/hero/:id/image", protectedRoute, upload.single("heroImage"), EmployerController.uploadEmployerHeroImage);
router.post("/admin/employers/hero/:id/image", protectedRoute, upload.single("heroImage"), EmployerController.uploadEmployerHeroImage);

// how we work routes

// Public route
router.get("/employer-how-we-work-steps", EmployerController.getEmployerHowWeWorkSteps);

// Admin routes
router.get("/admin/employer-how-we-work-steps", protectedRoute, EmployerController.getAdminHowWeWorkSteps);
router.post("/admin/employer-how-we-work-step", protectedRoute, EmployerController.createEmployerHowWeWorkStep);
router.put("/admin/employer-how-we-work-step/:id", protectedRoute, EmployerController.updateEmployerHowWeWorkStep);
router.delete("/admin/employer-how-we-work-step/:id", protectedRoute, EmployerController.deleteEmployerHowWeWorkStep);

// Public APi 
router.get("/employer-faq", EmployerController.getEmployerFAQ);

// Admin routes
router.post("/admin/employer-faq", protectedRoute, EmployerController.createEmployerFAQ);
router.get("/admin/employer-faq", protectedRoute, EmployerController.getAdminEmployerFAQ);
router.put("/admin/employer-faq/:id", protectedRoute, EmployerController.updateEmployerFAQ);
router.delete("/admin/employer-faq/:id", protectedRoute, EmployerController.deleteEmployerFAQ);


// employer CTA routes

// Public API
router.get("/employer-cta", EmployerController.getEmployerCTA);

// Admin routes
router.post("/admin/employer-cta", protectedRoute, EmployerController.createEmployerCTA);
router.get("/admin/employer-cta", protectedRoute, EmployerController.getAdminEmployerCTA);
router.put("/admin/employer-cta/:id", protectedRoute, EmployerController.updateEmployerCTA);
router.delete("/admin/employer-cta/:id", protectedRoute, EmployerController.deleteEmployerCTA);

// employer testimonials routes

// Public API
router.get("/employer/testimonials", EmployerController.getPublicTestimonials);

// Admin section routes
router.post("/admin/employer/testimonial-section", protectedRoute, EmployerController.createTestimonialSection);
router.get("/admin/employer/employertestimonial-section", protectedRoute, EmployerController.getAdminTestimonialSection);
router.put("/admin/employer/testimonial-section/:id", protectedRoute, EmployerController.updateTestimonialSection);
router.delete("/admin/employer/testimonial-section/:id", protectedRoute, EmployerController.deleteTestimonialSection);

// Admin card routes
router.post("/admin/employer/testimonial-cards", protectedRoute, upload.single("companyLogo"), EmployerController.createTestimonialCard);
router.get("/admin/employer/testimonial-cards", protectedRoute, EmployerController.getAdminTestimonialCards);
router.get("/admin/employer/testimonial-cards/:id", protectedRoute, EmployerController.getAdminTestimonialCardById);
router.put("/admin/employer/testimonial-cards/:id", protectedRoute, EmployerController.updateTestimonialCard);
router.delete("/admin/employer/testimonial-cards/:id", protectedRoute, EmployerController.deleteTestimonialCard);
router.patch("/admin/employer/testimonial-cards/:id/company-logo", protectedRoute, upload.single("companyLogo"), EmployerController.updateTestimonialCardLogo);

module.exports = router;