const SEO = require('../../model/SEO/seo.model');
const uploadImage = require('../../services/storage.services');

// Public API
exports.getActiveSEO = async (req, res) => {
    try {
        const { pageName } = req.params;
        const activeSEO = await SEO.findOne({ isActive: true, pageName: pageName });
        
        if (!activeSEO) {
            return res.status(404).json({
                success: false,
                message: "No active SEO data found.",
                data: null
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Active SEO data fetched successfully.",
            data: activeSEO
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching active SEO data.",
            error: error.message
        });
    }
};

// Admin APIs
exports.createSEO = async (req, res) => {
    try {
        const {
            pageName,
            metaTitle,
            metaDescription,
            metaKeywords,
            canonicalUrl,
            ogTitle,
            ogDescription,
            robots,
            isActive
        } = req.body;

        let ogImageUrl = "";

        if (req.file) {
            const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-seo");
            ogImageUrl = uploadResponse.url;
        }

        const isCurrentlyActive = isActive === 'true' || isActive === true;

        if (isCurrentlyActive && pageName) {
            await SEO.updateMany({ pageName: pageName }, { isActive: false });
        }

        const newSEO = new SEO({
            pageName: pageName?.trim(),
            metaTitle: metaTitle?.trim(),
            metaDescription: metaDescription?.trim(),
            metaKeywords: metaKeywords?.trim(),
            canonicalUrl: canonicalUrl?.trim(),
            ogTitle: ogTitle?.trim(),
            ogDescription: ogDescription?.trim(),
            robots,
            ogImage: ogImageUrl,
            isActive: isCurrentlyActive
        });

        const savedSEO = await newSEO.save();

        return res.status(201).json({
            success: true,
            message: "SEO record created successfully.",
            data: savedSEO
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating SEO record.",
            error: error.message
        });
    }
};

exports.getAllSEO = async (req, res) => {
    try {
        const seoRecords = await SEO.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "SEO records fetched successfully.",
            data: seoRecords
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching SEO records.",
            error: error.message
        });
    }
};

exports.updateSEO = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            pageName,
            metaTitle,
            metaDescription,
            metaKeywords,
            canonicalUrl,
            ogTitle,
            ogDescription,
            robots,
            isActive
        } = req.body;

        const seoRecord = await SEO.findById(id);
        if (!seoRecord) {
            return res.status(404).json({
                success: false,
                message: "SEO record not found.",
                data: null
            });
        }

        const isCurrentlyActive = isActive === 'true' || isActive === true;
        const targetPageName = pageName || seoRecord.pageName;

        if (isCurrentlyActive && !seoRecord.isActive) {
            await SEO.updateMany({ _id: { $ne: id }, pageName: targetPageName }, { isActive: false });
        }

        const updatedData = {
            pageName: pageName?.trim(),
            metaTitle: metaTitle?.trim(),
            metaDescription: metaDescription?.trim(),
            metaKeywords: metaKeywords?.trim(),
            canonicalUrl: canonicalUrl?.trim(),
            ogTitle: ogTitle?.trim(),
            ogDescription: ogDescription?.trim(),
            robots,
            isActive: isCurrentlyActive
        };

        const updatedSEO = await SEO.findByIdAndUpdate(
            id,
            { $set: updatedData },
            { returnDocument: "after", runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "SEO record updated successfully.",
            data: updatedSEO
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating SEO record.",
            error: error.message
        });
    }
};

exports.updateSEOImage = async (req, res) => {
    try {
        const { id } = req.params;

        const seoRecord = await SEO.findById(id);
        if (!seoRecord) {
            return res.status(404).json({
                success: false,
                message: "SEO record not found.",
                data: null
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided.",
                data: null
            });
        }

        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-seo");
        const ogImageUrl = uploadResponse.url;

        const updatedSEO = await SEO.findByIdAndUpdate(
            id,
            { $set: { ogImage: ogImageUrl } },
            { returnDocument: "after" }
        );

        return res.status(200).json({
            success: true,
            message: "SEO image updated successfully.",
            data: updatedSEO
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating SEO image.",
            error: error.message
        });
    }
};

exports.deleteSEO = async (req, res) => {
    try {
        const { id } = req.params;

        const seoRecord = await SEO.findById(id);
        if (!seoRecord) {
            return res.status(404).json({
                success: false,
                message: "SEO record not found.",
                data: null
            });
        }

        await SEO.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "SEO record deleted successfully.",
            data: null
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting SEO record.",
            error: error.message
        });
    }
};
