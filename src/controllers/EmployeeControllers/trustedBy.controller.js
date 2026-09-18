const TrustedBy = require("../../model/Employee models/TrustedBy.model");
const uploadImage = require("../../services/storage.services");

const normalizeBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "on"].includes(normalized)) return true;
    if (["false", "0", "no", "off"].includes(normalized)) return false;
  }
  return true;
};

const getTrustedBy = async (req, res) => {
  try {
    const trustedBy = await TrustedBy.findOne({ isActive: true }).sort({ createdAt: -1 }).lean();

    if (!trustedBy) {
      return res.status(404).json({ success: false, message: "No active trusted by section found." });
    }

    const filteredLogos = (trustedBy.logos || [])
      .filter((logo) => logo.isActive !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return res.status(200).json({
      success: true,
      message: "Trusted By section fetched successfully.",
      data: {
        ...trustedBy,
        logos: filteredLogos,
      },
    });
  } catch (error) {
    console.error("Error in getTrustedBy:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createOrUpdateTrustedBy = async (req, res) => {
  try {
    const { eyebrowText, description, isActive } = req.body;

    if (!eyebrowText || !eyebrowText.toString().trim()) {
      return res.status(400).json({ success: false, message: "eyebrowText is required." });
    }

    if (!description || !description.toString().trim()) {
      return res.status(400).json({ success: false, message: "description is required." });
    }

    const existing = await TrustedBy.findOne();

    if (existing) {
      const updateData = {
        eyebrowText: eyebrowText.toString().trim(),
        description: description.toString().trim(),
        isActive: isActive !== undefined ? normalizeBoolean(isActive) : existing.isActive,
      };

      const updated = await TrustedBy.findByIdAndUpdate(existing._id, updateData, {
        new: true,
        runValidators: true,
      });

      return res.status(200).json({
        success: true,
        message: "Trusted By section updated successfully.",
        data: updated,
      });
    }

    const created = await TrustedBy.create({
      eyebrowText: eyebrowText.toString().trim(),
      description: description.toString().trim(),
      logos: [],
      isActive: isActive !== undefined ? normalizeBoolean(isActive) : true,
    });

    return res.status(201).json({
      success: true,
      message: "Trusted By section created successfully.",
      data: created,
    });
  } catch (error) {
    console.error("Error in createOrUpdateTrustedBy:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const uploadTrustedByLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No logo image provided." });
    }

    const trustedBy = await TrustedBy.findOne();
    if (!trustedBy) {
      return res.status(404).json({ success: false, message: "Trusted By section not found." });
    }

    const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-trusted-by");
    const logoItem = {
      image: uploadResponse.url,
      altText: (req.body.altText || "").toString().trim(),
      order: req.body.order !== undefined ? Number(req.body.order) : trustedBy.logos.length,
      isActive: true,
    };

    trustedBy.logos.push(logoItem);
    await trustedBy.save();

    return res.status(201).json({
      success: true,
      message: "Trusted By logo uploaded successfully.",
      data: trustedBy,
    });
  } catch (error) {
    console.error("Error in uploadTrustedByLogo:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateTrustedByLogo = async (req, res) => {
  try {
    const { logoId } = req.params;
    const { altText, order, isActive } = req.body;

    const trustedBy = await TrustedBy.findOne();
    if (!trustedBy) {
      return res.status(404).json({ success: false, message: "Trusted By section not found." });
    }

    const logo = trustedBy.logos.id(logoId);
    if (!logo) {
      return res.status(404).json({ success: false, message: "Logo not found." });
    }

    if (altText !== undefined) logo.altText = altText.toString().trim();
    if (order !== undefined) logo.order = Number(order);
    if (isActive !== undefined) logo.isActive = normalizeBoolean(isActive);

    await trustedBy.save();

    return res.status(200).json({
      success: true,
      message: "Trusted By logo updated successfully.",
      data: trustedBy,
    });
  } catch (error) {
    console.error("Error in updateTrustedByLogo:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteTrustedByLogo = async (req, res) => {
  try {
    const { logoId } = req.params;
    const trustedBy = await TrustedBy.findOne();

    if (!trustedBy) {
      return res.status(404).json({ success: false, message: "Trusted By section not found." });
    }

    const existingLogoCount = trustedBy.logos.length;
    trustedBy.logos = trustedBy.logos.filter((logo) => logo._id.toString() !== logoId);

    if (trustedBy.logos.length === existingLogoCount) {
      return res.status(404).json({ success: false, message: "Logo not found." });
    }

    await trustedBy.save();

    return res.status(200).json({
      success: true,
      message: "Trusted By logo deleted successfully.",
      data: trustedBy,
    });
  } catch (error) {
    console.error("Error in deleteTrustedByLogo:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const reorderTrustedByLogos = async (req, res) => {
  try {
    const { logos } = req.body;
    if (!Array.isArray(logos)) {
      return res.status(400).json({ success: false, message: "logos array is required." });
    }

    const trustedBy = await TrustedBy.findOne();
    if (!trustedBy) {
      return res.status(404).json({ success: false, message: "Trusted By section not found." });
    }

    const map = new Map(logos.map((item) => [item.id, Number(item.order) || 0]));
    trustedBy.logos = trustedBy.logos.map((logo) => ({
      ...logo.toObject(),
      order: map.get(logo._id.toString()) ?? logo.order,
    }));
    trustedBy.logos.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    await trustedBy.save();

    return res.status(200).json({
      success: true,
      message: "Trusted By logos reordered successfully.",
      data: trustedBy,
    });
  } catch (error) {
    console.error("Error in reorderTrustedByLogos:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getPublicTrustedBy = async (req, res) => {
  try {
    const trustedBy = await TrustedBy.findOne({ isActive: true }).lean();
    if (!trustedBy) {
      return res.status(404).json({ success: false, message: "Active Trusted By section not found." });
    }

    const publicLogos = (trustedBy.logos || [])
      .filter((logo) => logo.isActive !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return res.status(200).json({
      success: true,
      message: "Public Trusted By section fetched successfully.",
      data: {
        ...trustedBy,
        logos: publicLogos,
      },
    });
  } catch (error) {
    console.error("Error in getPublicTrustedBy:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getTrustedBy,
  createOrUpdateTrustedBy,
  uploadTrustedByLogo,
  updateTrustedByLogo,
  deleteTrustedByLogo,
  reorderTrustedByLogos,
  getPublicTrustedBy,
};
