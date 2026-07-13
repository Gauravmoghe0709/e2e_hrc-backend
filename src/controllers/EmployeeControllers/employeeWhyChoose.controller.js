const EmployeeWhyChooseSection = require("../../model/Employee models/EmployeeWhyChooseSection.model");
const EmployeeWhyChooseCard = require("../../model/Employee models/EmployeeWhyChooseCard.model");
const mongoose = require("mongoose");
const uploadImage = require("../../services/storage.services");

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

const parseBoolean = (value, defaultValue = true) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }
  if (typeof value === "boolean") {
    return value;
  }
  return value.toString().toLowerCase() === "true";
};

const parseOrder = (value) => {
  if (value === undefined || value === "") {
    return 0;
  }
  const parsed = Number(value);
  if (isNaN(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
};

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════

// GET /api/employee-why-choose
exports.getPublicEmployeeWhyChoose = async (req, res) => {
  try {
    const activeSection = await EmployeeWhyChooseSection.findOne({ isActive: true });
    const activeCards = await EmployeeWhyChooseCard.find({ isActive: true }).sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      data: {
        section: activeSection,
        cards: activeCards,
      },
    });
  } catch (error) {
    console.error("Error fetching Employee Why Choose public data:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTION ADMIN APIS
// ═══════════════════════════════════════════════════════════════════════════

// POST /api/admin/employee-why-choose-section
exports.createEmployeeWhyChooseSection = async (req, res) => {
  try {
    let { badgeText, sectionTitle, isActive } = req.body;

    if (!sectionTitle || !sectionTitle.trim()) {
      return res.status(400).json({ success: false, message: "Section title is required" });
    }

    badgeText = badgeText ? badgeText.trim() : "";
    sectionTitle = sectionTitle.trim();
    const activeStatus = parseBoolean(isActive, true);

    if (activeStatus) {
      await EmployeeWhyChooseSection.updateMany({}, { isActive: false });
    }

    const newSection = await EmployeeWhyChooseSection.create({
      badgeText,
      sectionTitle,
      isActive: activeStatus,
    });

    res.status(201).json({
      success: true,
      message: "Employee Why Choose section created successfully",
      data: newSection,
    });
  } catch (error) {
    console.error("Error creating Employee Why Choose section:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// GET /api/admin/employee-why-choose-section
exports.getAdminEmployeeWhyChooseSections = async (req, res) => {
  try {
    const sections = await EmployeeWhyChooseSection.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: sections });
  } catch (error) {
    console.error("Error fetching Employee Why Choose sections:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// PUT /api/admin/employee-why-choose-section/:id
exports.updateEmployeeWhyChooseSection = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid section ID" });
    }

    let { badgeText, sectionTitle, isActive } = req.body;
    let updateData = {};

    if (badgeText !== undefined) {
      updateData.badgeText = badgeText.trim();
    }

    if (sectionTitle !== undefined) {
      if (!sectionTitle.trim()) {
        return res.status(400).json({ success: false, message: "Section title cannot be empty" });
      }
      updateData.sectionTitle = sectionTitle.trim();
    }

    if (isActive !== undefined) {
      const activeStatus = parseBoolean(isActive, true);
      updateData.isActive = activeStatus;

      if (activeStatus) {
        await EmployeeWhyChooseSection.updateMany({ _id: { $ne: id } }, { isActive: false });
      }
    }

    const updatedSection = await EmployeeWhyChooseSection.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
    });

    if (!updatedSection) {
      return res.status(404).json({ success: false, message: "Employee Why Choose section not found" });
    }

    res.status(200).json({
      success: true,
      message: "Employee Why Choose section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error("Error updating Employee Why Choose section:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// DELETE /api/admin/employee-why-choose-section/:id
exports.deleteEmployeeWhyChooseSection = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid section ID" });
    }

    const deletedSection = await EmployeeWhyChooseSection.findByIdAndDelete(id);

    if (!deletedSection) {
      return res.status(404).json({ success: false, message: "Employee Why Choose section not found" });
    }

    res.status(200).json({ success: true, message: "Employee Why Choose section deleted successfully" });
  } catch (error) {
    console.error("Error deleting Employee Why Choose section:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// CARD ADMIN APIS
// ═══════════════════════════════════════════════════════════════════════════

// POST /api/admin/employee-why-choose-cards
exports.createEmployeeWhyChooseCard = async (req, res) => {
  try {
    let { eyebrowText, title, description, stat1Value, stat1Label, stat2Value, stat2Label, order, isActive } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Card title is required" });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: "Card description is required" });
    }

    const parsedOrder = parseOrder(order);
    if (parsedOrder === null) {
      return res.status(400).json({ success: false, message: "Order must be a valid non-negative number" });
    }

    eyebrowText = eyebrowText ? eyebrowText.trim() : "";
    title = title.trim();
    description = description.trim();
    stat1Value = stat1Value ? stat1Value.trim() : "";
    stat1Label = stat1Label ? stat1Label.trim() : "";
    stat2Value = stat2Value ? stat2Value.trim() : "";
    stat2Label = stat2Label ? stat2Label.trim() : "";
    const activeStatus = parseBoolean(isActive, true);

    let imageUrl = "";
    if (req.file) {
      const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "employee-why-choose");
      imageUrl = uploadResponse?.url || uploadResponse?.filePath || "";
    }

    const newCard = await EmployeeWhyChooseCard.create({
      eyebrowText,
      title,
      description,
      image: imageUrl,
      stat1Value,
      stat1Label,
      stat2Value,
      stat2Label,
      order: parsedOrder,
      isActive: activeStatus,
    });

    res.status(201).json({
      success: true,
      message: "Employee Why Choose card created successfully",
      data: newCard,
    });
  } catch (error) {
    console.error("Error creating Employee Why Choose card:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// GET /api/admin/employee-why-choose-cards
exports.getAdminEmployeeWhyChooseCards = async (req, res) => {
  try {
    const cards = await EmployeeWhyChooseCard.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, data: cards });
  } catch (error) {
    console.error("Error fetching Employee Why Choose cards:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// PUT /api/admin/employee-why-choose-cards/:id
exports.updateEmployeeWhyChooseCard = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid card ID" });
    }

    let { eyebrowText, title, description, stat1Value, stat1Label, stat2Value, stat2Label, order, isActive } = req.body;
    let updateData = {};

    const card = await EmployeeWhyChooseCard.findById(id);
    if (!card) {
      return res.status(404).json({ success: false, message: "Employee Why Choose card not found" });
    }

    if (eyebrowText !== undefined) {
      updateData.eyebrowText = eyebrowText.trim();
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ success: false, message: "Card title cannot be empty" });
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({ success: false, message: "Card description cannot be empty" });
      }
      updateData.description = description.trim();
    }

    if (stat1Value !== undefined) {
      updateData.stat1Value = stat1Value.trim();
    }

    if (stat1Label !== undefined) {
      updateData.stat1Label = stat1Label.trim();
    }

    if (stat2Value !== undefined) {
      updateData.stat2Value = stat2Value.trim();
    }

    if (stat2Label !== undefined) {
      updateData.stat2Label = stat2Label.trim();
    }

    if (order !== undefined && order !== "") {
      const parsedOrder = parseOrder(order);
      if (parsedOrder === null) {
        return res.status(400).json({ success: false, message: "Order must be a valid non-negative number" });
      }
      updateData.order = parsedOrder;
    }

    if (isActive !== undefined) {
      updateData.isActive = parseBoolean(isActive, true);
    }

    if (req.file) {
      const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "employee-why-choose");
      updateData.image = uploadResponse?.url || uploadResponse?.filePath || card.image;
    }

    const updatedCard = await EmployeeWhyChooseCard.findByIdAndUpdate(id, updateData, { returnDocument: "after" });

    res.status(200).json({
      success: true,
      message: "Employee Why Choose card updated successfully",
      data: updatedCard,
    });
  } catch (error) {
    console.error("Error updating Employee Why Choose card:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// PATCH /api/admin/employee-why-choose-cards/:id/image
exports.updateEmployeeWhyChooseCardImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid card ID" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    const card = await EmployeeWhyChooseCard.findById(id);
    if (!card) {
      return res.status(404).json({ success: false, message: "Employee Why Choose card not found" });
    }

    const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "employee-why-choose");
    const imageUrl = uploadResponse?.url || uploadResponse?.filePath || "";

    const updatedCard = await EmployeeWhyChooseCard.findByIdAndUpdate(id, { image: imageUrl }, { returnDocument: "after" });

    res.status(200).json({
      success: true,
      message: "Employee Why Choose card image updated successfully",
      data: updatedCard,
    });
  } catch (error) {
    console.error("Error updating Employee Why Choose card image:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// DELETE /api/admin/employee-why-choose-cards/:id
exports.deleteEmployeeWhyChooseCard = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid card ID" });
    }

    const deletedCard = await EmployeeWhyChooseCard.findByIdAndDelete(id);

    if (!deletedCard) {
      return res.status(404).json({ success: false, message: "Employee Why Choose card not found" });
    }

    res.status(200).json({ success: true, message: "Employee Why Choose card deleted successfully" });
  } catch (error) {
    console.error("Error deleting Employee Why Choose card:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
