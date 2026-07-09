const HowWeWorkStep = require("../../model/WorkforceSolution/HowWeWorkStep");

exports.createStep = async (req, res) => {
  try {
    const { stepNumber, title, order, isActive } = req.body;

    const newStep = await HowWeWorkStep.create({
      stepNumber,
      title,
      order,
      isActive
    });

    res.status(201).json({ success: true, data: newStep });
  } catch (error) {
    console.error("Error creating step:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAdminSteps = async (req, res) => {
  try {
    const steps = await HowWeWorkStep.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: steps });
  } catch (error) {
    console.error("Error fetching steps:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateStep = async (req, res) => {
  try {
    const { id } = req.params;
    const { stepNumber, title, order, isActive } = req.body;

    const updatedStep = await HowWeWorkStep.findByIdAndUpdate(
      id,
      { stepNumber, title, order, isActive },
      { new: true, runValidators: true }
    );

    if (!updatedStep) {
      return res.status(404).json({ success: false, message: "Step not found" });
    }

    res.status(200).json({ success: true, data: updatedStep });
  } catch (error) {
    console.error("Error updating step:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deleteStep = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStep = await HowWeWorkStep.findByIdAndDelete(id);

    if (!deletedStep) {
      return res.status(404).json({ success: false, message: "Step not found" });
    }

    res.status(200).json({ success: true, message: "Step deleted successfully" });
  } catch (error) {
    console.error("Error deleting step:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
