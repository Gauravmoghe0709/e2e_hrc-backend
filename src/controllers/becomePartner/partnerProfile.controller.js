const mongoose = require('mongoose');
const PartnerProfile = require('../../model/becomePartner/partnerProfile.model');

const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '');

const validatePartnerProfilePayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, message: 'Partner profile payload is required.' };
  }

  const eyebrow = normalizeString(payload.eyebrow);
  const title = normalizeString(payload.title);
  const description = normalizeString(payload.description);
  const cta = payload.cta && typeof payload.cta === 'object' ? payload.cta : null;
  const sidePanel = payload.side_panel && typeof payload.side_panel === 'object' ? payload.side_panel : null;

  if (!eyebrow) {
    return { valid: false, message: 'Eyebrow is required.' };
  }

  if (!title) {
    return { valid: false, message: 'Title is required.' };
  }

  if (!description) {
    return { valid: false, message: 'Description is required.' };
  }

  if (!cta) {
    return { valid: false, message: 'CTA is required.' };
  }

  if (!normalizeString(cta.label)) {
    return { valid: false, message: 'CTA label is required.' };
  }

  if (!normalizeString(cta.url)) {
    return { valid: false, message: 'CTA URL is required.' };
  }

  if (!sidePanel) {
    return { valid: false, message: 'Side panel is required.' };
  }

  if (!normalizeString(sidePanel.title)) {
    return { valid: false, message: 'Side panel title is required.' };
  }

  if (!normalizeString(sidePanel.description)) {
    return { valid: false, message: 'Side panel description is required.' };
  }

  return {
    valid: true,
    payload: {
      eyebrow,
      title,
      description,
      cta: {
        label: normalizeString(cta.label),
        url: normalizeString(cta.url),
      },
      side_panel: {
        title: normalizeString(sidePanel.title),
        description: normalizeString(sidePanel.description),
      },
    },
  };
};

const getPartnerProfiles = async (req, res) => {
  try {
    const records = await PartnerProfile.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      success: true,
      message: 'Partner profile records fetched successfully.',
      data: records,
    });
  } catch (error) {
    console.error('Error fetching partner profile records:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const getActivePartnerProfile = async (req, res) => {
  try {
    const record = await PartnerProfile.findOne().sort({ createdAt: -1 }).lean();

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'No partner profile record found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Active partner profile fetched successfully.',
      data: record,
    });
  } catch (error) {
    console.error('Error fetching active partner profile:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const createPartnerProfile = async (req, res) => {
  try {
    const validation = validatePartnerProfilePayload(req.body);

    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const existingRecord = await PartnerProfile.findOne();
    if (existingRecord) {
      return res.status(409).json({
        success: false,
        message: 'A partner profile already exists. Please update the existing record instead.',
      });
    }

    const created = await PartnerProfile.create(validation.payload);

    return res.status(201).json({
      success: true,
      message: 'Partner profile created successfully.',
      data: created,
    });
  } catch (error) {
    console.error('Error creating partner profile:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.',
    });
  }
};

const updatePartnerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid partner profile ID.' });
    }

    const validation = validatePartnerProfilePayload(req.body);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const updated = await PartnerProfile.findByIdAndUpdate(id, validation.payload, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Partner profile record not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Partner profile updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating partner profile:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.',
    });
  }
};

const deletePartnerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid partner profile ID.' });
    }

    const deleted = await PartnerProfile.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Partner profile record not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Partner profile deleted successfully.',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting partner profile:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = {
  getPartnerProfiles,
  getActivePartnerProfile,
  createPartnerProfile,
  updatePartnerProfile,
  deletePartnerProfile,
};
