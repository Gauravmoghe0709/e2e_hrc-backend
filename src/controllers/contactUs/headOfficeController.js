const mongoose = require('mongoose');
const HeadOffice = require('../../model/contactUs/headOfficeModel');

// ─── GET Public HeadOffice (Active Only) ───────────────────────────────────────
const getPublicHeadOffice = async (req, res) => {
  try {
    const headOffice = await HeadOffice.findOne({
      is_active: true,
      deleted_at: null,
    }).lean();

    if (!headOffice) {
      return res.status(404).json({
        success: false,
        message: 'Head Office information not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Head Office information fetched successfully.',
      data: headOffice,
    });
  } catch (error) {
    console.error('Error fetching public head office:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── GET Admin HeadOffice (All or by ID) ───────────────────────────────────────
const getAdminHeadOffice = async (req, res) => {
  try {
    const headOffice = await HeadOffice.findOne({
      deleted_at: null,
    }).lean();

    if (!headOffice) {
      return res.status(404).json({
        success: false,
        message: 'Head Office information not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Head Office information fetched successfully.',
      data: headOffice,
    });
  } catch (error) {
    console.error('Error fetching admin head office:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── CREATE HeadOffice ─────────────────────────────────────────────────────────
const createHeadOffice = async (req, res) => {
  try {
    const {
      title,
      address_line,
      city,
      state,
      postal_code,
      country,
      opening_hours_title,
      opening_hours,
      global_inquiries_title,
      global_inquiries_description,
      is_active,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !address_line ||
      !city ||
      !postal_code ||
      !country ||
      !opening_hours_title ||
      !opening_hours ||
      !global_inquiries_title ||
      !global_inquiries_description
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields.',
      });
    }

    // Check if record already exists
    const existingRecord = await HeadOffice.findOne({
      deleted_at: null,
    });

    if (existingRecord) {
      return res.status(400).json({
        success: false,
        message: 'Head Office record already exists. Use update to modify it.',
      });
    }

    const headOffice = new HeadOffice({
      title: title.trim(),
      address_line: address_line.trim(),
      city: city.trim(),
      state: state ? state.trim() : null,
      postal_code: postal_code.trim(),
      country: country.trim(),
      opening_hours_title: opening_hours_title.trim(),
      opening_hours: opening_hours.trim(),
      global_inquiries_title: global_inquiries_title.trim(),
      global_inquiries_description: global_inquiries_description.trim(),
      is_active: is_active !== undefined ? is_active : true,
    });

    await headOffice.save();

    return res.status(201).json({
      success: true,
      message: 'Head Office information created successfully.',
      data: headOffice,
    });
  } catch (error) {
    console.error('Error creating head office:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.',
    });
  }
};

// ─── UPDATE HeadOffice ─────────────────────────────────────────────────────────
const updateHeadOffice = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      address_line,
      city,
      state,
      postal_code,
      country,
      opening_hours_title,
      opening_hours,
      global_inquiries_title,
      global_inquiries_description,
      is_active,
    } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Head Office ID.',
      });
    }

    const headOffice = await HeadOffice.findById(id);

    if (!headOffice || headOffice.deleted_at !== null) {
      return res.status(404).json({
        success: false,
        message: 'Head Office record not found.',
      });
    }

    // Update fields if provided
    if (title !== undefined) headOffice.title = title.trim();
    if (address_line !== undefined) headOffice.address_line = address_line.trim();
    if (city !== undefined) headOffice.city = city.trim();
    if (state !== undefined) headOffice.state = state ? state.trim() : null;
    if (postal_code !== undefined) headOffice.postal_code = postal_code.trim();
    if (country !== undefined) headOffice.country = country.trim();
    if (opening_hours_title !== undefined)
      headOffice.opening_hours_title = opening_hours_title.trim();
    if (opening_hours !== undefined)
      headOffice.opening_hours = opening_hours.trim();
    if (global_inquiries_title !== undefined)
      headOffice.global_inquiries_title = global_inquiries_title.trim();
    if (global_inquiries_description !== undefined)
      headOffice.global_inquiries_description = global_inquiries_description.trim();
    if (is_active !== undefined) headOffice.is_active = is_active;

    await headOffice.save();

    return res.status(200).json({
      success: true,
      message: 'Head Office information updated successfully.',
      data: headOffice,
    });
  } catch (error) {
    console.error('Error updating head office:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.',
    });
  }
};

// ─── DELETE HeadOffice (Soft Delete) ───────────────────────────────────────────
const deleteHeadOffice = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Head Office ID.',
      });
    }

    const headOffice = await HeadOffice.findById(id);

    if (!headOffice || headOffice.deleted_at !== null) {
      return res.status(404).json({
        success: false,
        message: 'Head Office record not found.',
      });
    }

    headOffice.deleted_at = new Date();
    await headOffice.save();

    return res.status(200).json({
      success: true,
      message: 'Head Office record deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting head office:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  getPublicHeadOffice,
  getAdminHeadOffice,
  createHeadOffice,
  updateHeadOffice,
  deleteHeadOffice,
};
