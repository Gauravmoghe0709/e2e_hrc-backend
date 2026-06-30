const mongoose = require("mongoose");

const approachCardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    stat1Value: { type: String, default: "" },
    stat1Label: { type: String, default: "" },
    stat2Value: { type: String, default: "" },
    stat2Label: { type: String, default: "" },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("ApproachCard", approachCardSchema);
