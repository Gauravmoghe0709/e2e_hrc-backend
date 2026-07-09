const mongoose = require("mongoose");

const testimonialCardSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyCategory: {
      type: String,
      default: "",
      trim: true,
    },
    reviewText: {
      type: String,
      required: true,
      trim: true,
    },
    reviewerName: {
      type: String,
      required: true,
      trim: true,
    },
    reviewerDesignation: {
      type: String,
      required: true,
      trim: true,
    },
    reviewerCompany: {
      type: String,
      default: "",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.TestimonialCard ||
  mongoose.model("TestimonialCard", testimonialCardSchema);
