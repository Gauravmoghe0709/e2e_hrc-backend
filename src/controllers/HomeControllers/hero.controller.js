const Hero = require("../../model/Home models/Hero.model");
const uploadImage = require("../../services/storage.services");

// GET /api/hero/home
const getActiveHero = async (req, res) => {
  try {
    const hero = await Hero.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!hero) {
      return res
        .status(404)
        .json({ success: false, message: "Active hero section not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Hero section fetched successfully",
        data: hero,
      });
  } catch (error) {
    console.error("Error in getActiveHero:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createOrUpdateHero = async (req, res) => {
  try {
    const {
      title,
      highlightedText,
      subtitle,
      description,
      buttonText,
      buttonLink,
      heroImage,
      stats,
      isActive,
    } = req.body;

    let hero = await Hero.findOne({ isActive: true });

    if (hero) {
      // Update existing
      hero.title = title || hero.title;
      hero.highlightedText = highlightedText !== undefined ? highlightedText : hero.highlightedText;
      hero.subtitle = subtitle !== undefined ? subtitle : hero.subtitle;
      hero.description = description !== undefined ? description : hero.description;
      hero.buttonText = buttonText !== undefined ? buttonText : hero.buttonText;
      hero.buttonLink = buttonLink !== undefined ? buttonLink : hero.buttonLink;
      if (stats !== undefined) {
        if (!Array.isArray(stats)) {
          return res.status(400).json({ success: false, message: "Stats must be an array" });
        }
        hero.stats = stats;
      }
      hero.heroImage = heroImage !== undefined ? heroImage : hero.heroImage;

      hero.isActive = isActive !== undefined ? isActive : hero.isActive;
      await hero.save();
    } else {
      // Create new
      hero = new Hero({
        title,
        highlightedText: highlightedText || "",
        subtitle,
        description,
        buttonText,
        buttonLink,
        ...(stats !== undefined ? { stats } : {}),
        heroImage,
        isActive,
      });
      await hero.save();
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Hero section updated successfully",
        data: hero,
      });
  } catch (error) {
    console.error("Error in createOrUpdateHero:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const uploadHeroImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const uploadResponse = await uploadImage(
      req.file.buffer,
      req.file.originalname,
      "e2e-hero",
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
      data: hero,
    });
  } catch (error) {
    console.error("Error in uploadHeroImage:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getActiveHero,
  createOrUpdateHero,
  uploadHeroImage,
};


/*const Hero = require("../../model/Home models/Hero.model");
const { uploadImage, deleteImage } = require("../../services/storage.services");
const removeBackground = require("../../services/backgroundRemoval.service");

// GET /api/hero/home
const getActiveHero = async (req, res) => {
  try {
    const hero = await Hero.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!hero) {
      return res
        .status(404)
        .json({ success: false, message: "Active hero section not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Hero section fetched successfully",
        data: hero,
      });
  } catch (error) {
    console.error("Error in getActiveHero:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createOrUpdateHero = async (req, res) => {
  try {
    const {
      title,
      highlightedText,
      subtitle,
      description,
      buttonText,
      buttonLink,
      heroImage,
      stats,
      isActive,
    } = req.body;

    let hero = await Hero.findOne({ isActive: true });

    if (hero) {
      // Update existing
      hero.title = title || hero.title;
      hero.highlightedText = highlightedText !== undefined ? highlightedText : hero.highlightedText;
      hero.subtitle = subtitle !== undefined ? subtitle : hero.subtitle;
      hero.description = description !== undefined ? description : hero.description;
      hero.buttonText = buttonText !== undefined ? buttonText : hero.buttonText;
      hero.buttonLink = buttonLink !== undefined ? buttonLink : hero.buttonLink;
      if (stats !== undefined) {
        if (!Array.isArray(stats)) {
          return res.status(400).json({ success: false, message: "Stats must be an array" });
        }
        hero.stats = stats;
      }
      
      // IMPORTANT: Only update heroImage if it's NOT a blob URL
      if (
        heroImage !== undefined &&
        !String(heroImage).startsWith("blob:")
      ) {
        hero.heroImage = heroImage;
      }

      hero.isActive = isActive !== undefined ? isActive : hero.isActive;
      await hero.save();
    } else {
      // Create new
      hero = new Hero({
        title,
        highlightedText: highlightedText || "",
        subtitle,
        description,
        buttonText,
        buttonLink,
        ...(stats !== undefined ? { stats } : {}),
        heroImage: (heroImage && !String(heroImage).startsWith("blob:")) ? heroImage : undefined,
        isActive,
      });
      await hero.save();
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Hero section updated successfully",
        data: hero,
      });
  } catch (error) {
    console.error("Error in createOrUpdateHero:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const uploadHeroImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    // Log received file info
    console.log("[Hero Image Upload] Received file:");
    console.log(`  - Filename: ${req.file.originalname}`);
    console.log(`  - MIME Type: ${req.file.mimetype}`);
    console.log(`  - File size: ${(req.file.size / 1024).toFixed(2)} KB`);

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
        console.warn(`[Hero Image Upload] Invalid file type: ${req.file.mimetype}`);
        return res.status(400).json({ success: false, message: "Invalid file type. Only JPG, PNG, and WebP are allowed." });
    }

    // Verify REMOVE_BG_API_KEY is configured
    if (!process.env.REMOVE_BG_API_KEY) {
      console.error("[Hero Image Upload] REMOVE_BG_API_KEY is not configured!");
      return res.status(500).json({ success: false, message: "Image processing service not configured on server." });
    }

    let processedBuffer;
    try {
        console.log("[Hero Image Upload] Starting background removal...");
        processedBuffer = await removeBackground(req.file.buffer);
        console.log(`[Hero Image Upload] Background removal completed. Processed buffer size: ${(processedBuffer.length / 1024).toFixed(2)} KB`);
    } catch (bgError) {
        console.error("[Hero Image Upload] Background removal failed:", bgError.message);
        return res.status(502).json({ success: false, message: "Failed to process image background. Please try again or contact support." });
    }

    const originalNameWithoutExt = req.file.originalname.split('.')[0];
    const newFileName = `${originalNameWithoutExt}-transparent.png`;

    console.log(`[Hero Image Upload] Uploading to ImageKit as: ${newFileName}`);
    const uploadResponse = await uploadImage(
      processedBuffer,
      newFileName,
      "e2e-hero",
    );
    console.log(`[Hero Image Upload] ImageKit upload completed. URL: ${uploadResponse.url}`);

    let hero = await Hero.findOne({ isActive: true });

    if (!hero) {
      hero = new Hero({ title: "Welcome", isActive: true });
    }

    if (hero.heroImageFileId) {
        console.log(`[Hero Image Upload] Deleting old image with fileId: ${hero.heroImageFileId}`);
        await deleteImage(hero.heroImageFileId);
    }

    hero.heroImage = uploadResponse.url;
    hero.heroImageFileId = uploadResponse.fileId;
    await hero.save();

    console.log("[Hero Image Upload] Hero model updated successfully");

    res.status(200).json({
      success: true,
      message: "Hero image uploaded and processed successfully",
      data: {
        heroImage: uploadResponse.url,
      },
    });
  } catch (error) {
    console.error("[Hero Image Upload] Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during image upload",
    });
  }
};

module.exports = {
  getActiveHero,
  createOrUpdateHero,
  uploadHeroImage,
}; */
