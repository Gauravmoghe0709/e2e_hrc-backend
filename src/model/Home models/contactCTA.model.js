const mongoose = require("mongoose");

const contactCTASchema = new mongoose.Schema(
  {
    badgeText: {
      type: String,
      default: "Ready to get started?",
      trim: true,
    },

    headingLine1: {
      type: String,
      required: true,
      trim: true,
    },

    highlightText: {
      type: String,
      required: true,
      trim: true,
    },

    headingLine2: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    feature1: {
      type: String,
      default: "",
      trim: true,
    },

    feature2: {
      type: String,
      default: "",
      trim: true,
    },

    button1Text: {
      type: String,
      default: "Hire Talent",
      trim: true,
    },

    button2Text: {
      type: String,
      default: "Explore Opportunities",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactCTA", contactCTASchema);