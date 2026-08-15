const mongoose = require('mongoose');

const recruitmentPartnersSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        highlightText: {
            type: String,
            required: true,
            trim: true,
        },
        backgroundImage: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('RecruitmentPartners', recruitmentPartnersSchema);
