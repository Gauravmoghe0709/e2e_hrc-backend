const PeopleBehindMagic = require("../../model/About models/PeopleBehindMagic.model");

const getFields = (body) => ({
  sectionTitle: body.sectionTitle,
  sectionDescription: body.sectionDescription,
  sectionDetails: body.sectionDetails,
});

const validateRequiredFields = (fields) => {
  const requiredFields = ["sectionTitle", "sectionDescription", "sectionDetails"];
  return requiredFields.find((field) => !fields[field]?.toString().trim());
};

const createPeopleBehindMagic = async (req, res) => {
  try {
    const fields = getFields(req.body);
    const missingField = validateRequiredFields(fields);

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: `${missingField} is required`,
      });
    }

    const existing = await PeopleBehindMagic.findOne();
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "People Behind the Magic content already exists. Update the existing content instead.",
      });
    }

    const section = await PeopleBehindMagic.create({
      sectionTitle: fields.sectionTitle.toString().trim(),
      sectionDescription: fields.sectionDescription.toString().trim(),
      sectionDetails: fields.sectionDetails.toString().trim(),
    });

    return res.status(201).json({
      success: true,
      message: "People Behind the Magic content created successfully",
      data: section,
    });
  } catch (error) {
    console.error("Error in createPeopleBehindMagic:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getPeopleBehindMagicAdmin = async (req, res) => {
  try {
    const section = await PeopleBehindMagic.findOne();
    return res.status(200).json({ success: true, data: section || null });
  } catch (error) {
    console.error("Error in getPeopleBehindMagicAdmin:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updatePeopleBehindMagic = async (req, res) => {
  try {
    const fields = getFields(req.body);
    const updateData = {};

    Object.entries(fields).forEach(([field, value]) => {
      if (value !== undefined) {
        if (!value.toString().trim()) {
          updateData[field] = value;
        } else {
          updateData[field] = value.toString().trim();
        }
      }
    });

    const emptyField = validateRequiredFields({
      sectionTitle: updateData.sectionTitle === undefined ? "provided" : updateData.sectionTitle,
      sectionDescription: updateData.sectionDescription === undefined ? "provided" : updateData.sectionDescription,
      sectionDetails: updateData.sectionDetails === undefined ? "provided" : updateData.sectionDetails,
    });
    if (emptyField) {
      return res.status(400).json({
        success: false,
        message: `${emptyField} cannot be empty`,
      });
    }

    const section = await PeopleBehindMagic.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "People Behind the Magic content not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "People Behind the Magic content updated successfully",
      data: section,
    });
  } catch (error) {
    console.error("Error in updatePeopleBehindMagic:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getPeopleBehindMagicPublic = async (req, res) => {
  try {
    const section = await PeopleBehindMagic.findOne().select(
      "sectionTitle sectionDescription sectionDetails -_id"
    );
    return res.status(200).json({
      success: true,
      data: section || null,
    });
  } catch (error) {
    console.error("Error in getPeopleBehindMagicPublic:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createPeopleBehindMagic,
  getPeopleBehindMagicAdmin,
  updatePeopleBehindMagic,
  getPeopleBehindMagicPublic,
};
