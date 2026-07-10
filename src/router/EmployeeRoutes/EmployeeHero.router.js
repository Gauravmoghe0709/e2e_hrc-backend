const express = require("express");
const router = express.Router();
const employeeHeroController = require("../../controllers/EmployeeControllers/EmployeeHero.controller");
//const protectedRoute = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload.middleware");

// Public API
router.get("/employee-hero", employeeHeroController.getPublicEmployeeHero);

// Admin APIs
router.post(
    "/admin/employee-hero",
    upload.fields([
        { name: "leftTopImage", maxCount: 1 },
        { name: "leftBottomImage", maxCount: 1 },
        { name: "rightImage", maxCount: 1 }
    ]),
    employeeHeroController.createEmployeeHero
);

router.get("/admin/employee-hero", employeeHeroController.getAdminEmployeeHeroes);

router.put("/admin/employee-hero/:id", employeeHeroController.updateEmployeeHero);

router.delete("/admin/employee-hero/:id", employeeHeroController.deleteEmployeeHero);

router.patch(
    "/admin/employee-hero/:id/left-top-image",
    upload.single("leftTopImage"),
    employeeHeroController.updateLeftTopImage
);

router.patch(
    "/admin/employee-hero/:id/left-bottom-image",
    upload.single("leftBottomImage"),
    employeeHeroController.updateLeftBottomImage
);

router.patch(
    "/admin/employee-hero/:id/right-image",
    upload.single("rightImage"),
    employeeHeroController.updateRightImage
);

module.exports = router;
