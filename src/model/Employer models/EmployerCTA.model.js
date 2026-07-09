const mongoose = require('mongoose');

const employerCTASchema = new mongoose.Schema(
  {
    ctaTitle: {
      type: String,
      required: true,
      trim: true,
    },
    ctaDescription: {
      type: String,
      default: "",
    },
    buttonText: {
      type: String,
      required: true,
      trim: true,
    },
    buttonLink: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.EmployerCTA || mongoose.model('EmployerCTA', employerCTASchema);
