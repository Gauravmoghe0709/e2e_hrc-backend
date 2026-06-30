const mongoose = require("mongoose");

const whoWeAreSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        paragraph1: { type: String, default: "" },
        image: { type: String, default: "" },
        experienceValue: { type: String, default: "" },
        experienceLabel: { type: String, default: "" },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("WhoWeAre", whoWeAreSchema);
