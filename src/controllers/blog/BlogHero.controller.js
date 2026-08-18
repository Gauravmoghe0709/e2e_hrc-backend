const mongoose = require('mongoose');
const BlogHero = require('../../model/blog/BlogHero.model');
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

// ─── GET all Blog Heroes (Admin) ───────────────────────────────────────────────
const getAllBlogHeroes = async (req, res) => {
  try {
    const records = await BlogHero.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      success: true,
      message: 'Blog Hero records fetched successfully.',
      data: records,
    });
  } catch (error) {
    console.error('Error fetching Blog Hero records:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── GET active Blog Hero (Public) ──────────────────────────────────────────────
const getActiveBlogHero = async (req, res) => {
  try {
    const record = await BlogHero.findOne({ isActive: true }).sort({ createdAt: -1 }).lean();
    if (!record) {
      return res.status(404).json({ success: false, message: 'No active Blog Hero record found.' });
    }
    return res.status(200).json({
      success: true,
      message: 'Active Blog Hero record fetched successfully.',
      data: record,
    });
  } catch (error) {
    console.error('Error fetching active Blog Hero record:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── CREATE Blog Hero (Admin) ──────────────────────────────────────────────────
const createBlogHero = async (req, res) => {
  try {
    const { title, highlightText, isActive } = req.body;

    if (!title || !highlightText) {
      return res.status(400).json({
        success: false,
        message: 'title and highlightText are required.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'backgroundImage is required.',
      });
    }

    // If isActive is true, deactivate previous active record
    if (normalizeBoolean(isActive)) {
      await BlogHero.updateMany({}, { isActive: false });
    }

    const uploadedFile = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-blog-hero');

    const created = await BlogHero.create({
      title: title.trim(),
      highlightText: highlightText.trim(),
      backgroundImage: uploadedFile.url,
      isActive: isActive !== undefined ? normalizeBoolean(isActive) : true,
    });

    return res.status(201).json({
      success: true,
      message: 'Blog Hero record created successfully.',
      data: created,
    });
  } catch (error) {
    console.error('Error creating Blog Hero record:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── UPDATE Blog Hero (Admin) ──────────────────────────────────────────────────
const updateBlogHero = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Blog Hero ID.' });
    }

    const updateData = {};
    const { title, highlightText, isActive } = req.body;

    if (title !== undefined) updateData.title = title.trim();
    if (highlightText !== undefined) updateData.highlightText = highlightText.trim();
    if (isActive !== undefined) {
      const newIsActive = normalizeBoolean(isActive);
      updateData.isActive = newIsActive;
      
      // If updating to isActive true, deactivate previous active records
      if (newIsActive) {
        await BlogHero.updateMany({ _id: { $ne: id } }, { isActive: false });
      }
    }

    // Handle image replacement if a new file was uploaded
    if (req.file) {
      const uploadedFile = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-blog-hero');
      updateData.backgroundImage = uploadedFile.url;
    }

    const updated = await BlogHero.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Blog Hero record not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog Hero record updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating Blog Hero record:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── DELETE Blog Hero (Admin) ──────────────────────────────────────────────────
const deleteBlogHero = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Blog Hero ID.' });
    }

    const deleted = await BlogHero.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Blog Hero record not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog Hero record deleted successfully.',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting Blog Hero record:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = {
  getAllBlogHeroes,
  getActiveBlogHero,
  createBlogHero,
  updateBlogHero,
  deleteBlogHero,
};
