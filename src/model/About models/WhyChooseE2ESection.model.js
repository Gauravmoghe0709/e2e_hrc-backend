const mongoose = require("mongoose");

const whyChooseE2ESectionSchema = new mongoose.Schema(
  {
    sectionTitle: {
      type: String,
      required: true,
      trim: true,
    },
    sectionDescription: {
      type: String,
      default: "",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.WhyChooseE2ESection ||
  mongoose.model("WhyChooseE2ESection", whyChooseE2ESectionSchema);
