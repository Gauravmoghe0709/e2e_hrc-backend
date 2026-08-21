const mongoose = require('mongoose');
const ContactUs = require('../../model/contactUs/contactUsModel');
const uploadImage = require('../../services/storage.services');

// ─── Helper Function: Normalize Boolean ────────────────────────────────────────
const normalizeBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  }
  return true;
};

// ─── GET All Contact Us Sections (Admin) ───────────────────────────────────────
const getAllContactUsSections = async (req, res) => {
  try {
    const sections = await ContactUs.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      success: true,
      message: 'Contact Us sections fetched successfully.',
      data: sections,
      count: sections.length,
    });
  } catch (error) {
    console.error('Error fetching Contact Us sections:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── GET Contact Us Section by ID (Admin) ──────────────────────────────────────
const getContactUsSectionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section ID.',
      });
    }

    const section = await ContactUs.findById(id);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Contact Us section not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact Us section fetched successfully.',
      data: section,
    });
  } catch (error) {
    console.error('Error fetching Contact Us section by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── CREATE Contact Us Section (Admin) ─────────────────────────────────────────
const createContactUsSection = async (req, res) => {
  try {
    const { title, highlightedText, isActive } = req.body;

    // Validate required fields
    if (!title || !highlightedText) {
      return res.status(400).json({
        success: false,
        message: 'Title and highlighted text are required.',
      });
    }

    // Handle image upload
    let backgroundImageUrl = null;

    if (req.file) {
      const uploadedFile = await uploadImage(
        req.file.buffer,
        req.file.originalname,
        'e2e-contact-us'
      );
      backgroundImageUrl = uploadedFile.url;
    }

    if (!backgroundImageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Background image is required.',
      });
    }

    // Create Contact Us section
    const newSection = await ContactUs.create({
      title: title.trim(),
      highlightedText: highlightedText.trim(),
      backgroundImage: backgroundImageUrl,
      isActive: isActive !== undefined ? normalizeBoolean(isActive) : true,
    });

    return res.status(201).json({
      success: true,
      message: 'Contact Us section created successfully.',
      data: newSection,
    });
  } catch (error) {
    console.error('Error creating Contact Us section:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── UPDATE Contact Us Section (Admin) ─────────────────────────────────────────
const updateContactUsSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, highlightedText, isActive } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section ID.',
      });
    }

    const updateData = {};

    // Update scalar fields
    if (title !== undefined) updateData.title = title.trim();
    if (highlightedText !== undefined) updateData.highlightedText = highlightedText.trim();
    if (isActive !== undefined) updateData.isActive = normalizeBoolean(isActive);

    // Handle image upload (optional during update)
    if (req.file) {
      const uploadedFile = await uploadImage(
        req.file.buffer,
        req.file.originalname,
        'e2e-contact-us'
      );
      updateData.backgroundImage = uploadedFile.url;
    }

    const updatedSection = await ContactUs.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: 'Contact Us section not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact Us section updated successfully.',
      data: updatedSection,
    });
  } catch (error) {
    console.error('Error updating Contact Us section:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── DELETE Contact Us Section (Admin) ─────────────────────────────────────────
const deleteContactUsSection = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section ID.',
      });
    }

    const deletedSection = await ContactUs.findByIdAndDelete(id);

    if (!deletedSection) {
      return res.status(404).json({
        success: false,
        message: 'Contact Us section not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact Us section deleted successfully.',
      data: deletedSection,
    });
  } catch (error) {
    console.error('Error deleting Contact Us section:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── UPDATE Contact Us Section Status (Admin) ──────────────────────────────────
const updateContactUsSectionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section ID.',
      });
    }

    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: 'isActive field is required.',
      });
    }

    const updatedSection = await ContactUs.findByIdAndUpdate(
      id,
      { isActive: normalizeBoolean(isActive) },
      { new: true, runValidators: true }
    );

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: 'Contact Us section not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact Us section status updated successfully.',
      data: updatedSection,
    });
  } catch (error) {
    console.error('Error updating Contact Us section status:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── GET Active Contact Us Section (Public) ────────────────────────────────────
const getActiveContactUsSection = async (req, res) => {
  try {
    const section = await ContactUs.findOne({ isActive: true }).lean();

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'No active Contact Us section found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact Us section fetched successfully.',
      data: section,
    });
  } catch (error) {
    console.error('Error fetching active Contact Us section:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  getAllContactUsSections,
  getContactUsSectionById,
  createContactUsSection,
  updateContactUsSection,
  deleteContactUsSection,
  updateContactUsSectionStatus,
  getActiveContactUsSection,
};
