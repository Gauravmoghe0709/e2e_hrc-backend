const MissionVision = require("../../model/About models/MissionVision.model");

const createMissionVision = async (req, res) => {
  try {
    const { type, icon, title, description, order, isActive } = req.body;

    if (!type || !["mission", "vision"].includes(type)) {
      return res.status(400).json({ success: false, message: "Type must be either mission or vision" });
    }

    if (!title?.toString().trim() || !description?.toString().trim()) {
      return res.status(400).json({ success: false, message: "Title and description are required" });
    }

    const item = await MissionVision.create({
      type,
      icon: icon || "",
      title: title.toString().trim(),
      description: description.toString().trim(),
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({ success: true, message: "Mission/Vision item created successfully", data: item });
  } catch (error) {
    console.error("Error in createMissionVision:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getMissionVision = async (req, res) => {
  try {
    const items = await MissionVision.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, message: "Mission/Vision items fetched successfully", data: items });
  } catch (error) {
    console.error("Error in getMissionVision:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAdminMissionVision = async (req, res) => {
  try {
    const items = await MissionVision.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, message: "Admin mission/vision items fetched successfully", data: items });
  } catch (error) {
    console.error("Error in getAdminMissionVision:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getMissionVisionById = async (req, res) => {
  try {
    const item = await MissionVision.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Mission/Vision item not found" });
    }
    res.status(200).json({ success: true, message: "Mission/Vision item fetched successfully", data: item });
  } catch (error) {
    console.error("Error in getMissionVisionById:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateMissionVision = async (req, res) => {
  try {
    const { type, icon, title, description, order, isActive } = req.body;
    if (type !== undefined && !["mission", "vision"].includes(type)) {
      return res.status(400).json({ success: false, message: "Type must be either mission or vision" });
    }

    const updateData = { type, icon, title, description, order, isActive };
    Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

    if (updateData.title !== undefined && !updateData.title.toString().trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    if (updateData.description !== undefined && !updateData.description.toString().trim()) {
      return res.status(400).json({ success: false, message: "Description is required" });
    }

    const item = await MissionVision.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).json({ success: false, message: "Mission/Vision item not found" });
    }

    res.status(200).json({ success: true, message: "Mission/Vision item updated successfully", data: item });
  } catch (error) {
    console.error("Error in updateMissionVision:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteMissionVision = async (req, res) => {
  try {
    const item = await MissionVision.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Mission/Vision item not found" });
    }
    res.status(200).json({ success: true, message: "Mission/Vision item deleted successfully", data: null });
  } catch (error) {
    console.error("Error in deleteMissionVision:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createMissionVision,
  getMissionVision,
  getAdminMissionVision,
  getMissionVisionById,
  updateMissionVision,
  deleteMissionVision,
};
