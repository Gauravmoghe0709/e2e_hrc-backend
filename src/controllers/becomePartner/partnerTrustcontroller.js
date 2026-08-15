const mongoose = require('mongoose');
const PartnerTrust = require('../../model/becomePartner/PartnerTrust');
const uploadImage = require('../../services/storage.services');

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

const normalizeFeatures = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        title: String(item.title || '').trim(),
        description: String(item.description || '').trim(),
      }))
      .filter((item) => item.title && item.description);
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return normalizeFeatures(parsed);
    } catch (error) {
      return [];
    }
  }

  return [];
};

const getAllPartnerTrust = async (req, res) => {
  try {
    const records = await PartnerTrust.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      success: true,
      message: 'Trust & Transparency records fetched successfully.',
      data: records,
    });
  } catch (error) {
    console.error('Error fetching partner trust records:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const getActivePartnerTrust = async (req, res) => {
  try {
    const record = await PartnerTrust.findOne({ isActive: true }).sort({ createdAt: -1 }).lean();

    if (!record) {
      return res.status(404).json({ success: false, message: 'No active trust & transparency record found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Active trust & transparency record fetched successfully.',
      data: record,
    });
  } catch (error) {
    console.error('Error fetching active partner trust record:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const getPartnerTrustById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid trust record ID.' });
    }

    const record = await PartnerTrust.findById(id).lean();

    if (!record) {
      return res.status(404).json({ success: false, message: 'Trust & Transparency record not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Trust & Transparency record fetched successfully.',
      data: record,
    });
  } catch (error) {
    console.error('Error fetching partner trust by ID:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const createPartnerTrust = async (req, res) => {
  try {
    const { title, description, isActive } = req.body;
    const parsedFeatures = normalizeFeatures(req.body.features);

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Description is required.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required.' });
    }

    if (!parsedFeatures.length) {
      return res.status(400).json({ success: false, message: 'At least one feature is required.' });
    }

    const uploadedFile = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-partner-trust');

    const record = await PartnerTrust.create({
      title: title.trim(),
      description: description.trim(),
      image: uploadedFile.url,
      features: parsedFeatures,
      isActive: isActive !== undefined ? normalizeBoolean(isActive) : true,
    });

    return res.status(201).json({
      success: true,
      message: 'Trust & Transparency created successfully.',
      data: record,
    });
  } catch (error) {
    console.error('Error creating partner trust record:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error.' });
  }
};

const updatePartnerTrust = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid trust record ID.' });
    }

    const updateData = {};
    const { title, description, isActive } = req.body;
    const parsedFeatures = normalizeFeatures(req.body.features);

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ success: false, message: 'Title is required.' });
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({ success: false, message: 'Description is required.' });
      }
      updateData.description = description.trim();
    }

    if (parsedFeatures.length) {
      updateData.features = parsedFeatures;
    }

    if (isActive !== undefined) {
      updateData.isActive = normalizeBoolean(isActive);
    }

    if (req.file) {
      const uploadedFile = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-partner-trust');
      updateData.image = uploadedFile.url;
    }

    if (!req.file && !req.body.image && !req.body.title && !req.body.description && !req.body.features && req.body.isActive === undefined) {
      return res.status(400).json({ success: false, message: 'No update data provided.' });
    }

    const updated = await PartnerTrust.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Trust & Transparency record not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Trust & Transparency updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating partner trust record:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error.' });
  }
};

const deletePartnerTrust = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid trust record ID.' });
    }

    const deleted = await PartnerTrust.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Trust & Transparency record not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Trust & Transparency deleted successfully.',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting partner trust record:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = {
  getAllPartnerTrust,
  getActivePartnerTrust,
  getPartnerTrustById,
  createPartnerTrust,
  updatePartnerTrust,
  deletePartnerTrust,
};
