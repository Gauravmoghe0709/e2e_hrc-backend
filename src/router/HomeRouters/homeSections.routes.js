const express = require("express");
const router = express.Router();
const multer = require("multer");
const homeSectionsController = require("../../controllers/HomeControllers/homeSections.controller");
const upload = multer({ storage: multer.memoryStorage() });

// ─── HOME WHO WE ARE ─────────────────────────────────────────────────────────
router.get("/home/who-we-are", homeSectionsController.getHomeWhoWeAre);
router.post("/admin/home/who-we-are", upload.single("image"), homeSectionsController.createHomeWhoWeAre);
router.put("/admin/home/who-we-are/:id", homeSectionsController.updateHomeWhoWeAre);
router.post("/admin/home/who-we-are/:id/image", upload.single("image"), homeSectionsController.uploadHomeWhoWeAreImage);
router.delete("/admin/home/who-we-are/:id", homeSectionsController.deleteHomeWhoWeAre);

// ─── HOME MISSION & VISION ───────────────────────────────────────────────────
router.get("/home/mission-vision", homeSectionsController.getHomeMissionVision);
router.post("/admin/home/mission-vision", upload.single("visionImage"), homeSectionsController.createHomeMissionVision);
router.put("/admin/home/mission-vision/:id", homeSectionsController.updateHomeMissionVision);
router.post("/admin/home/mission-vision/:id/image", upload.single("visionImage"), homeSectionsController.uploadHomeMissionVisionImage);
router.delete("/admin/home/mission-vision/:id", homeSectionsController.deleteHomeMissionVision);

// ─── HOME TESTIMONIALS ───────────────────────────────────────────────────────
router.get("/home/testimonials", homeSectionsController.getHomeTestimonials);
router.get("/admin/home/testimonials", homeSectionsController.getHomeTestimonialsAll);
router.post("/admin/home/testimonials", homeSectionsController.createHomeTestimonial);
router.put("/admin/home/testimonials/:id", homeSectionsController.updateHomeTestimonial);
router.delete("/admin/home/testimonials/:id", homeSectionsController.deleteHomeTestimonial);

// ─── HOME GLOBAL PRESENCE ────────────────────────────────────────────────────
router.get("/home/global-presence", homeSectionsController.getHomeGlobalPresence);
router.post("/admin/home/global-presence", upload.single("mapImage"), homeSectionsController.createHomeGlobalPresence);
router.put("/admin/home/global-presence/:id", homeSectionsController.updateHomeGlobalPresence);
router.post("/admin/home/global-presence/:id/image", upload.single("mapImage"), homeSectionsController.uploadHomeGlobalPresenceMap);
router.delete("/admin/home/global-presence/:id", homeSectionsController.deleteHomeGlobalPresence);

module.exports = router;
