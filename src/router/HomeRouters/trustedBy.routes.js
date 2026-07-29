const express = require("express");
const router = express.Router();
const trustedBySectionController = require("../../controllers/HomeControllers/trustedBySectionController");
const trustedByLogoController = require("../../controllers/HomeControllers/trustedByLogoController");
const protectedRoute = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload.middleware");

// ── PUBLIC ROUTES (no protection) ──────────────────────────────────────────

// GET /api/trusted-by — get active trusted by section
router.get("/trusted-by", trustedBySectionController.getActiveSection);

// GET /api/trusted-by/logos — get active logos
router.get("/trusted-by/logos", trustedByLogoController.getActiveLogs);

// ── ADMIN ROUTES (with protectedRoute middleware) ──────────────────────────

// Section management
router.get("/admin/trusted-by-section", protectedRoute, trustedBySectionController.getAdminSection);
router.post("/admin/trusted-by-section", protectedRoute, trustedBySectionController.createSection);
router.put("/admin/trusted-by-section/:id", protectedRoute, trustedBySectionController.updateSection);
router.delete("/admin/trusted-by-section/:id", protectedRoute, trustedBySectionController.deleteSection);

// Logo management
router.get("/admin/trusted-by-logos", protectedRoute, trustedByLogoController.getAdminLogos);
router.get("/admin/trusted-by-logos/:id", protectedRoute, trustedByLogoController.getLogoById);
router.post("/admin/trusted-by-logos", protectedRoute, upload.single("logo"), trustedByLogoController.createLogo);
router.put("/admin/trusted-by-logos/:id", protectedRoute, trustedByLogoController.updateLogo);
router.delete("/admin/trusted-by-logos/:id", protectedRoute, trustedByLogoController.deleteLogo);
router.patch("/admin/trusted-by-logos/:id/logo", protectedRoute, upload.single("logo"), trustedByLogoController.uploadLogoImage);

module.exports = router;
