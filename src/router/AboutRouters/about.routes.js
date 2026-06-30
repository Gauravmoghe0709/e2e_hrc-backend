const express = require("express");
const router = express.Router();
const multer = require("multer");
const protectedRoute = require("../../middleware/auth.middleware");
const aboutController = require("../../controllers/AboutControllers/about.controller");
const upload = multer({ storage: multer.memoryStorage() });

// ─── ABOUT HERO ───────────────────────────────────────────────────────────────
router.get("/about/hero", aboutController.getAboutHero);
router.put("/admin/about/hero", protectedRoute, aboutController.upsertAboutHero);
router.post("/admin/about/hero/image", protectedRoute, upload.single("image"), aboutController.uploadAboutHeroImage);

// ─── WHO WE ARE ───────────────────────────────────────────────────────────────
router.get("/about/whoweare", aboutController.getWhoWeAre);
router.put("/admin/about/whoweare", protectedRoute, aboutController.upsertWhoWeAre);
router.post("/admin/about/whoweare/image", protectedRoute, upload.single("image"), aboutController.uploadWhoWeAreImage);

// ─── BRIDGING THE GAP ─────────────────────────────────────────────────────────
router.get("/about/bridging", aboutController.getBridgingTheGap);
router.put("/admin/about/bridging", protectedRoute, aboutController.upsertBridgingTheGap);
router.post("/admin/about/bridging/image", protectedRoute, upload.single("image"), aboutController.uploadBridgingTheGapImage);

// ─── TEAM MEMBERS ─────────────────────────────────────────────────────────────
router.get("/admin/about/team", protectedRoute, aboutController.getTeamMembers);
router.post("/admin/about/team", protectedRoute, aboutController.createTeamMember);
router.put("/admin/about/team/:id", protectedRoute, aboutController.updateTeamMember);
router.delete("/admin/about/team/:id", protectedRoute, aboutController.deleteTeamMember);
router.post("/admin/about/team/:id/image", protectedRoute, upload.single("image"), aboutController.uploadTeamMemberImage);

// ─── ABOUT TESTIMONIALS ───────────────────────────────────────────────────────
router.get("/admin/about/testimonials", protectedRoute, aboutController.getAboutTestimonials);
router.post("/admin/about/testimonials", protectedRoute, aboutController.createAboutTestimonial);
router.put("/admin/about/testimonials/:id", protectedRoute, aboutController.updateAboutTestimonial);
router.delete("/admin/about/testimonials/:id", protectedRoute, aboutController.deleteAboutTestimonial);
router.post("/admin/about/testimonials/:id/image", protectedRoute, upload.single("image"), aboutController.uploadAboutTestimonialImage);

module.exports = router;
