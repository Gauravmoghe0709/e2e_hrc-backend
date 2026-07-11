const mongoose = require("mongoose");

const homeGlobalPresenceSchema = new mongoose.Schema(
    {
        title: { type: String, default: "Our Global Footprint" },
        description: { type: String, default: "" },
        mapImage: { type: String, default: "" },
        locations: [
            {
                name: { type: String, required: true },
                left: { type: String, required: true },
                top: { type: String, required: true },
                size: { type: Number, default: 12 },
                dotColor: { type: String, default: "#FFB952" },
                ringColor: { type: String, default: "rgba(255,185,82,0.2)" },
                displayOrder: { type: Number, default: 0 },
                isActive: { type: Boolean, default: true },
            },
        ],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("HomeGlobalPresence", homeGlobalPresenceSchema);
