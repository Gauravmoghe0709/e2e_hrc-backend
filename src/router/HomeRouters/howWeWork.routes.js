const express = require("express");
const router = express.Router();
const howWeWorkController = require("../../controllers/HomeControllers/howWeWork.controller");
//const protectedRoute = require("../../middleware/auth.middleware");

// Public routes
router.get("/how-we-work", howWeWorkController.getActiveHowWeWork);

// Admin routes
router.get("/admin/how-we-work",  howWeWorkController.getAdminHowWeWork);
router.post("/admin/how-we-work",  howWeWorkController.createHowWeWork);
router.put("/admin/how-we-work",  howWeWorkController.updateHowWeWork);
router.put("/admin/how-we-work/employer-steps/:sectionId/:stepIndex", howWeWorkController.updateEmployerStep);
router.put("/admin/how-we-work/employee-steps/:sectionId/:stepIndex", howWeWorkController.updateEmployeeStep);
router.delete("/admin/how-we-work/employer-steps/:sectionId/:stepIndex", howWeWorkController.deleteEmployerStep);
router.delete("/admin/how-we-work/employee-steps/:sectionId/:stepIndex", howWeWorkController.deleteEmployeeStep);
router.delete("/admin/how-we-work", howWeWorkController.deleteHowWeWork);

module.exports = router;
