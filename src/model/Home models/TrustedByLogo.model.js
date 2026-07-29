const mongoose = require("mongoose");

const trustedByLogoSchema = new mongoose.Schema({
    companyName: { type: String,  },
    logo: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    websiteUrl: { type: String }
}, {
    timestamps: true
});

// Add index on companyName for faster lookups
trustedByLogoSchema.index({ companyName: 1 });

const TrustedByLogo = mongoose.model("TrustedByLogo", trustedByLogoSchema);

module.exports = TrustedByLogo;
