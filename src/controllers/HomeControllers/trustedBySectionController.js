const TrustedBySection = require("../../model/Home models/TrustedBySection.model");

// GET /api/trusted-by — public, returns active section
const getActiveSection = async (req, res) => {
    try {
        const section = await TrustedBySection.findOne({ isActive: true });
        if (!section) {
            return res.status(404).json({ success: false, message: "Trusted By section not found" });
        }
        res.status(200).json({ success: true, message: "Section fetched successfully", data: section });
    } catch (error) {
        console.error("Error in getActiveSection:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// GET /api/admin/trusted-by-section — admin, returns the section for editing
const getAdminSection = async (req, res) => {
    try {
        const section = await TrustedBySection.findOne();
        if (!section) {
            return res.status(404).json({ success: false, message: "Trusted By section not found" });
        }
        res.status(200).json({ success: true, message: "Section fetched successfully", data: section });
    } catch (error) {
        console.error("Error in getAdminSection:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// POST /api/admin/trusted-by-section — create section (if doesn't exist)
const createSection = async (req, res) => {
    try {
        const { badgeText, title, isActive } = req.body;

        if (!badgeText || !title) {
            return res.status(400).json({
                success: false,
                message: "Badge text and title are required"
            });
        }

        // Check if section already exists
        const existing = await TrustedBySection.findOne();
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Trusted By section already exists. Use update to modify it."
            });
        }

        const newSection = await TrustedBySection.create({
            badgeText,
            title,
            isActive: isActive ?? true
        });

        res.status(201).json({
            success: true,
            message: "Section created successfully",
            data: newSection
        });
    } catch (error) {
        console.error("Error in createSection:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// PUT /api/admin/trusted-by-section/:id — update section
const updateSection = async (req, res) => {
    try {
        const { badgeText, title, isActive } = req.body;

        const updateData = { badgeText, title, isActive };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const updatedSection = await TrustedBySection.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedSection) {
            return res.status(404).json({ success: false, message: "Section not found" });
        }

        res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection
        });
    } catch (error) {
        console.error("Error in updateSection:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// DELETE /api/admin/trusted-by-section/:id — delete section
const deleteSection = async (req, res) => {
    try {
        const deletedSection = await TrustedBySection.findByIdAndDelete(req.params.id);

        if (!deletedSection) {
            return res.status(404).json({ success: false, message: "Section not found" });
        }

        res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            data: null
        });
    } catch (error) {
        console.error("Error in deleteSection:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    getActiveSection,
    getAdminSection,
    createSection,
    updateSection,
    deleteSection
};
