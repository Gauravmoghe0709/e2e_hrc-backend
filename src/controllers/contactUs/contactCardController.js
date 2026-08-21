const mongoose = require('mongoose');
const ContactCard = require('../../model/contactUs/contactCardModel');

// ─── GET Public ContactCard (Active Only) ──────────────────────────────────────
const getPublicContactCard = async (req, res) => {
  try {
    const contactCard = await ContactCard.findOne({
      is_active: true,
      deleted_at: null,
    }).lean();

    if (!contactCard) {
      return res.status(404).json({
        success: false,
        message: 'Contact Card information not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact Card information fetched successfully.',
      data: contactCard,
    });
  } catch (error) {
    console.error('Error fetching public contact card:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── GET Admin ContactCard (All or by ID) ──────────────────────────────────────
const getAdminContactCard = async (req, res) => {
  try {
    const contactCard = await ContactCard.findOne({
      deleted_at: null,
    }).lean();

    if (!contactCard) {
      return res.status(404).json({
        success: false,
        message: 'Contact Card information not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact Card information fetched successfully.',
      data: contactCard,
    });
  } catch (error) {
    console.error('Error fetching admin contact card:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── CREATE ContactCard ────────────────────────────────────────────────────────
const createContactCard = async (req, res) => {
  try {
    const {
      title,
      phone_title,
      phone_number,
      email_title,
      email_address,
      office_title,
      office_address,
      office_map_url,
      is_active,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !phone_title ||
      !phone_number ||
      !email_title ||
      !email_address ||
      !office_title ||
      !office_address
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields.',
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email_address)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // Validate URL if provided
    if (office_map_url) {
      try {
        new URL(office_map_url);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid URL for office map.',
        });
      }
    }

    // Check if record already exists
    const existingRecord = await ContactCard.findOne({
      deleted_at: null,
    });

    if (existingRecord) {
      return res.status(400).json({
        success: false,
        message: 'Contact Card record already exists. Use update to modify it.',
      });
    }

    const contactCard = new ContactCard({
      title: title.trim(),
      phone_title: phone_title.trim(),
      phone_number: phone_number.trim(),
      email_title: email_title.trim(),
      email_address: email_address.trim().toLowerCase(),
      office_title: office_title.trim(),
      office_address: office_address.trim(),
      office_map_url: office_map_url ? office_map_url.trim() : null,
      is_active: is_active !== undefined ? is_active : true,
    });

    await contactCard.save();

    return res.status(201).json({
      success: true,
      message: 'Contact Card information created successfully.',
      data: contactCard,
    });
  } catch (error) {
    console.error('Error creating contact card:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.',
    });
  }
};

// ─── UPDATE ContactCard ────────────────────────────────────────────────────────
const updateContactCard = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      phone_title,
      phone_number,
      email_title,
      email_address,
      office_title,
      office_address,
      office_map_url,
      is_active,
    } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Contact Card ID.',
      });
    }

    const contactCard = await ContactCard.findById(id);

    if (!contactCard || contactCard.deleted_at !== null) {
      return res.status(404).json({
        success: false,
        message: 'Contact Card record not found.',
      });
    }

    // Validate email if provided
    if (email_address) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email_address)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address.',
        });
      }
    }

    // Validate URL if provided
    if (office_map_url) {
      try {
        new URL(office_map_url);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid URL for office map.',
        });
      }
    }

    // Update fields if provided
    if (title !== undefined) contactCard.title = title.trim();
    if (phone_title !== undefined) contactCard.phone_title = phone_title.trim();
    if (phone_number !== undefined) contactCard.phone_number = phone_number.trim();
    if (email_title !== undefined) contactCard.email_title = email_title.trim();
    if (email_address !== undefined)
      contactCard.email_address = email_address.trim().toLowerCase();
    if (office_title !== undefined) contactCard.office_title = office_title.trim();
    if (office_address !== undefined)
      contactCard.office_address = office_address.trim();
    if (office_map_url !== undefined)
      contactCard.office_map_url = office_map_url ? office_map_url.trim() : null;
    if (is_active !== undefined) contactCard.is_active = is_active;

    await contactCard.save();

    return res.status(200).json({
      success: true,
      message: 'Contact Card information updated successfully.',
      data: contactCard,
    });
  } catch (error) {
    console.error('Error updating contact card:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.',
    });
  }
};

// ─── DELETE ContactCard (Soft Delete) ──────────────────────────────────────────
const deleteContactCard = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Contact Card ID.',
      });
    }

    const contactCard = await ContactCard.findById(id);

    if (!contactCard || contactCard.deleted_at !== null) {
      return res.status(404).json({
        success: false,
        message: 'Contact Card record not found.',
      });
    }

    contactCard.deleted_at = new Date();
    await contactCard.save();

    return res.status(200).json({
      success: true,
      message: 'Contact Card record deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting contact card:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  getPublicContactCard,
  getAdminContactCard,
  createContactCard,
  updateContactCard,
  deleteContactCard,
};
