const express = require("express");
const router = express.Router();
const multer = require("multer");
const protectedRoute = require("../../middleware/auth.middleware");
const aboutController = require("../../controllers/AboutControllers/about.controller");
const missionVisionController = require("../../controllers/AboutControllers/missionVision.controller");
const journeyController = require("../../controllers/AboutControllers/journey.controller");
const upload = multer({ storage: multer.memoryStorage() });

// public route to get the About Hero section
router.get("/about/hero", aboutController.getAboutHero);

// admin routes for managing the About Hero section
router.post("/hero", protectedRoute, upload.single("heroImage"), aboutController.createAboutHero);
router.put("/hero/:id", protectedRoute, aboutController.updateAboutHero);
router.delete("/hero/:id", protectedRoute, aboutController.deleteAboutHero);
router.post("/hero/:id/image", protectedRoute, upload.single("heroImage"), aboutController.uploadAboutHeroImage);


// Who We Are section routes
// public route to get the active Who We Are section
router.get("/about/who-we-are", aboutController.getWhoWeAre);

// admin routes for managing the Who We Are section
router.post("/admin/about/who-we-are", protectedRoute, upload.single("image"), aboutController.createWhoWeAre);
router.put("/admin/about/who-we-are/:id", protectedRoute, aboutController.updateWhoWeAre);
router.post("/admin/about/who-we-are/:id/image", protectedRoute, upload.single("image"), aboutController.uploadWhoWeAreImage);
router.delete("/admin/about/who-we-are/:id", protectedRoute, aboutController.deleteWhoWeAre);

// About Info section
// public route to get the active About Info section
router.get("/about-info", aboutController.getAboutInfo);

// admin routes for managing the About Info section
router.get("/admin/about-info", protectedRoute, aboutController.getAllAboutInfo);
router.post("/admin/about-info", protectedRoute, aboutController.createAboutInfo);
router.put("/admin/about-info/:id", protectedRoute, aboutController.updateAboutInfo);
router.post("/admin/about-info/:id/image", protectedRoute, upload.single("image"), aboutController.uploadAboutInfoImage);
router.delete("/admin/about-info/:id", protectedRoute, aboutController.deleteAboutInfo);

// Bridging the Gap routes (public)
router.get('/about/bridging', aboutController.getBridgingTheGap);
// Admin routes for managing Bridging the Gap section
router.post('/admin/about/bridging', protectedRoute, upload.single('image'), aboutController.createBridgingTheGap);
router.put('/admin/about/bridging/:id', protectedRoute, aboutController.updateBridgingTheGap);
router.post('/admin/about/bridging/:id/image', protectedRoute, upload.single('image'), aboutController.uploadBridgingTheGapImage);
router.delete('/admin/about/bridging/:id', protectedRoute, aboutController.deleteBridgingTheGap);

// Why Choose E2E section routes
router.get('/about/why-choose', aboutController.getWhyChoosePublic);

// Admin routes for Why Choose E2E Section
router.post('/admin/about/why-choose-section', protectedRoute, aboutController.createWhyChooseE2ESection);
router.get('/admin/about/why-choose-section', protectedRoute, aboutController.getAdminWhyChooseE2ESection);
router.put('/admin/about/why-choose-section/:id', protectedRoute, aboutController.updateWhyChooseE2ESection);
router.delete('/admin/about/why-choose-section/:id', protectedRoute, aboutController.deleteWhyChooseE2ESection);

// Admin routes for Why Choose E2E Cards
router.post('/admin/about/why-choose-cards', protectedRoute, upload.single('image'), aboutController.createWhyChooseE2ECard);
router.get('/admin/about/why-choose-cards', protectedRoute, aboutController.getAdminWhyChooseE2ECards);
router.put('/admin/about/why-choose-cards/:id', protectedRoute, aboutController.updateWhyChooseE2ECard);
router.patch('/admin/about/why-choose-cards/:id/image', protectedRoute, upload.single('image'), aboutController.uploadWhyChooseE2ECardImage);
router.delete('/admin/about/why-choose-cards/:id', protectedRoute, aboutController.deleteWhyChooseE2ECard);

/* Old combined routes (kept for backward compatibility during migration)
router.get('/admin/about/why-choose', aboutController.getAdminWhyChoose);
router.get('/about/why-choose/:id', aboutController.getWhyChooseById);
router.post('/admin/about/why-choose', upload.single('image'), aboutController.createWhyChoose);
router.put('/admin/about/why-choose/:id', aboutController.updateWhyChoose);
router.delete('/admin/about/why-choose/:id', aboutController.deleteWhyChoose);
router.post('/admin/about/why-choose/:id/image', upload.single('image'), aboutController.uploadWhyChooseImage);*/


// Mission & Vision section
router.get("/about/mission-vision", missionVisionController.getMissionVision);

router.get("/admin/about/mission-vision", protectedRoute, missionVisionController.getAdminMissionVision);
router.get("/admin/about/mission-vision/:id", protectedRoute, missionVisionController.getMissionVisionById);
router.post("/admin/about/mission-vision", protectedRoute, missionVisionController.createMissionVision);
router.put("/admin/about/mission-vision/:id", protectedRoute, missionVisionController.updateMissionVision);
router.delete("/admin/about/mission-vision/:id", protectedRoute, missionVisionController.deleteMissionVision);

// ── Journey Section ──────────────────────────────────────────────────────────
// Public
router.get("/journey", journeyController.getPublicJourney);
// Admin - Journey Section (only one doc; POST creates or updates)
router.post("/admin/journey-section", protectedRoute, journeyController.createOrUpdateJourneySection);
router.get("/admin/journey-section", protectedRoute, journeyController.getAdminJourneySection);
router.put("/admin/journey-section/:id", protectedRoute, journeyController.updateJourneySection);
router.delete("/admin/journey-section/:id", protectedRoute, journeyController.deleteJourneySection);
// Admin - Journey Timeline Cards
router.post("/admin/journey-cards", protectedRoute, journeyController.createJourneyCard);
router.get("/admin/journey-cards", protectedRoute, journeyController.getAdminJourneyCards);
router.get("/admin/journey-cards/:id", protectedRoute, journeyController.getJourneyCardById);
router.put("/admin/journey-cards/:id", protectedRoute, journeyController.updateJourneyCard);
router.delete("/admin/journey-cards/:id", protectedRoute, journeyController.deleteJourneyCard);

module.exports = router;
