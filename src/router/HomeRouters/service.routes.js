const express = require("express");
const router = express.Router();
const serviceController = require("../../controllers/HomeControllers/service.controller");
//const protectedRoute = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload.middleware");

router.get("/services", serviceController.getActiveServices);

// Admin — GET all services (including inactive) for admin management
router.get("/admin/services", serviceController.getAllServicesAdmin);

router.post("/admin/services",  upload.single("image"), serviceController.createService);
router.put("/admin/services/:id",serviceController.updateService);
router.delete("/admin/services/:id", serviceController.deleteService);

router.post("/admin/services/:id/image", upload.single("image"), serviceController.uploadServiceImage);

module.exports = router;
