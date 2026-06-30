const Hero = require("../../model/Home models/Hero.model");
const uploadImage = require("../../services/storage.services");

// GET /api/hero/home
const getActiveHero = async (req, res) => {
    try {
        const hero = await Hero.findOne({ isActive: true }).sort({ createdAt: -1 });
        if (!hero) {
            return res.status(404).json({ success: false, message: "Active hero section not found" });
        }
        res.status(200).json({ success: true, message: "Hero section fetched successfully", data: hero });
    } catch (error) {
        console.error("Error in getActiveHero:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const createOrUpdateHero = async (req, res) => {
    try {
        const { title, subtitle, description, buttonText, buttonLink, heroImage, isActive } = req.body;

        let hero = await Hero.findOne({ isActive: true });

        if (hero) {
            // Update existing
            hero.title = title || hero.title;
            hero.subtitle = subtitle !== undefined ? subtitle : hero.subtitle;
            hero.description = description !== undefined ? description : hero.description;
            hero.buttonText = buttonText !== undefined ? buttonText : hero.buttonText;
            hero.buttonLink = buttonLink !== undefined ? buttonLink : hero.buttonLink;
            hero.heroImage = heroImage !== undefined ? heroImage : hero.heroImage;
            hero.isActive = isActive !== undefined ? isActive : hero.isActive;
            await hero.save();
        } else {
            // Create new
            hero = new Hero({
                title, subtitle, description, buttonText, buttonLink, heroImage, isActive
            });
            await hero.save();
        }

        res.status(200).json({ success: true, message: "Hero section updated successfully", data: hero });
    } catch (error) {
        console.error("Error in createOrUpdateHero:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const uploadHeroImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided"
            });
        }

        const uploadResponse = await uploadImage(
            req.file.buffer,
            req.file.originalname,
            "e2e-hero"
        );

        let hero = await Hero.findOne({ isActive: true });

        if (!hero) {
            hero = new Hero({ title: "Welcome", isActive: true });
        }

        hero.heroImage = uploadResponse.url;
        await hero.save();

        res.status(200).json({
            success: true,
            message: "Hero image uploaded successfully",
            data: hero
        });

    } catch (error) {
        console.error("Error in uploadHeroImage:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    getActiveHero,
    createOrUpdateHero,
    uploadHeroImage
};
