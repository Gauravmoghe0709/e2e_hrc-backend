const mongoose = require('mongoose');
const FeaturedBlog = require('../../model/blog/FeaturedBlog.model');
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

// ─── GET all Featured Blogs (Admin) ────────────────────────────────────────────
const getAllFeaturedBlogs = async (req, res) => {
  try {
    const records = await FeaturedBlog.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      success: true,
      message: 'Featured Blog records fetched successfully.',
      data: records,
    });
  } catch (error) {
    console.error('Error fetching Featured Blog records:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── GET active Featured Blog (Public) ─────────────────────────────────────────
const getActiveFeaturedBlog = async (req, res) => {
  try {
    const record = await FeaturedBlog.findOne({ isActive: true }).sort({ createdAt: -1 }).lean();
    if (!record) {
      return res.status(404).json({ success: false, message: 'No active Featured Blog record found.' });
    }
    return res.status(200).json({
      success: true,
      message: 'Active Featured Blog record fetched successfully.',
      data: record,
    });
  } catch (error) {
    console.error('Error fetching active Featured Blog record:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── CREATE Featured Blog (Admin) ──────────────────────────────────────────────
const createFeaturedBlog = async (req, res) => {
  try {
    const { title, shortDescription, publishedAt, readTime, isActive } = req.body;

    if (!title || !shortDescription || !publishedAt || !readTime) {
      return res.status(400).json({
        success: false,
        message: 'title, shortDescription, publishedAt, and readTime are required.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'image is required.',
      });
    }

    // If isActive is true, deactivate previous active record
    if (normalizeBoolean(isActive)) {
      await FeaturedBlog.updateMany({}, { isActive: false });
    }

    const uploadedFile = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-featured-blog');

    const created = await FeaturedBlog.create({
      title: title.trim(),
      shortDescription: shortDescription.trim(),
      image: uploadedFile.url,
      publishedAt: new Date(publishedAt),
      readTime: readTime.trim(),
      isActive: isActive !== undefined ? normalizeBoolean(isActive) : true,
    });

    return res.status(201).json({
      success: true,
      message: 'Featured Blog record created successfully.',
      data: created,
    });
  } catch (error) {
    console.error('Error creating Featured Blog record:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── UPDATE Featured Blog (Admin) ──────────────────────────────────────────────
const updateFeaturedBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Featured Blog ID.' });
    }

    const updateData = {};
    const { title, shortDescription, publishedAt, readTime, isActive } = req.body;

    if (title !== undefined) updateData.title = title.trim();
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription.trim();
    if (publishedAt !== undefined) updateData.publishedAt = new Date(publishedAt);
    if (readTime !== undefined) updateData.readTime = readTime.trim();
    if (isActive !== undefined) {
      const newIsActive = normalizeBoolean(isActive);
      updateData.isActive = newIsActive;
      
      // If updating to isActive true, deactivate previous active records
      if (newIsActive) {
        await FeaturedBlog.updateMany({ _id: { $ne: id } }, { isActive: false });
      }
    }

    // Handle image replacement if a new file was uploaded
    if (req.file) {
      const uploadedFile = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-featured-blog');
      updateData.image = uploadedFile.url;
    }

    const updated = await FeaturedBlog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Featured Blog record not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Featured Blog record updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating Featured Blog record:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── DELETE Featured Blog (Admin) ──────────────────────────────────────────────
const deleteFeaturedBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Featured Blog ID.' });
    }

    const deleted = await FeaturedBlog.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Featured Blog record not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Featured Blog record deleted successfully.',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting Featured Blog record:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = {
  getAllFeaturedBlogs,
  getActiveFeaturedBlog,
  createFeaturedBlog,
  updateFeaturedBlog,
  deleteFeaturedBlog,
};
