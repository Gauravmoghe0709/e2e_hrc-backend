const mongoose = require("mongoose");

const whyChooseSchema = new mongoose.Schema({
    sectionTitle: { type: String, default: "Why Choose E2E HRC?" },
    sectionDescription: { type: String, default: "Delivering excellence through dedicated service and unparalleled market knowledge." },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("WhyChoose", whyChooseSchema);
