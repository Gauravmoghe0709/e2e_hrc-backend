const mongoose = require("mongoose");

const testimonialSectionSchema = new mongoose.Schema(
  {
    badgeText: {
      type: String,
      default: "WHAT OUR CLIENTS SAY",
      trim: true,
    },
    sectionTitle: {
      type: String,
      required: true,
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
  mongoose.models.TestimonialSection ||
  mongoose.model("TestimonialSection", testimonialSectionSchema);
