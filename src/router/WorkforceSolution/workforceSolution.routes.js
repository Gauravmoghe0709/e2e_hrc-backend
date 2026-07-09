const express = require('express');
const router = express.Router();
const workforceSolutionController = require('../../controllers/WorkforceSolutionController/workforceSolution.controller');
const howWeWorkSectionController = require("../../controllers/WorkforceSolutionController/howWeWorkSection.controller");
const howWeWorkStepController = require("../../controllers/WorkforceSolutionController/howWeWorkStep.controller");
const testimonialController = require("../../controllers/WorkforceSolutionController/testimonial.controller");
const upload = require('../../middleware/upload.middleware');


// ─── Hero — Public ────────────────────────────────────────────────────────────
router.get('/workforce-solution/employer-hero', workforceSolutionController.getPublicWorkforceSolutionHero);

// ─── Hero — Admin ─────────────────────────────────────────────────────────────
router.post('/admin/workforce-solution/employer-hero', upload.single('image'), workforceSolutionController.createWorkforceSolutionHero);
router.get('/admin/workforce-solution/employer-hero', workforceSolutionController.getAdminWorkforceSolutionHero);
router.put('/admin/workforce-solution/employer-hero/:id', workforceSolutionController.updateWorkforceSolutionHero);
router.patch('/admin/workforce-solution/employer-hero/:id/image', upload.single('image'), workforceSolutionController.updateWorkforceSolutionHeroImage);
router.delete('/admin/workforce-solution/employer-hero/:id', workforceSolutionController.deleteWorkforceSolutionHero);


// ─── Workforce Solution Section — Admin ───────────────────────────────────────
router.post('/admin/workforce-solution-section', workforceSolutionController.createWorkforceSolutionSection);
router.get('/admin/workforce-solution-section', workforceSolutionController.getAdminWorkforceSolutionSections);
router.put('/admin/workforce-solution-section/:id', workforceSolutionController.updateWorkforceSolutionSection);
router.delete('/admin/workforce-solution-section/:id', workforceSolutionController.deleteWorkforceSolutionSection);


// ─── Workforce Solution Cards — Public ────────────────────────────────────────
router.get('/workforce-solutions', workforceSolutionController.getPublicWorkforceSolutions);

// ─── Workforce Solution Cards — Admin ────────────────────────────────────────
router.post('/admin/workforce-solution-cards', workforceSolutionController.createWorkforceSolution);
router.get('/admin/workforce-solution-cards', workforceSolutionController.getAdminWorkforceSolutions);
router.put('/admin/workforce-solution-cards/:id', workforceSolutionController.updateWorkforceSolution);
router.delete('/admin/workforce-solution-cards/:id', workforceSolutionController.deleteWorkforceSolution);


// How we work in workforce solution section

// Public API
router.get("/workforce-solutions/how-we-work", howWeWorkSectionController.getActiveHowWeWork);

// Admin Section APIs
router.post("/admin/workforce-solutions/how-we-work-section", howWeWorkSectionController.createSection);
router.get("/admin/workforce-solutions/how-we-work-section", howWeWorkSectionController.getAdminSections);
router.put("/admin/workforce-solutions/how-we-work-section/:id", howWeWorkSectionController.updateSection);
router.delete("/admin/workforce-solutions/how-we-work-section/:id", howWeWorkSectionController.deleteSection);

// Admin Step APIs
router.post("/admin/workforce-solutions/how-we-work-steps", howWeWorkStepController.createStep);
router.get("/admin/workforce-solutions/how-we-work-steps", howWeWorkStepController.getAdminSteps);
router.put("/admin/workforce-solutions/how-we-work-steps/:id", howWeWorkStepController.updateStep);
router.delete("/admin/workforce-solutions/how-we-work-steps/:id", howWeWorkStepController.deleteStep);



// ─── Public API ───────────────────────────────────────────────────────────
router.get("/testimonials", testimonialController.getPublicTestimonials);

// ─── Admin Section APIs ───────────────────────────────────────────────────

router.post("/admin/testimonial-section", testimonialController.createTestimonialSection);
router.get("/admin/testimonial-section", testimonialController.getAdminTestimonialSections);
router.put("/admin/testimonial-section/:id", testimonialController.updateTestimonialSection);
router.delete("/admin/testimonial-section/:id", testimonialController.deleteTestimonialSection);
router.post("/admin/testimonial-cards", testimonialController.createTestimonialCard);
router.get("/admin/testimonial-cards", testimonialController.getAdminTestimonialCards);
router.put("/admin/testimonial-cards/:id", testimonialController.updateTestimonialCard);
router.delete("/admin/testimonial-cards/:id", testimonialController.deleteTestimonialCard);

module.exports = router;

