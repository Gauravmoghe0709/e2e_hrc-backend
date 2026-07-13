const WhyChoose = require("../../model/About models/WhyChooseE2E.model");
const uploadImage = require("../../services/storage.services");

// GET /api/why-choose
const getActiveWhyChoose = async (req, res) => {
    try {
        const items = await WhyChoose.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
        res.status(200).json({ success: true, message: "Why choose items fetched successfully", data: items });
    } catch (error) {
        console.error("Error in getActiveWhyChoose:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// GET /api/admin/why-choose
const getAdminWhyChoose = async (req, res) => {
    try {
        const items = await WhyChoose.find().sort({ order: 1, createdAt: 1 });
        res.status(200).json({ success: true, message: "Admin why choose items fetched successfully", data: items });
    } catch (error) {
        console.error("Error in getAdminWhyChoose:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// POST /api/admin/why-choose
const createWhyChoose = async (req, res) => {
    try {
        const { sectionTitle, sectionDescription, title, description, image, order, isActive } = req.body;

        if (!title || !description) {
            return res.status(400).json({ success: false, message: "Title and description are required" });
        }

        const newItem = await WhyChoose.create({
            sectionTitle: sectionTitle || "Why Choose E2E HRC?",
            sectionDescription: sectionDescription || "Delivering excellence through dedicated service and unparalleled market knowledge.",
            title,
            description,
            image: image || "",
            order: order !== undefined ? Number(order) : 0,
            isActive: isActive !== undefined ? isActive : true,
        });

        res.status(201).json({ success: true, message: "Why choose item created successfully", data: newItem });
    } catch (error) {
        console.error("Error in createWhyChoose:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// GET /api/admin/why-choose/:id
const getWhyChooseById = async (req, res) => {
    try {
        const item = await WhyChoose.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: "Why choose item not found" });
        }
        res.status(200).json({ success: true, message: "Why choose item fetched successfully", data: item });
    } catch (error) {
        console.error("Error in getWhyChooseById:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// PUT /api/admin/why-choose/:id
const updateWhyChoose = async (req, res) => {
    try {
        const { sectionTitle, sectionDescription, title, description , order, isActive } = req.body;

        const updateData = { sectionTitle, sectionDescription, title, description, order, isActive };
        Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

        const updatedItem = await WhyChoose.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!updatedItem) {
            return res.status(404).json({ success: false, message: "Why choose item not found" });
        }

        res.status(200).json({ success: true, message: "Why choose item updated successfully", data: updatedItem });
    } catch (error) {
        console.error("Error in updateWhyChoose:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// DELETE /api/admin/why-choose/:id
const deleteWhyChoose = async (req, res) => {
    try {
        const deletedItem = await WhyChoose.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ success: false, message: "Why choose item not found" });
        }
        res.status(200).json({ success: true, message: "Why choose item deleted successfully", data: null });
    } catch (error) {
        console.error("Error in deleteWhyChoose:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// POST /api/admin/why-choose/:id/image
const uploadWhyChooseImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        const item = await WhyChoose.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: "Why choose item not found" });
        }

        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-why-choose");
        if (!uploadResponse || !uploadResponse.url) {
            return res.status(500).json({ success: false, message: "Failed to upload image" });
        }

        item.image = uploadResponse.url;
        await item.save();

        res.status(200).json({ success: true, message: "Why choose image uploaded successfully", data: item });
    } catch (error) {
        console.error("Error in uploadWhyChooseImage:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    getActiveWhyChoose,
    getAdminWhyChoose,
    createWhyChoose,
    getWhyChooseById,
    updateWhyChoose,
    deleteWhyChoose,
    uploadWhyChooseImage,
};
