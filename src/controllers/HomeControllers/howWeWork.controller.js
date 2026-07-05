const HowWeWork = require("../../model/Home models/HowWeWork.model");

const buildStepPayload = (steps = []) => {
  return (Array.isArray(steps) ? steps : [])
    .map((step) => ({
      stepNumber: step.stepNumber || "",
      title: step.title || "",
      description: step.description || "",
      displayOrder: Number(step.displayOrder) || 0,
      isActive: step.isActive !== undefined ? Boolean(step.isActive) : true,
      journeyType: step.journeyType || "",
    }))
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
};

const parseIncomingSteps = (stepsInput) => {
  if (stepsInput === undefined || stepsInput === null) {
    return stepsInput;
  }

  if (typeof stepsInput === "string") {
    try {
      return JSON.parse(stepsInput);
    } catch (error) {
      console.error("Failed to parse steps payload:", error);
      return stepsInput;
    }
  }

  return stepsInput;
};

const validateSteps = (steps, res) => {
  const parsedSteps = parseIncomingSteps(steps);
  console.log("Backend Steps:", parsedSteps);

  if (parsedSteps === undefined || parsedSteps === null) {
    return null;
  }

  if (!Array.isArray(parsedSteps)) {
    return res.status(400).json({ success: false, message: "Steps must be provided as an array" });
  }

  for (const step of parsedSteps) {
    if (!step.title || !step.description) {
      return res.status(400).json({ success: false, message: "Each step must include title and description" });
    }
  }

  return null;
};

