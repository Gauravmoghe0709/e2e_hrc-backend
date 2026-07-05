const express = require("express");
const router = express.Router();
//const protectedRoute = require("../../middleware/auth.middleware");
const employeeCardController = require("../../controllers/HomeControllers/employeeCard.controller");

// Public route to get active employee cards
router.get("/employeecard", employeeCardController.getActiveEmployeeCards);

// Admin routes
router.get("/admin/employeecard",employeeCardController.getAdminEmployeeCards);
router.post("/admin/employeecard", employeeCardController.createEmployeeCard);
router.put("/admin/employeecard/:id", employeeCardController.updateEmployeeCard);
router.delete("/admin/employeecard/:id",  employeeCardController.deleteEmployeeCard);

module.exports = router;
