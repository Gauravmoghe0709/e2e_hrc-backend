const mongoose = require("mongoose");

const trustedBySectionSchema = new mongoose.Schema({
    badgeText: { type: String, required: true },
    title: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

const TrustedBySection = mongoose.model("TrustedBySection", trustedBySectionSchema);

module.exports = TrustedBySection;
