const mongoose = require("mongoose");

const whyChooseE2ESchema = new mongoose.Schema(
  {
    sectionTitle: { type: String, required: true },
    sectionDescription: { type: String, default: "" },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WhyChooseE2E", whyChooseE2ESchema);
