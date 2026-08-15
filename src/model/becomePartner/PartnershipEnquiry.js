const mongoose = require('mongoose');

const partnershipEnquirySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required.'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required.'],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'],
        },
        countryCode: {
            type: String,
            required: [true, 'Country code is required.'],
            trim: true,
        },
        contactNumber: {
            type: String,
            required: [true, 'Contact number is required.'],
            trim: true,
        },
        message: {
            type: String,
            required: [true, 'Message is required.'],
            trim: true,
        },
        status: {
            type: String,
            enum: {
                values: ['new', 'read', 'replied'],
                message: 'Status must be one of: new, read, replied.',
            },
            default: 'new',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('PartnershipEnquiry', partnershipEnquirySchema);
