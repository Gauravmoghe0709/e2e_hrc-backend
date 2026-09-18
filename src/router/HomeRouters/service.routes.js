const express = require("express");
const router = express.Router();
const serviceController = require("../../controllers/HomeControllers/service.controller");
const sectorsController = require("../../controllers/HomeControllers/sectors.controller");
const protectedRoute = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload.middleware");

router.get("/services", serviceController.getActiveServices);

// Admin — GET all services (including inactive) for admin management
router.get("/admin/services", serviceController.getAllServicesAdmin);
router.post("/admin/services",protectedRoute, upload.single("image"), serviceController.createService);
router.put("/admin/services/:id",protectedRoute, serviceController.updateService);
router.delete("/admin/services/:id",protectedRoute, serviceController.deleteService);
router.post("/admin/services/:id/image",protectedRoute, upload.single("image"), serviceController.uploadServiceImage);

router.get("/sectors", sectorsController.getSectors);
router.post("/admin/sectors", protectedRoute, sectorsController.createSectors);
router.get("/admin/sectors", protectedRoute, sectorsController.getSectorsAdmin);
router.put("/admin/sectors/:id", protectedRoute, sectorsController.updateSectors);

module.exports = router;
