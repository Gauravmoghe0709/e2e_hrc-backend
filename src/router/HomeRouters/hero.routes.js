const express = require("express");
const router = express.Router();
const heroController = require("../../controllers/HomeControllers/hero.controller");
const protectedRoute = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload.middleware");


router.get("/hero/home", heroController.getActiveHero);

router.put("/admin/hero/home", heroController.createOrUpdateHero);

router.post(
    "/admin/hero/home/image",
    upload.single("image"),
    protectedRoute,
    heroController.uploadHeroImage
)

module.exports = router;
