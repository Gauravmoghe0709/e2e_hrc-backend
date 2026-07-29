const express = require("express");
const router = express.Router();
const employeeHeroController = require("../../controllers/EmployeeControllers/EmployeeHero.controller");
const employeeJourneySectionController = require("../../controllers/EmployeeControllers/employeeJourneySection.controller");
const employeeJourneyCardController = require("../../controllers/EmployeeControllers/employeeJourneyCard.controller");
const employeeJourneyController = require("../../controllers/EmployeeControllers/employeeJourney.controller");
const employeeWhyChooseController = require("../../controllers/EmployeeControllers/employeeWhyChoose.controller");
const employeeFaqController = require ("../../controllers/EmployeeControllers/EmployeeFAQ.controller")
const protectedRoute = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload.middleware");

// Public API
router.get("/employee-hero", employeeHeroController.getPublicEmployeeHero);
router.get("/employee-journey", employeeJourneyController.getPublicEmployeeJourney);
router.get("/employee-why-choose", employeeWhyChooseController.getPublicEmployeeWhyChoose);

// Admin APIs
router.post(
    "/admin/employee-hero",
    protectedRoute,
    upload.fields([
        { name: "leftTopImage", maxCount: 1 },
        { name: "leftBottomImage", maxCount: 1 },
        { name: "rightImage", maxCount: 1 }
    ]),
    employeeHeroController.createEmployeeHero
);

router.get("/admin/employee-hero",protectedRoute, employeeHeroController.getAdminEmployeeHeroes);

router.put("/admin/employee-hero/:id",protectedRoute, employeeHeroController.updateEmployeeHero);

router.delete("/admin/employee-hero/:id",protectedRoute, employeeHeroController.deleteEmployeeHero);

router.patch(
    "/admin/employee-hero/:id/left-top-image",
    protectedRoute,
    upload.single("leftTopImage"),
    employeeHeroController.updateLeftTopImage
);

router.patch(
    "/admin/employee-hero/:id/left-bottom-image",
    protectedRoute,
    upload.single("leftBottomImage"),
    employeeHeroController.updateLeftBottomImage
);

router.patch(
    "/admin/employee-hero/:id/right-image",
    protectedRoute,
    upload.single("rightImage"),
    employeeHeroController.updateRightImage
);

// Employee Journey Section Admin APIs
router.post("/admin/employee-journey-section",protectedRoute, employeeJourneySectionController.createEmployeeJourneySection);
router.get("/admin/employee-journey-section", protectedRoute,employeeJourneySectionController.getAdminEmployeeJourneySections);
router.put("/admin/employee-journey-section/:id",protectedRoute, employeeJourneySectionController.updateEmployeeJourneySection);
router.delete("/admin/employee-journey-section/:id",protectedRoute, employeeJourneySectionController.deleteEmployeeJourneySection);

// Employee Journey Cards Admin APIs
router.post("/admin/employee-journey-cards",protectedRoute, employeeJourneyCardController.createEmployeeJourneyCard);
router.get("/admin/employee-journey-cards",protectedRoute, employeeJourneyCardController.getAdminEmployeeJourneyCards);
router.put("/admin/employee-journey-cards/:id",protectedRoute, employeeJourneyCardController.updateEmployeeJourneyCard);
router.delete("/admin/employee-journey-cards/:id",protectedRoute, employeeJourneyCardController.deleteEmployeeJourneyCard);

// Employee Why Choose Section Admin APIs
router.post("/admin/employee-why-choose-section",protectedRoute, employeeWhyChooseController.createEmployeeWhyChooseSection);
router.get("/admin/employee-why-choose-section",protectedRoute, employeeWhyChooseController.getAdminEmployeeWhyChooseSections);
router.put("/admin/employee-why-choose-section/:id",protectedRoute, employeeWhyChooseController.updateEmployeeWhyChooseSection);
router.delete("/admin/employee-why-choose-section/:id",protectedRoute, employeeWhyChooseController.deleteEmployeeWhyChooseSection);

// Employee Why Choose Cards Admin APIs
router.post("/admin/employee-why-choose-cards",protectedRoute, upload.single("image"), employeeWhyChooseController.createEmployeeWhyChooseCard);
router.get("/admin/employee-why-choose-cards", protectedRoute,employeeWhyChooseController.getAdminEmployeeWhyChooseCards);
router.put("/admin/employee-why-choose-cards/:id",protectedRoute, upload.single("image"), employeeWhyChooseController.updateEmployeeWhyChooseCard);
router.patch("/admin/employee-why-choose-cards/:id/image",protectedRoute, upload.single("image"), employeeWhyChooseController.updateEmployeeWhyChooseCardImage);
router.delete("/admin/employee-why-choose-cards/:id",protectedRoute, employeeWhyChooseController.deleteEmployeeWhyChooseCard);

// Employee FAQ 

router.get("/employee/faq", employeeFaqController.getemployeeFAQ);
// Admin routes
router.post("/admin/employee/faq",protectedRoute, employeeFaqController.createemployeeFAQ);
router.get("/admin/employee/faq", protectedRoute,employeeFaqController.getAdminemployeeFAQ);
router.put("/admin/employee/faq/:id",protectedRoute, employeeFaqController.updateemployeeFAQ);
router.delete("/admin/employee/faq/:id",protectedRoute, employeeFaqController.deleteemployeeFAQ);

// employee CTA routes

// Public API
router.get("/employee/cta", employeeFaqController.getemployeeCTA);

// Admin routes
router.post("/admin/employee/cta",protectedRoute, employeeFaqController.createemployeeCTA);
router.get("/admin/employee/cta",protectedRoute, employeeFaqController.getAdminemployeeCTA);
router.put("/admin/employee/cta/:id",protectedRoute, employeeFaqController.updateemployeeCTA);
router.delete("/admin/employee/cta/:id",protectedRoute, employeeFaqController.deleteemployeeCTA);


module.exports = router;
