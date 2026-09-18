const Sectors = require("../../model/Home models/Sectors.model");

const getFields = (body) => ({
  sectionTitle: body.sectionTitle,
  sectionDescription: body.sectionDescription,
});

const getMissingField = (fields) => {
  if (!fields.sectionTitle?.toString().trim()) return "sectionTitle";
  if (!fields.sectionDescription?.toString().trim()) return "sectionDescription";
  return null;
};

const getSectors = async (req, res) => {
  try {
    const section = await Sectors.findOne();
    return res.status(200).json({
      success: true,
      message: "Sectors fetched successfully",
      data: section || null,
    });
  } catch (error) {
    console.error("Error in getSectors:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createSectors = async (req, res) => {
  try {
    const fields = getFields(req.body);
    const missingField = getMissingField(fields);

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: `${missingField} is required`,
      });
    }

    const existing = await Sectors.findOne();
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Sectors content already exists. Update the existing content instead.",
      });
    }

    const section = await Sectors.create({
      sectionTitle: fields.sectionTitle.toString().trim(),
      sectionDescription: fields.sectionDescription.toString().trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Sectors created successfully",
      data: section,
    });
  } catch (error) {
    console.error("Error in createSectors:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getSectorsAdmin = async (req, res) => {
  try {
    const section = await Sectors.findOne();
    return res.status(200).json({
      success: true,
      message: "Sectors fetched successfully",
      data: section || null,
    });
  } catch (error) {
    console.error("Error in getSectorsAdmin:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateSectors = async (req, res) => {
  try {
    const fields = getFields(req.body);
    const updateData = {};

    Object.entries(fields).forEach(([field, value]) => {
      if (value !== undefined) {
        if (!value.toString().trim()) {
          return;
        }
        updateData[field] = value.toString().trim();
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one valid field is required",
      });
    }

    const section = await Sectors.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({ success: false, message: "Sectors content not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Sectors updated successfully",
      data: section,
    });
  } catch (error) {
    console.error("Error in updateSectors:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getSectors,
  createSectors,
  getSectorsAdmin,
  updateSectors,
};
