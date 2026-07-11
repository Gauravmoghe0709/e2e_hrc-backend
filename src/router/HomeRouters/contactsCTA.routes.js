const express = require("express");
const router = express.Router();
const protectedRoute = require('../../middleware/auth.middleware');
const contactCTAController = require("../../controllers/HomeControllers/contactCTA.controllers");

// Public — GET active CTA (used by frontend + admin to pre-fill form)
router.get("/contact-cta", contactCTAController.getcontactCTA);

// Admin — Create new CTA record
router.post("/admin/contact-cta", contactCTAController.createcontactCTA);

// Admin — Update existing CTA record by ID
router.put("/admin/contact-cta/:id", contactCTAController.updatecontactCTA);

// Admin — Upsert (create if none exists, update if exists)
router.put("/admin/contact-cta", contactCTAController.upsertcontactCTA);

module.exports = router;
