const EmployeeJourneySection = require("../../model/Employee models/EmployeeJourneySection.model");
const mongoose = require("mongoose");

// POST /admin/employee-journey-section
exports.createEmployeeJourneySection = async (req, res) => {
  try {
    let { badgeText, sectionTitle, isActive } = req.body;

    if (!sectionTitle || !sectionTitle.trim()) {
      return res.status(400).json({ success: false, message: "sectionTitle is required" });
    }

    badgeText = badgeText ? badgeText.trim() : undefined;
    sectionTitle = sectionTitle.trim();
    // safely convert isActive
    let activeStatus = true;
    if (isActive !== undefined) {
      activeStatus = isActive === "true" || isActive === true;
    }

    // if creating active, deactivate others
    if (activeStatus) {
      await EmployeeJourneySection.updateMany({}, { isActive: false });
    }

    const newSection = await EmployeeJourneySection.create({
      badgeText,
      sectionTitle,
      isActive: activeStatus,
    });

    res.status(201).json({ success: true, message: "Section created successfully", data: newSection });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// GET /admin/employee-journey-section
exports.getAdminEmployeeJourneySections = async (req, res) => {
  try {
    const sections = await EmployeeJourneySection.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// PUT /admin/employee-journey-section/:id
exports.updateEmployeeJourneySection = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Section ID" });
    }

    let { badgeText, sectionTitle, isActive } = req.body;
    let updateData = {};

    if (badgeText !== undefined) updateData.badgeText = badgeText.trim();
    if (sectionTitle !== undefined) {
      if (!sectionTitle.trim()) {
         return res.status(400).json({ success: false, message: "sectionTitle cannot be empty" });
      }
      updateData.sectionTitle = sectionTitle.trim();
    }
    
    if (isActive !== undefined) {
      const activeStatus = isActive === "true" || isActive === true;
      updateData.isActive = activeStatus;
      if (activeStatus) {
         // deactivate others
         await EmployeeJourneySection.updateMany({ _id: { $ne: id } }, { isActive: false });
      }
    }

    const updatedSection = await EmployeeJourneySection.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: "after" }
    );

    if (!updatedSection) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    res.status(200).json({ success: true, message: "Section updated successfully", data: updatedSection });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// DELETE /admin/employee-journey-section/:id
exports.deleteEmployeeJourneySection = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Section ID" });
    }

    const deletedSection = await EmployeeJourneySection.findByIdAndDelete(id);
    if (!deletedSection) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    res.status(200).json({ success: true, message: "Section deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
