const express = require("express");
const router = express.Router();
//const protectedRoute = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload.middleware");

const locationCardController = require("../../controllers/HomeControllers/locationCard.controller");

// GET /api/location-cards
router.get("/location-cards", locationCardController.getAllLocationCards);

// Admin — GET all location cards (including inactive) for admin management
router.get("/admin/location-cards", locationCardController.getAllLocationCardsAdmin);
router.post("/admin/location-cards", upload.single("image"), locationCardController.createLocationCard);
router.put("/admin/location-cards/:id",  locationCardController.updateLocationCard);
router.delete("/admin/location-cards/:id",  locationCardController.deleteLocationCard);
router.post("/admin/location-cards/:id/image", upload.single("image"), locationCardController.uploadLocationCardImage);


module.exports = router;