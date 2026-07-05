const mongoose = require("mongoose");

const whoWeAreSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description1: { type: String, default: "" },
        description2: { type: String, default: "" },
        description3: { type: String, default: "" },
        image: { type: String, default: "" },
        experienceYears: { type: String, default: "" },
        experienceLabel: { type: String, default: "" },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("WhoWeAre", whoWeAreSchema);
