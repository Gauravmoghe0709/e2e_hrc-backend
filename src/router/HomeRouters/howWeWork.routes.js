const express = require("express");
const router = express.Router();
const howWeWorkController = require("../../controllers/HomeControllers/howWeWork.controller");
const protectedRoute = require("../../middleware/auth.middleware");

// Public routes
router.get("/how-we-work", howWeWorkController.getActiveHowWeWork);

// Admin routes
router.get("/admin/how-we-work",protectedRoute, howWeWorkController.getAdminHowWeWork);
router.post("/admin/how-we-work",protectedRoute, howWeWorkController.createHowWeWork);
router.put("/admin/how-we-work",protectedRoute, howWeWorkController.updateHowWeWork);
router.put("/admin/how-we-work/employer-steps/:sectionId/:stepIndex", protectedRoute,howWeWorkController.updateEmployerStep);
router.put("/admin/how-we-work/employee-steps/:sectionId/:stepIndex",protectedRoute, howWeWorkController.updateEmployeeStep);
router.delete("/admin/how-we-work/employer-steps/:sectionId/:stepIndex",protectedRoute, howWeWorkController.deleteEmployerStep);
router.delete("/admin/how-we-work/employee-steps/:sectionId/:stepIndex",protectedRoute, howWeWorkController.deleteEmployeeStep);
router.delete("/admin/how-we-work",protectedRoute, howWeWorkController.deleteHowWeWork);

module.exports = router;
