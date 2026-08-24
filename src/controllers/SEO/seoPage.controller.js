const mongoose = require('mongoose');
const SeoPage = require('../../model/SEO Model/seoPage.model');

const VALID_PAGE_KEYS = [
  'home',
  'about-us',
  'employer',
  'employee',
  'workforce-solutions',
  'become-a-partner',
  'blog',
  'contact-us',
];

const normalizePageKey = (pageKey) => {
  if (typeof pageKey !== 'string') return '';
  return pageKey.trim().toLowerCase();
};

const isValidPageKey = (pageKey) => VALID_PAGE_KEYS.includes(pageKey);

const toTrimmedString = (value) => {
  if (value === undefined || value === null) return null;
  return String(value).trim();
};

const getAdminSEO = async (req, res) => {
  try {
    const seoRecords = await SeoPage.find({ deleted_at: null }).sort({ created_at: -1 }).lean();

    return res.status(200).json({
      success: true,
      message: 'SEO records fetched successfully.',
      data: seoRecords,
    });
  } catch (error) {
    console.error('Error fetching admin SEO records:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

const getAdminSEOById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid SEO ID.',
    });
  }

  try {
    const seoRecord = await SeoPage.findOne({ _id: id, deleted_at: null }).lean();

    if (!seoRecord) {
      return res.status(404).json({
        success: false,
        message: 'SEO record not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'SEO record fetched successfully.',
      data: seoRecord,
    });
  } catch (error) {
    console.error('Error fetching SEO record by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

const createSEO = async (req, res) => {
  try {
    const {
      page_key,
      page_name,
      page_url,
      meta_title,
      meta_description,
      canonical_url,
      robots,
      og_title,
      og_description,
      og_image,
    } = req.body;

    const requiredFields = [page_key, page_name, page_url, meta_title, meta_description];
    if (requiredFields.some((field) => field === undefined || field === null || String(field).trim() === '')) {
      return res.status(400).json({
        success: false,
        message: 'page_key, page_name, page_url, meta_title, and meta_description are required.',
      });
    }

    const normalizedPageKey = normalizePageKey(page_key);
    if (!isValidPageKey(normalizedPageKey)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid page_key. Supported values are: home, about-us, employer, employee, workforce-solutions, become-a-partner, blog, contact-us.',
      });
    }

    const existingSEO = await SeoPage.findOne({ page_key: normalizedPageKey });
    if (existingSEO) {
      return res.status(409).json({
        success: false,
        message: 'SEO record already exists for this page_key.',
      });
    }

    const newSEO = new SeoPage({
      page_key: normalizedPageKey,
      page_name: toTrimmedString(page_name),
      page_url: toTrimmedString(page_url),
      meta_title: toTrimmedString(meta_title),
      meta_description: toTrimmedString(meta_description),
      canonical_url: toTrimmedString(canonical_url) || null,
      robots: toTrimmedString(robots) || 'index, follow',
      og_title: toTrimmedString(og_title) || null,
      og_description: toTrimmedString(og_description) || null,
      og_image: toTrimmedString(og_image) || null,
    });

    await newSEO.save();

    return res.status(201).json({
      success: true,
      message: 'SEO record created successfully.',
      data: newSEO,
    });
  } catch (error) {
    console.error('Error creating SEO record:', error);

    if (error && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'SEO record already exists for this page_key.',
      });
    }

    if (error && error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

const updateSEO = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid SEO ID.',
    });
  }

  try {
    const seoRecord = await SeoPage.findOne({ _id: id, deleted_at: null });
    if (!seoRecord) {
      return res.status(404).json({
        success: false,
        message: 'SEO record not found.',
      });
    }

    const {
      page_key,
      page_name,
      page_url,
      meta_title,
      meta_description,
      canonical_url,
      robots,
      og_title,
      og_description,
      og_image,
    } = req.body;

    if (page_key !== undefined && page_key !== null && String(page_key).trim() !== '') {
      const normalizedPageKey = normalizePageKey(page_key);
      if (!isValidPageKey(normalizedPageKey)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid page_key. Supported values are: home, about-us, employer, employee, workforce-solutions, become-a-partner, blog, contact-us.',
        });
      }

      const duplicateRecord = await SeoPage.findOne({
        page_key: normalizedPageKey,
        _id: { $ne: seoRecord._id },
      });

      if (duplicateRecord) {
        return res.status(409).json({
          success: false,
          message: 'SEO record already exists for this page_key.',
        });
      }

      seoRecord.page_key = normalizedPageKey;
    }

    if (page_name !== undefined) seoRecord.page_name = toTrimmedString(page_name) || seoRecord.page_name;
    if (page_url !== undefined) seoRecord.page_url = toTrimmedString(page_url) || seoRecord.page_url;
    if (meta_title !== undefined) seoRecord.meta_title = toTrimmedString(meta_title) || seoRecord.meta_title;
    if (meta_description !== undefined) seoRecord.meta_description = toTrimmedString(meta_description) || seoRecord.meta_description;
    if (canonical_url !== undefined) seoRecord.canonical_url = toTrimmedString(canonical_url) || null;
    if (robots !== undefined) seoRecord.robots = toTrimmedString(robots) || 'index, follow';
    if (og_title !== undefined) seoRecord.og_title = toTrimmedString(og_title) || null;
    if (og_description !== undefined) seoRecord.og_description = toTrimmedString(og_description) || null;
    if (og_image !== undefined) seoRecord.og_image = toTrimmedString(og_image) || null;

    if (
      !seoRecord.page_key ||
      !seoRecord.page_name ||
      !seoRecord.page_url ||
      !seoRecord.meta_title ||
      !seoRecord.meta_description
    ) {
      return res.status(400).json({
        success: false,
        message: 'page_key, page_name, page_url, meta_title, and meta_description are required.',
      });
    }

    await seoRecord.save();

    return res.status(200).json({
      success: true,
      message: 'SEO record updated successfully.',
      data: seoRecord,
    });
  } catch (error) {
    console.error('Error updating SEO record:', error);

    if (error && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'SEO record already exists for this page_key.',
      });
    }

    if (error && error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

const deleteSEO = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid SEO ID.',
    });
  }

  try {
    const seoRecord = await SeoPage.findOne({ _id: id, deleted_at: null });

    if (!seoRecord) {
      return res.status(404).json({
        success: false,
        message: 'SEO record not found.',
      });
    }

    seoRecord.deleted_at = new Date();
    await seoRecord.save();

    return res.status(200).json({
      success: true,
      message: 'SEO record deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting SEO record:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

const getSEOByPageKey = async (req, res) => {
  const pageKey = normalizePageKey(req.params.pageKey);

  if (!pageKey || !isValidPageKey(pageKey)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid page_key. Supported values are: home, about-us, employer, employee, workforce-solutions, become-a-partner, blog, contact-us.',
    });
  }

  try {
    const seoRecord = await SeoPage.findOne({
      page_key: pageKey,
      deleted_at: null,
    }).lean();

    if (!seoRecord) {
      return res.status(404).json({
        success: false,
        message: 'SEO information not found for this page.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'SEO information fetched successfully.',
      data: seoRecord,
    });
  } catch (error) {
    console.error('Error fetching SEO record by page key:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  getAdminSEO,
  getAdminSEOById,
  createSEO,
  updateSEO,
  deleteSEO,
  getSEOByPageKey,
};
