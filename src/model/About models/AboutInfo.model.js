const mongoose = require("mongoose");

const bulletPointSchema = new mongoose.Schema(
    {
        text: { type: String, required: true, trim: true },
        order: { type: Number, default: 0 },
    },
    { _id: false }
);

const aboutInfoSchema = new mongoose.Schema(
    {
        badgeText: { type: String, required: true, trim: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        image: { type: String, default: "" },
        bulletPoints: { type: [bulletPointSchema], default: [] },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("AboutInfo", aboutInfoSchema);
