const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const EmployerController = require("../../controllers/Employercontrollers/employer.controller");
//const protectedRoute = require("../../middleware/auth.middleware");

// Public route to get active employer hero (singular path used by frontend)
router.get("/employer/hero", EmployerController.getEmployerHero);
// Admin Routes
router.post("/admin/employer/hero", upload.single("heroImage"), EmployerController.createEmployerHero);
router.post("/admin/employers/hero", upload.single("heroImage"), EmployerController.createEmployerHero);
router.put("/admin/employer/hero/:id", upload.single("heroImage"), EmployerController.updateEmployerHero);
router.put("/admin/employers/hero/:id", upload.single("heroImage"), EmployerController.updateEmployerHero);
router.delete("/admin/employer/hero/:id", EmployerController.deleteEmployerHero);
router.delete("/admin/employers/hero/:id", EmployerController.deleteEmployerHero);
router.post("/admin/employer/hero/:id/image", upload.single("heroImage"), EmployerController.uploadEmployerHeroImage);
router.post("/admin/employers/hero/:id/image", upload.single("heroImage"), EmployerController.uploadEmployerHeroImage);

// how we work routes

// Public route
router.get("/employer-how-we-work-steps", EmployerController.getEmployerHowWeWorkSteps);

// Admin routes
router.get("/admin/employer-how-we-work-steps", EmployerController.getAdminHowWeWorkSteps);
router.post("/admin/employer-how-we-work-step", EmployerController.createEmployerHowWeWorkStep);
router.put("/admin/employer-how-we-work-step/:id", EmployerController.updateEmployerHowWeWorkStep);
router.delete("/admin/employer-how-we-work-step/:id", EmployerController.deleteEmployerHowWeWorkStep);

// Public APi 
router.get("/employer-faq", EmployerController.getEmployerFAQ);

// Admin routes
router.post("/admin/employer-faq", EmployerController.createEmployerFAQ);
router.get("/admin/employer-faq", EmployerController.getAdminEmployerFAQ);
router.put("/admin/employer-faq/:id", EmployerController.updateEmployerFAQ);
router.delete("/admin/employer-faq/:id", EmployerController.deleteEmployerFAQ);


// employer CTA routes

// Public API
router.get("/employer-cta", EmployerController.getEmployerCTA);

// Admin routes
router.post("/admin/employer-cta", EmployerController.createEmployerCTA);
router.get("/admin/employer-cta", EmployerController.getAdminEmployerCTA);
router.put("/admin/employer-cta/:id", EmployerController.updateEmployerCTA);
router.delete("/admin/employer-cta/:id", EmployerController.deleteEmployerCTA);


module.exports = router;