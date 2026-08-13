const express = require('express');
const router = express.Router();
const workforceSolutionController = require('../../controllers/WorkforceSolutionController/workforceSolution.controller');
const howWeWorkSectionController = require("../../controllers/WorkforceSolutionController/howWeWorkSection.controller");
const howWeWorkStepController = require("../../controllers/WorkforceSolutionController/howWeWorkStep.controller");
const testimonialController = require("../../controllers/WorkforceSolutionController/testimonial.controller");
const workforceSolutionFAQController = require("../../controllers/WorkforceSolutionController/FAQsection.controller");
const upload = require('../../middleware/upload.middleware');
const protectedRoute = require ("../../middleware/auth.middleware")

// ─── Hero — Public ────────────────────────────────────────────────────────────
router.get('/workforce-solution/employer-hero', workforceSolutionController.getPublicWorkforceSolutionHero);

// ─── Hero — Admin ─────────────────────────────────────────────────────────────
router.post('/admin/workforce-solution/employer-hero',protectedRoute, upload.single('image'), workforceSolutionController.createWorkforceSolutionHero);
router.get('/admin/workforce-solution/employer-hero',protectedRoute, workforceSolutionController.getAdminWorkforceSolutionHero);
router.put('/admin/workforce-solution/employer-hero/:id',protectedRoute, workforceSolutionController.updateWorkforceSolutionHero);
router.patch('/admin/workforce-solution/employer-hero/:id/image', protectedRoute,upload.single('image'), workforceSolutionController.updateWorkforceSolutionHeroImage);
router.delete('/admin/workforce-solution/employer-hero/:id',protectedRoute, workforceSolutionController.deleteWorkforceSolutionHero);


// ─── Workforce Solution Section — Admin ───────────────────────────────────────
router.post('/admin/workforce-solution-section',protectedRoute, workforceSolutionController.createWorkforceSolutionSection);
router.get('/admin/workforce-solution-section',protectedRoute, workforceSolutionController.getAdminWorkforceSolutionSections);
router.put('/admin/workforce-solution-section/:id',protectedRoute, workforceSolutionController.updateWorkforceSolutionSection);
router.delete('/admin/workforce-solution-section/:id',protectedRoute, workforceSolutionController.deleteWorkforceSolutionSection);


// ─── Workforce Solution Cards — Public ────────────────────────────────────────
router.get('/workforce-solutions', workforceSolutionController.getPublicWorkforceSolutions);

// ─── Workforce Solution Cards — Admin ────────────────────────────────────────
router.post('/admin/workforce-solution-cards',protectedRoute, workforceSolutionController.createWorkforceSolution);
router.get('/admin/workforce-solution-cards',protectedRoute, workforceSolutionController.getAdminWorkforceSolutions);
router.put('/admin/workforce-solution-cards/:id', protectedRoute,workforceSolutionController.updateWorkforceSolution);
router.delete('/admin/workforce-solution-cards/:id',protectedRoute, workforceSolutionController.deleteWorkforceSolution);


// How we work in workforce solution section

// Public API
router.get("/workforce-solutions/how-we-work", howWeWorkSectionController.getActiveHowWeWork);

// Admin Section APIs
router.post("/admin/workforce-solutions/how-we-work-section",protectedRoute, howWeWorkSectionController.createSection);
router.get("/admin/workforce-solutions/how-we-work-section",protectedRoute, howWeWorkSectionController.getAdminSections);
router.put("/admin/workforce-solutions/how-we-work-section/:id",protectedRoute, howWeWorkSectionController.updateSection);
router.delete("/admin/workforce-solutions/how-we-work-section/:id", protectedRoute,howWeWorkSectionController.deleteSection);

// Admin Step APIs
router.post("/admin/workforce-solutions/how-we-work-steps", protectedRoute,howWeWorkStepController.createStep);
router.get("/admin/workforce-solutions/how-we-work-steps",protectedRoute, howWeWorkStepController.getAdminSteps);
router.put("/admin/workforce-solutions/how-we-work-steps/:id", protectedRoute,howWeWorkStepController.updateStep);
router.delete("/admin/workforce-solutions/how-we-work-steps/:id", protectedRoute,howWeWorkStepController.deleteStep);


// FAQ Section
router.get("/workforce-solutions/faq", workforceSolutionFAQController.getWorkforceSolutionFAQ);
// Admin routes
router.post("/admin/workforce-solutions/faq",protectedRoute, workforceSolutionFAQController.createWorkforceSolutionFAQ);
router.get("/admin/workforce-solutions/faq",protectedRoute, workforceSolutionFAQController.getAdminWorkforceSolutionFAQ);
router.put("/admin/workforce-solutions/faq/:id",protectedRoute, workforceSolutionFAQController.updateWorkforceSolutionFAQ);
router.delete("/admin/workforce-solutions/faq/:id",protectedRoute, workforceSolutionFAQController.deleteWorkforceSolutionFAQ);

// employer CTA routes

// Public API
router.get("/workforce-solutions/cta", workforceSolutionFAQController.getWorkforceSolutionCTA);

// Admin routes
router.post("/admin/workforce-solutions/cta",protectedRoute, workforceSolutionFAQController.createWorkforceSolutionCTA);
router.get("/admin/workforce-solutions/cta",protectedRoute, workforceSolutionFAQController.getAdminWorkforceSolutionCTA);
router.put("/admin/workforce-solutions/cta/:id",protectedRoute, workforceSolutionFAQController.updateWorkforceSolutionCTA);
router.delete("/admin/workforce-solutions/cta/:id",protectedRoute, workforceSolutionFAQController.deleteWorkforceSolutionCTA);


// ─── Public API ───────────────────────────────────────────────────────────
router.get("/workforce-solutions/testimonials", testimonialController.getPublicTestimonials);

// ─── Admin Section APIs ───────────────────────────────────────────────────

router.post("/admin/workforce-solutions/testimonial-section",protectedRoute, testimonialController.createTestimonialSection);
router.get("/admin/workforce-solutions/testimonial-section",protectedRoute, testimonialController.getAdminTestimonialSections);
router.put("/admin/workforce-solutions/testimonial-section/:id",protectedRoute, testimonialController.updateTestimonialSection);
router.delete("/admin/workforce-solutions/testimonial-section/:id",protectedRoute, testimonialController.deleteTestimonialSection);
//Cards
router.post("/admin/workforce-solutions/testimonial-cards", protectedRoute,testimonialController.createTestimonialCard);
router.get("/admin/workforce-solutions/testimonial-cards", protectedRoute,testimonialController.getAdminTestimonialCards);
router.put("/admin/workforce-solutions/testimonial-cards/:id", protectedRoute,testimonialController.updateTestimonialCard);
router.delete("/admin/workforce-solutions/testimonial-cards/:id", protectedRoute,testimonialController.deleteTestimonialCard);

module.exports = router;

