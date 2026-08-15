const mongoose = require('mongoose');
const BecomePartner = require('../../model/becomePartner/BecomePartner');
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

// ─── GET all (Admin) ──────────────────────────────────────────────────────────
const getRecruitmentPartners = async (req, res) => {
    try {
        const records = await BecomePartner.find().sort({ createdAt: -1 }).lean();
        return res.status(200).json({
            success: true,
            message: 'Recruitment partner records fetched successfully.',
            data: records,
        });
    } catch (error) {
        console.error('Error fetching recruitment partner records:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// ─── GET active (Public) ──────────────────────────────────────────────────────
const getActiveRecruitmentPartner = async (req, res) => {
    try {
        const record = await BecomePartner.findOne({ isActive: true }).sort({ createdAt: -1 }).lean();
        if (!record) {
            return res.status(404).json({ success: false, message: 'No active recruitment partner record found.' });
        }
        return res.status(200).json({
            success: true,
            message: 'Active recruitment partner record fetched successfully.',
            data: record,
        });
    } catch (error) {
        console.error('Error fetching active recruitment partner record:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// ─── POST (Admin) ─────────────────────────────────────────────────────────────
const createRecruitmentPartner = async (req, res) => {
    try {
        const { title, highlightText, subtitle, isActive } = req.body;

        if (!title || !highlightText || !subtitle) {
            return res.status(400).json({
                success: false,
                message: 'title, highlightText, and subtitle are required.',
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'backgroundImage is required.',
            });
        }

        const uploadedFile = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-become-partner');

        const created = await BecomePartner.create({
            title: title.trim(),
            highlightText: highlightText.trim(),
            subtitle: subtitle.trim(),
            backgroundImage: uploadedFile.url,
            isActive: isActive !== undefined ? normalizeBoolean(isActive) : true,
        });

        return res.status(201).json({
            success: true,
            message: 'Recruitment partner record created successfully.',
            data: created,
        });
    } catch (error) {
        console.error('Error creating recruitment partner record:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// ─── PUT (Admin) ──────────────────────────────────────────────────────────────
const updateRecruitmentPartner = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid recruitment partner ID.' });
        }

        const updateData = {};
        const { title, highlightText, subtitle, isActive } = req.body;

        if (title !== undefined) updateData.title = title.trim();
        if (highlightText !== undefined) updateData.highlightText = highlightText.trim();
        if (subtitle !== undefined) updateData.subtitle = subtitle.trim();
        if (isActive !== undefined) updateData.isActive = normalizeBoolean(isActive);

        // Handle image replacement if a new file was uploaded
        if (req.file) {
            const uploadedFile = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-become-partner');
            updateData.backgroundImage = uploadedFile.url;
        }

        const updated = await BecomePartner.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return res.status(404).json({ success: false, message: 'Recruitment partner record not found.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Recruitment partner record updated successfully.',
            data: updated,
        });
    } catch (error) {
        console.error('Error updating recruitment partner record:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// ─── DELETE (Admin) ───────────────────────────────────────────────────────────
const deleteRecruitmentPartner = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid recruitment partner ID.' });
        }

        const deleted = await BecomePartner.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Recruitment partner record not found.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Recruitment partner record deleted successfully.',
            data: null,
        });
    } catch (error) {
        console.error('Error deleting recruitment partner record:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

module.exports = {
    getRecruitmentPartners,
    getActiveRecruitmentPartner,
    createRecruitmentPartner,
    updateRecruitmentPartner,
    deleteRecruitmentPartner,
};
