const mongoose = require('mongoose');
const BlogCTA = require('../../model/blog/blogCta.model');

const normalizeBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'on'].includes(value.trim().toLowerCase());
  }
  return false;
};

const requiredFields = ['title', 'description', 'buttonText', 'buttonLink'];

const validateFields = (body) => requiredFields.filter((field) => (
  typeof body[field] !== 'string' || !body[field].trim()
));

const getAllBlogCtas = async (req, res) => {
  try {
    const records = await BlogCTA.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      success: true,
      message: 'Blog CTA records fetched successfully.',
      data: records,
    });
  } catch (error) {
    console.error('Error fetching Blog CTA records:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch Blog CTA records.' });
  }
};

const createBlogCta = async (req, res) => {
  try {
    const missingFields = validateFields(req.body);
    if (missingFields.length || req.body.isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: `The following fields are required: ${[...missingFields, ...(req.body.isActive === undefined ? ['isActive'] : [])].join(', ')}.`,
      });
    }

    const isActive = normalizeBoolean(req.body.isActive);
    if (isActive) await BlogCTA.updateMany({}, { isActive: false, updatedAt: new Date() });

    const created = await BlogCTA.create({
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      buttonText: req.body.buttonText.trim(),
      buttonLink: req.body.buttonLink.trim(),
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: 'Blog CTA created successfully.',
      data: created,
    });
  } catch (error) {
    console.error('Error creating Blog CTA:', error);
    return res.status(500).json({ success: false, message: 'Failed to create Blog CTA.' });
  }
};

const updateBlogCta = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Blog CTA ID.' });
    }

    const updateData = {};
    for (const field of requiredFields) {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] !== 'string' || !req.body[field].trim()) {
          return res.status(400).json({ success: false, message: `${field} is required.` });
        }
        updateData[field] = req.body[field].trim();
      }
    }

    if (req.body.isActive !== undefined) updateData.isActive = normalizeBoolean(req.body.isActive);
    updateData.updatedAt = new Date();

    if (updateData.isActive === true) {
      await BlogCTA.updateMany({ _id: { $ne: id } }, { isActive: false, updatedAt: new Date() });
    }

    const updated = await BlogCTA.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Blog CTA not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog CTA updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating Blog CTA:', error);
    return res.status(500).json({ success: false, message: 'Failed to update Blog CTA.' });
  }
};

const deleteBlogCta = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Blog CTA ID.' });
    }

    const deleted = await BlogCTA.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Blog CTA not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog CTA deleted successfully.',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting Blog CTA:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete Blog CTA.' });
  }
};

const getActiveBlogCta = async (req, res) => {
  try {
    const record = await BlogCTA.findOne({ isActive: true }).sort({ createdAt: -1 }).lean();
    if (!record) {
      return res.status(404).json({ success: false, message: 'No active Blog CTA record found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Active Blog CTA fetched successfully.',
      data: record,
    });
  } catch (error) {
    console.error('Error fetching active Blog CTA:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch active Blog CTA.' });
  }
};

module.exports = {
  getAllBlogCtas,
  createBlogCta,
  updateBlogCta,
  deleteBlogCta,
  getActiveBlogCta,
};