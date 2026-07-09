const HowWeWorkSection = require("../../model/WorkforceSolution/HowWeWorkSection");
const HowWeWorkStep = require("../../model/WorkforceSolution/HowWeWorkStep");

// Public API
exports.getActiveHowWeWork = async (req, res) => {
  try {
    const section = await HowWeWorkSection.findOne({ isActive: true }).lean();
    if (!section) {
      return res.status(404).json({ success: false, message: "Active section not found" });
    }

    const steps = await HowWeWorkStep.find({ isActive: true }).sort({ order: 1 }).lean();

    res.status(200).json({
      success: true,
      data: {
        section,
        steps
      }
    });
  } catch (error) {
    console.error("Error in getActiveHowWeWork:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin Section APIs
exports.createSection = async (req, res) => {
  try {
    const { badgeText, sectionTitle, isActive } = req.body;

    if (isActive) {
      await HowWeWorkSection.updateMany({}, { isActive: false });
    }

    const newSection = await HowWeWorkSection.create({
      badgeText,
      sectionTitle,
      isActive
    });

    res.status(201).json({ success: true, data: newSection });
  } catch (error) {
    console.error("Error creating section:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAdminSections = async (req, res) => {
  try {
    const sections = await HowWeWorkSection.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: sections });
  } catch (error) {
    console.error("Error fetching sections:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { badgeText, sectionTitle, isActive } = req.body;

    if (isActive) {
      await HowWeWorkSection.updateMany({ _id: { $ne: id } }, { isActive: false });
    }

    const updatedSection = await HowWeWorkSection.findByIdAndUpdate(
      id,
      { badgeText, sectionTitle, isActive },
      { new: true, runValidators: true }
    );

    if (!updatedSection) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    res.status(200).json({ success: true, data: updatedSection });
  } catch (error) {
    console.error("Error updating section:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSection = await HowWeWorkSection.findByIdAndDelete(id);

    if (!deletedSection) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    res.status(200).json({ success: true, message: "Section deleted successfully" });
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
