const express = require("express");
const router = express.Router();
const serviceController = require("../../controllers/HomeControllers/service.controller");
const protectedRoute = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload.middleware");

router.get("/services", serviceController.getActiveServices);

// Admin — GET all services (including inactive) for admin management
router.get("/admin/services", protectedRoute, serviceController.getAllServicesAdmin);

router.post("/admin/services", protectedRoute, upload.single("image"), serviceController.createService);
router.put("/admin/services/:id", protectedRoute, upload.single("image"), serviceController.updateService);
router.delete("/admin/services/:id", protectedRoute, serviceController.deleteService);

router.post("/admin/services/:id/image", protectedRoute, upload.single("image"), serviceController.uploadServiceImage);

module.exports = router;
