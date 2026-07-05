const express = require("express");
const router = express.Router();
const multer = require("multer");
//const protectedRoute = require("../../middleware/auth.middleware");
const aboutController = require("../../controllers/AboutControllers/about.controller");
const missionVisionController = require("../../controllers/AboutControllers/missionVision.controller");
const testimonialController = require("../../controllers/AboutControllers/testimonial.controller");
const upload = multer({ storage: multer.memoryStorage() });

// public route to get the About Hero section
router.get("/about/hero", aboutController.getAboutHero);

// admin routes for managing the About Hero section
router.post("/hero",  upload.single("heroImage"), aboutController.createAboutHero);
router.put("/hero/:id", aboutController.updateAboutHero);
router.delete("/hero/:id", aboutController.deleteAboutHero);
router.post("/hero/:id/image", upload.single("heroImage"), aboutController.uploadAboutHeroImage);


// Who We Are section routes
// public route to get the active Who We Are section
router.get("/about/who-we-are", aboutController.getWhoWeAre);

// admin routes for managing the Who We Are section
router.post("/admin/about/who-we-are", upload.single("image"), aboutController.createWhoWeAre);
router.put("/admin/about/who-we-are/:id", aboutController.updateWhoWeAre);
router.post("/admin/about/who-we-are/:id/image", upload.single("image"), aboutController.uploadWhoWeAreImage);
router.delete("/admin/about/who-we-are/:id", aboutController.deleteWhoWeAre);

// About Info section
// public route to get the active About Info section
router.get("/about-info", aboutController.getAboutInfo);

// admin routes for managing the About Info section
router.get("/admin/about-info", aboutController.getAllAboutInfo);
router.post("/admin/about-info", aboutController.createAboutInfo);
router.put("/admin/about-info/:id", aboutController.updateAboutInfo);
router.post("/admin/about-info/:id/image", upload.single("image"), aboutController.uploadAboutInfoImage);
router.delete("/admin/about-info/:id", aboutController.deleteAboutInfo);

// Bridging the Gap routes (public)
router.get('/about/bridging', aboutController.getBridgingTheGap);
// Admin routes for managing Bridging the Gap section
router.post('/admin/about/bridging', upload.single('image'), aboutController.createBridgingTheGap);
router.put('/admin/about/bridging/:id', aboutController.updateBridgingTheGap);
router.post('/admin/about/bridging/:id/image', upload.single('image'), aboutController.uploadBridgingTheGapImage);
router.delete('/admin/about/bridging/:id', aboutController.deleteBridgingTheGap);

// Why Choose E2E section routes
router.get('/about/why-choose', aboutController.getWhyChoose);
router.get('/about/why-choose/:id', aboutController.getWhyChooseById);
router.post('/admin/about/why-choose', upload.single('image'), aboutController.createWhyChoose);
router.put('/admin/about/why-choose/:id', aboutController.updateWhyChoose);
router.delete('/admin/about/why-choose/:id', aboutController.deleteWhyChoose);
router.post('/admin/about/why-choose/:id/image', upload.single('image'), aboutController.uploadWhyChooseImage);


// Mission & Vision section
router.get("/about/mission-vision", missionVisionController.getMissionVision);
router.get("/admin/about/mission-vision", missionVisionController.getAdminMissionVision);
router.get("/admin/about/mission-vision/:id", missionVisionController.getMissionVisionById);
router.post("/admin/about/mission-vision", missionVisionController.createMissionVision);
router.put("/admin/about/mission-vision/:id", missionVisionController.updateMissionVision);
router.delete("/admin/about/mission-vision/:id", missionVisionController.deleteMissionVision);

// Testimonials section
// public route to get the active testimonials
router.get("/about/testimonials", testimonialController.getTestimonials);
// admin routes for managing testimonials
router.get("/admin/about/testimonials", testimonialController.getAdminTestimonials);
router.get("/admin/about/testimonials/:id", testimonialController.getTestimonialById);
router.post("/admin/about/testimonials",  testimonialController.createTestimonial);
router.put("/admin/about/testimonials/:id", testimonialController.updateTestimonial);
router.delete("/admin/about/testimonials/:id", testimonialController.deleteTestimonial);

module.exports = router;
