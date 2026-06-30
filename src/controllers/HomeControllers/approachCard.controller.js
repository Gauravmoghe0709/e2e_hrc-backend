const ApproachCard = require("../../model/Home models/ApproachCard.model");
const uploadImage = require("../../services/storage.services");

// GET /api/approach-cards
const getActiveApproachCards = async (req, res) => {
    try {
        const cards = await ApproachCard.find({ isActive: true }).sort({ displayOrder: 1 });
        res.status(200).json({ success: true, message: "Approach cards fetched successfully", data: cards });
    } catch (error) {
        console.error("Error in getActiveApproachCards:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// GET /api/admin/approach-cards
const getAdminApproachCards = async (req, res) => {
    try {
        const cards = await ApproachCard.find().sort({ displayOrder: 1 });
        res.status(200).json({ success: true, message: "Admin approach cards fetched successfully", data: cards });
    } catch (error) {
        console.error("Error in getAdminApproachCards:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// POST /api/admin/approach-cards
const createApproachCard = async (req, res) => {
    try {
        const { title, subtitle, description, stat1Value, stat1Label, stat2Value, stat2Label, displayOrder, isActive } = req.body;

        if (!title || !subtitle || !description) {
            return res.status(400).json({ success: false, message: "Title, subtitle, and description are required" });
        }

        let imageUrl = "";

        if(req.file) {
            const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-approach-cards");
            imageUrl = uploadResponse.url;
        }


        const newCard = await ApproachCard.create({
              title,
            subtitle,
            description,
            image: imageUrl,
            stat1Value: stat1Value || "",
            stat1Label: stat1Label || "",
            stat2Value: stat2Value || "",
            stat2Label: stat2Label || "",
            displayOrder,
            isActive: isActive !== undefined ? isActive : true})

        res.status(201).json({ success: true, message: "Approach card created successfully", data: newCard });
    } catch (error) {
        console.error("Error in createApproachCard:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// PUT /api/admin/approach-cards/:id
const updateApproachCard = async (req, res) => {
    try {
        const { title, subtitle, description, image, stat1Value, stat1Label, stat2Value, stat2Label, displayOrder, isActive } = req.body;

        const updateData = { title, subtitle, description, image, stat1Value, stat1Label, stat2Value, stat2Label, displayOrder, isActive };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const updatedCard = await ApproachCard.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

        if (!updatedCard) {
            return res.status(404).json({ success: false, message: "Approach card not found" });
        }

        res.status(200).json({ success: true, message: "Approach card updated successfully", data: updatedCard });
    } catch (error) {
        console.error("Error in updateApproachCard:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// DELETE /api/admin/approach-cards/:id
const deleteApproachCard = async (req, res) => {
    try {
        const deletedCard = await ApproachCard.findByIdAndDelete(req.params.id);

        if (!deletedCard) {
            return res.status(404).json({ success: false, message: "Approach card not found" });
        }

        res.status(200).json({ success: true, message: "Approach card deleted successfully", data: null });
    } catch (error) {
        console.error("Error in deleteApproachCard:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// POST /api/admin/approach-cards/:id/image
const uploadApproachCardImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        const card = await ApproachCard.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ success: false, message: "Approach card not found" });
        }

        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-approach-cards");

        if (!uploadResponse || !uploadResponse.url) {
            return res.status(500).json({ success: false, message: "Failed to upload image to ImageKit" });
        }

        card.image = uploadResponse.url;
        await card.save();

        res.status(200).json({ success: true, message: "Approach card image uploaded successfully", data: card });
    } catch (error) {
        console.error("Error in uploadApproachCardImage:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    getActiveApproachCards,
    getAdminApproachCards,
    createApproachCard,
    updateApproachCard,
    deleteApproachCard,
    uploadApproachCardImage
};
