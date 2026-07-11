const mongoose = require("mongoose");

const homeMissionVisionSchema = new mongoose.Schema(
    {
        missionTitle: { type: String, default: "Our Mission" },
        missionDescription: { type: String, default: "" },
        visionTitle: { type: String, default: "Our Vision" },
        visionDescription: { type: String, default: "" },
        visionImage: { type: String, default: "" },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("HomeMissionVision", homeMissionVisionSchema);
