const mongoose = require('mongoose');

const employerHowWeWorkSectionSchema = new mongoose.Schema(
  {
    sectionTitle: {
      type: String,
      required: true,
      trim: true,
    },
    sectionDescription: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.EmployerHowWeWorkSection || mongoose.model('EmployerHowWeWorkSection', employerHowWeWorkSectionSchema);
