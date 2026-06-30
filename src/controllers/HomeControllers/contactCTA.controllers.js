const contactCTAmodel = require("../../model/Home models/contactCTA.model");

// POST /api/admin/contact-cta — Create a new CTA record
async function createcontactCTA(req, res) {
    try {
        const {
            badgeText, headingLine1, highlightText, headingLine2,
            description, feature1, feature2, button1Text, button2Text, isActive
        } = req.body;

        if (!headingLine1 || !highlightText || !headingLine2 || !description) {
            return res.status(400).json({
                success: false,
                message: "headingLine1, highlightText, headingLine2, and description are required"
            });
        }

        const contactCTA = new contactCTAmodel({
            badgeText, headingLine1, highlightText, headingLine2,
            description, feature1, feature2, button1Text, button2Text, isActive
        });
        await contactCTA.save();
        res.status(201).json({ success: true, message: "Contact CTA created successfully", data: contactCTA });
    } catch (error) {
        console.error("Error in createcontactCTA:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// GET /api/contact-cta — Fetch current CTA (returns first/only record)
async function getcontactCTA(req, res) {
    try {
        const contactCTA = await contactCTAmodel.findOne().sort({ createdAt: -1 });
        if (!contactCTA) {
            return res.status(404).json({ success: false, message: "No Contact CTA found" });
        }
        res.status(200).json({ success: true, message: "Contact CTA fetched successfully", data: contactCTA });
    } catch (error) {
        console.error("Error in getcontactCTA:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// PUT /api/admin/contact-cta/:id — Update existing CTA by ID
async function updatecontactCTA(req, res) {
    try {
        const { id } = req.params;
        const {
            badgeText, headingLine1, highlightText, headingLine2,
            description, feature1, feature2, button1Text, button2Text, isActive
        } = req.body;

        const updateData = {
            badgeText, headingLine1, highlightText, headingLine2,
            description, feature1, feature2, button1Text, button2Text, isActive
        };

        // Remove undefined fields so we don't wipe existing data
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const contactCTA = await contactCTAmodel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!contactCTA) {
            return res.status(404).json({ success: false, message: "Contact CTA not found" });
        }
        res.status(200).json({ success: true, message: "Contact CTA updated successfully", data: contactCTA });
    } catch (error) {
        console.error("Error in updatecontactCTA:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// PUT /api/admin/contact-cta — Upsert: update the single CTA record or create if none exists
async function upsertcontactCTA(req, res) {
    try {
        const {
            badgeText, headingLine1, highlightText, headingLine2,
            description, feature1, feature2, button1Text, button2Text, isActive
        } = req.body;

        if (!headingLine1 || !highlightText || !headingLine2 || !description) {
            return res.status(400).json({
                success: false,
                message: "headingLine1, highlightText, headingLine2, and description are required"
            });
        }

        const updateData = {
            badgeText, headingLine1, highlightText, headingLine2,
            description, feature1, feature2, button1Text, button2Text, isActive
        };
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        // Find the most recent record and update it, or create a new one
        let contactCTA = await contactCTAmodel.findOne().sort({ createdAt: -1 });
        if (contactCTA) {
            Object.assign(contactCTA, updateData);
            await contactCTA.save();
        } else {
            contactCTA = new contactCTAmodel(updateData);
            await contactCTA.save();
        }

        res.status(200).json({ success: true, message: "Contact CTA saved successfully", data: contactCTA });
    } catch (error) {
        console.error("Error in upsertcontactCTA:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = {
    createcontactCTA,
    getcontactCTA,
    updatecontactCTA,
    upsertcontactCTA,
};