const updateSingleStep = async (req, res, stepListKey) => {
  try {
    const { sectionId, stepIndex } = req.params;
    const index = Number(stepIndex);

    if (!sectionId || !Number.isInteger(index) || index < 0) {
      return res.status(400).json({ success: false, message: "Valid section ID and step index are required" });
    }

    const section = await HowWeWork.findById(sectionId);

    if (!section) {
      return res.status(404).json({ success: false, message: "How We Work section not found" });
    }

    const steps = Array.isArray(section[stepListKey]) ? section[stepListKey] : [];

    if (index >= steps.length) {
      return res.status(404).json({ success: false, message: "Step not found" });
    }

    const currentStep = steps[index] || {};
    const { stepNumber, title, description, displayOrder, isActive } = req.body;

    const nextStep = {
      stepNumber: stepNumber !== undefined ? stepNumber : currentStep.stepNumber || "",
      title: title !== undefined ? title : currentStep.title || "",
      description: description !== undefined ? description : currentStep.description || "",
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : currentStep.displayOrder || 0,
      isActive: isActive !== undefined ? Boolean(isActive) : currentStep.isActive !== undefined ? currentStep.isActive : true,
    };

    steps[index] = nextStep;
    section[stepListKey] = steps.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    await section.save();

    res.status(200).json({ success: true, message: "Step updated successfully", data: section });
  } catch (error) {
    console.error("Error in updateSingleStep:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteSingleStep = async (req, res, stepListKey) => {
  try {
    const { sectionId, stepIndex } = req.params;
    const index = Number(stepIndex);

    if (!sectionId || !Number.isInteger(index) || index < 0) {
      return res.status(400).json({ success: false, message: "Valid section ID and step index are required" });
    }

    const section = await HowWeWork.findById(sectionId);

    if (!section) {
      return res.status(404).json({ success: false, message: "How We Work section not found" });
    }

    const steps = Array.isArray(section[stepListKey]) ? section[stepListKey] : [];

    if (index >= steps.length) {
      return res.status(404).json({ success: false, message: "Step not found" });
    }

    steps.splice(index, 1);
    section[stepListKey] = steps;
    await section.save();

    res.status(200).json({ success: true, message: "Step deleted successfully", data: section });
  } catch (error) {
    console.error("Error in deleteSingleStep:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/how-we-work
const getActiveHowWeWork = async (req, res) => {
  try {
    const section = await HowWeWork.findOne({ isActive: true }).lean();

    if (!section) {
      return res.status(404).json({ success: false, message: "How We Work section not found" });
    }

    const publicSection = {
      _id: section._id,
      sectionTitle: section.sectionTitle,
      sectionDescription: section.sectionDescription,
      employerSteps: (section.employerSteps || [])
        .filter((step) => step.isActive !== false)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
      employeeSteps: (section.employeeSteps || [])
        .filter((step) => step.isActive !== false)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
      isActive: section.isActive,
    };

    res.status(200).json({ success: true, message: "How We Work section fetched successfully", data: publicSection });
  } catch (error) {
    console.error("Error in getActiveHowWeWork:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/admin/how-we-work
const getAdminHowWeWork = async (req, res) => {
  try {
    const section = await HowWeWork.findOne().lean();

    if (!section) {
      return res.status(404).json({ success: false, message: "How We Work section not found" });
    }

    res.status(200).json({ success: true, message: "How We Work section fetched successfully", data: section });
  } catch (error) {
    console.error("Error in getAdminHowWeWork:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// POST /api/admin/how-we-work
const createHowWeWork = async (req, res) => {
  try {
    const existingSection = await HowWeWork.findOne();

    if (existingSection) {
      return res.status(409).json({ success: false, message: "How We Work section already exists. Please update it." });
    }

    const { sectionTitle, sectionDescription, employerSteps, employeeSteps, isActive } = req.body;
    const parsedSteps = parseIncomingSteps(req.body.steps);

    console.log("Backend Steps:", parsedSteps);

    if (req.body.steps !== undefined && !Array.isArray(parsedSteps)) {
      return res.status(400).json({ success: false, message: "Steps must be provided as an array" });
    }

    if (!sectionTitle || !sectionDescription) {
      return res.status(400).json({ success: false, message: "Section title and description are required" });
    }

    let normalizedEmployerSteps = employerSteps;
    let normalizedEmployeeSteps = employeeSteps;

    if (Array.isArray(parsedSteps) && normalizedEmployerSteps === undefined && normalizedEmployeeSteps === undefined) {
      normalizedEmployerSteps = parsedSteps.filter((step) => String(step.journeyType || "").toLowerCase() === "employer");
      normalizedEmployeeSteps = parsedSteps.filter((step) => String(step.journeyType || "").toLowerCase() === "employee");
    }

    const stepValidationError = validateSteps(normalizedEmployerSteps, res);
    if (stepValidationError) return stepValidationError;

    const employeeStepValidationError = validateSteps(normalizedEmployeeSteps, res);
    if (employeeStepValidationError) return employeeStepValidationError;

    const newSection = await HowWeWork.create({
      sectionTitle,
      sectionDescription,
      employerSteps: buildStepPayload(normalizedEmployerSteps || []),
      employeeSteps: buildStepPayload(normalizedEmployeeSteps || []),
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({ success: true, message: "How We Work section created successfully", data: newSection });
  } catch (error) {
    console.error("Error in createHowWeWork:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PUT /api/admin/how-we-work
const updateHowWeWork = async (req, res) => {
  try {
    const existingSection = await HowWeWork.findOne();

    if (!existingSection) {
      return res.status(404).json({ success: false, message: "How We Work section not found" });
    }

    const { sectionTitle, sectionDescription, employerSteps, employeeSteps, isActive } = req.body;
    const parsedSteps = parseIncomingSteps(req.body.steps);

    console.log("Backend Steps:", parsedSteps);

    if (req.body.steps !== undefined && !Array.isArray(parsedSteps)) {
      return res.status(400).json({ success: false, message: "Steps must be provided as an array" });
    }

    if (sectionTitle !== undefined && !sectionTitle.trim()) {
      return res.status(400).json({ success: false, message: "Section title is required" });
    }

    if (sectionDescription !== undefined && !sectionDescription.trim()) {
      return res.status(400).json({ success: false, message: "Section description is required" });
    }

    let normalizedEmployerSteps = employerSteps;
    let normalizedEmployeeSteps = employeeSteps;

    if (Array.isArray(parsedSteps) && normalizedEmployerSteps === undefined && normalizedEmployeeSteps === undefined) {
      normalizedEmployerSteps = parsedSteps.filter((step) => String(step.journeyType || "").toLowerCase() === "employer");
      normalizedEmployeeSteps = parsedSteps.filter((step) => String(step.journeyType || "").toLowerCase() === "employee");
    }

    if (normalizedEmployerSteps !== undefined) {
      const stepError = validateSteps(normalizedEmployerSteps, res);
      if (stepError) return stepError;
    }

    if (normalizedEmployeeSteps !== undefined) {
      const stepError = validateSteps(normalizedEmployeeSteps, res);
      if (stepError) return stepError;
    }

    const updateData = {};

    if (sectionTitle !== undefined) updateData.sectionTitle = sectionTitle;
    if (sectionDescription !== undefined) updateData.sectionDescription = sectionDescription;
    if (normalizedEmployerSteps !== undefined) updateData.employerSteps = buildStepPayload(normalizedEmployerSteps);
    if (normalizedEmployeeSteps !== undefined) updateData.employeeSteps = buildStepPayload(normalizedEmployeeSteps);
    if (isActive !== undefined) updateData.isActive = isActive;

    console.log("Backend Steps:", normalizedEmployerSteps || normalizedEmployeeSteps);

    const updatedSection = await HowWeWork.findByIdAndUpdate(existingSection._id, updateData, { new: true, runValidators: true });

    res.status(200).json({ success: true, message: "How We Work section updated successfully", data: updatedSection });
  } catch (error) {
    console.error("Error in updateHowWeWork:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE /api/admin/how-we-work
const deleteHowWeWork = async (req, res) => {
  try {
    const deletedSection = await HowWeWork.findOneAndDelete();

    if (!deletedSection) {
      return res.status(404).json({ success: false, message: "How We Work section not found" });
    }

    res.status(200).json({ success: true, message: "How We Work section deleted successfully", data: null });
  } catch (error) {
    console.error("Error in deleteHowWeWork:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateEmployerStep = async (req, res) => updateSingleStep(req, res, "employerSteps");
const updateEmployeeStep = async (req, res) => updateSingleStep(req, res, "employeeSteps");
const deleteEmployerStep = async (req, res) => deleteSingleStep(req, res, "employerSteps");
const deleteEmployeeStep = async (req, res) => deleteSingleStep(req, res, "employeeSteps");

module.exports = {
  getActiveHowWeWork,
  getAdminHowWeWork,
  createHowWeWork,
  updateHowWeWork,
  deleteHowWeWork,
  updateEmployerStep,
  updateEmployeeStep,
  deleteEmployerStep,
  deleteEmployeeStep,
};
