const TrustedByLogo = require("../../model/Home models/TrustedByLogo.model");
const uploadImage = require("../../services/storage.services");

// GET /api/trusted-by/logos — public, returns active logos
const getActiveLogs = async (req, res) => {
    try {
        const logos = await TrustedByLogo.find({ isActive: true }).sort({ order: 1 });
        res.status(200).json({
            success: true,
            message: "Logos fetched successfully",
            data: logos
        });
    } catch (error) {
        console.error("Error in getActiveLogs:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// GET /api/admin/trusted-by-logos — admin, returns all logos (active + inactive)
const getAdminLogos = async (req, res) => {
    try {
        const logos = await TrustedByLogo.find().sort({ order: 1 });
        res.status(200).json({
            success: true,
            message: "All logos fetched successfully",
            data: logos
        });
    } catch (error) {
        console.error("Error in getAdminLogos:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// GET /api/admin/trusted-by-logos/:id — get single logo by id
const getLogoById = async (req, res) => {
    try {
        const logo = await TrustedByLogo.findById(req.params.id);

        if (!logo) {
            return res.status(404).json({ success: false, message: "Logo not found" });
        }

        res.status(200).json({
            success: true,
            message: "Logo fetched successfully",
            data: logo
        });
    } catch (error) {
        console.error("Error in getLogoById:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// POST /api/admin/trusted-by-logos — create logo with image (max 10 logos)
const createLogo = async (req, res) => {
    try {
        const { companyName, order, isActive, websiteUrl } = req.body;

        if (!companyName) {
            return res.status(400).json({
                success: false,
                message: "Company name is required"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Logo image is required"
            });
        }

        // Check maximum 10 logos limit
        const logoCount = await TrustedByLogo.countDocuments();
        if (logoCount >= 10) {
            return res.status(400).json({
                success: false,
                message: "Maximum 10 logos allowed"
            });
        }

        // Upload image
        const uploadResponse = await uploadImage(
            req.file.buffer,
            req.file.originalname,
            "e2e-trusted-by"
        );

        const logoUrl = uploadResponse.url;

        const newLogo = await TrustedByLogo.create({
            companyName,
            logo: logoUrl,
            order: order || 0,
            isActive: isActive ?? true,
            websiteUrl: websiteUrl || null
        });

        res.status(201).json({
            success: true,
            message: "Logo created successfully",
            data: newLogo
        });
    } catch (error) {
        console.error("Error in createLogo:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// PUT /api/admin/trusted-by-logos/:id — update logo details (not image)
const updateLogo = async (req, res) => {
    try {
        const { companyName, order, isActive, websiteUrl } = req.body;

        const updateData = { companyName, order, isActive, websiteUrl };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const updatedLogo = await TrustedByLogo.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedLogo) {
            return res.status(404).json({ success: false, message: "Logo not found" });
        }

        res.status(200).json({
            success: true,
            message: "Logo updated successfully",
            data: updatedLogo
        });
    } catch (error) {
        console.error("Error in updateLogo:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// DELETE /api/admin/trusted-by-logos/:id — delete logo
const deleteLogo = async (req, res) => {
    try {
        const deletedLogo = await TrustedByLogo.findByIdAndDelete(req.params.id);

        if (!deletedLogo) {
            return res.status(404).json({ success: false, message: "Logo not found" });
        }

        res.status(200).json({
            success: true,
            message: "Logo deleted successfully",
            data: null
        });
    } catch (error) {
        console.error("Error in deleteLogo:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// PATCH /api/admin/trusted-by-logos/:id/logo — upload/replace logo image
const uploadLogoImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided"
            });
        }

        const logo = await TrustedByLogo.findById(req.params.id);
        if (!logo) {
            return res.status(404).json({ success: false, message: "Logo not found" });
        }

        const uploadResponse = await uploadImage(
            req.file.buffer,
            req.file.originalname,
            "e2e-trusted-by"
        );

        if (!uploadResponse || !uploadResponse.url) {
            return res.status(500).json({
                success: false,
                message: "Failed to upload image"
            });
        }

        logo.logo = uploadResponse.url;
        await logo.save();

        res.status(200).json({
            success: true,
            message: "Logo image uploaded successfully",
            data: logo
        });
    } catch (error) {
        console.error("Error in uploadLogoImage:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    getActiveLogs,
    getAdminLogos,
    getLogoById,
    createLogo,
    updateLogo,
    deleteLogo,
    uploadLogoImage
};
