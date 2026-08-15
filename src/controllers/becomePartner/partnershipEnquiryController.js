const mongoose = require('mongoose');
const PartnershipEnquiry = require('../../model/becomePartner/PartnershipEnquiry');

// ─── POST (Public) — Submit a new partnership enquiry ─────────────────────────
const createPartnershipEnquiry = async (req, res) => {
    try {
        const { name, email, countryCode, contactNumber, message } = req.body;

        // Validate required fields
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Name is required.' });
        }
        if (!email || !email.trim()) {
            return res.status(400).json({ success: false, message: 'Email is required.' });
        }
        if (!countryCode || !countryCode.trim()) {
            return res.status(400).json({ success: false, message: 'Country code is required.' });
        }
        if (!contactNumber || !contactNumber.trim()) {
            return res.status(400).json({ success: false, message: 'Contact number is required.' });
        }
        if (!message || !message.trim()) {
            return res.status(400).json({ success: false, message: 'Message is required.' });
        }

        // Validate email format
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
        }

        // Always set status to "new" — public users cannot set status
        const enquiry = await PartnershipEnquiry.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            countryCode: countryCode.trim(),
            contactNumber: contactNumber.trim(),
            message: message.trim(),
            status: 'new',
        });

        return res.status(201).json({
            success: true,
            message: 'Partnership enquiry submitted successfully.',
            data: enquiry,
        });
    } catch (error) {
        console.error('Error creating partnership enquiry:', error);
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const msg = Object.values(error.errors).map((e) => e.message).join(' ');
            return res.status(400).json({ success: false, message: msg });
        }
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// ─── GET all (Admin) ──────────────────────────────────────────────────────────
const getAllPartnershipEnquiries = async (req, res) => {
    try {
        const enquiries = await PartnershipEnquiry.find().sort({ createdAt: -1 }).lean();
        return res.status(200).json({
            success: true,
            message: 'Partnership enquiries fetched successfully.',
            data: enquiries,
        });
    } catch (error) {
        console.error('Error fetching partnership enquiries:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// ─── GET single (Admin) ───────────────────────────────────────────────────────
const getPartnershipEnquiryById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid enquiry ID.' });
        }

        const enquiry = await PartnershipEnquiry.findById(id).lean();

        if (!enquiry) {
            return res.status(404).json({ success: false, message: 'Partnership enquiry not found.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Partnership enquiry fetched successfully.',
            data: enquiry,
        });
    } catch (error) {
        console.error('Error fetching partnership enquiry by ID:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// ─── PUT (Admin) — Update status only ─────────────────────────────────────────
const updatePartnershipEnquiry = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid enquiry ID.' });
        }

        const { status } = req.body;

        const allowedStatuses = ['new', 'read', 'replied'];
        if (!status) {
            return res.status(400).json({ success: false, message: 'Status is required.' });
        }
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}.`,
            });
        }

        const updated = await PartnershipEnquiry.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: 'Partnership enquiry not found.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Partnership enquiry updated successfully.',
            data: updated,
        });
    } catch (error) {
        console.error('Error updating partnership enquiry:', error);
        if (error.name === 'ValidationError') {
            const msg = Object.values(error.errors).map((e) => e.message).join(' ');
            return res.status(400).json({ success: false, message: msg });
        }
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// ─── DELETE (Admin) ───────────────────────────────────────────────────────────
const deletePartnershipEnquiry = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid enquiry ID.' });
        }

        const deleted = await PartnershipEnquiry.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Partnership enquiry not found.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Partnership enquiry deleted successfully.',
            data: null,
        });
    } catch (error) {
        console.error('Error deleting partnership enquiry:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

module.exports = {
    createPartnershipEnquiry,
    getAllPartnershipEnquiries,
    getPartnershipEnquiryById,
    updatePartnershipEnquiry,
    deletePartnershipEnquiry,
};
