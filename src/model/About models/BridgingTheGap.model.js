const mongoose = require("mongoose");

const bridgingTheGapSchema = new mongoose.Schema(
    {
        heading: { type: String, required: true },
        description: { type: String, default: "" },
        feature1: { type: String, default: "" },
        feature2: { type: String, default: "" },
        feature3: { type: String, default: "" },
        locationLabel: { type: String, trim: true, default: "" },
        locationValue: { type: String, trim: true, default: "" },
        image: { type: String, default: "" },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("BridgingTheGap", bridgingTheGapSchema);
