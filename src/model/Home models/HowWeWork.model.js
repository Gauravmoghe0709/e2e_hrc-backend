const mongoose = require("mongoose");

const howWeWorkStepSchema = new mongoose.Schema(
  {
    stepNumber: { type: String, trim: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    journeyType: { type: String, trim: true },
  },
  { _id: false }
);

const howWeWorkSchema = new mongoose.Schema(
  {
    sectionTitle: {
      type: String,
      required: [true, "Section title is required"],
      trim: true,
    },
    sectionDescription: {
      type: String,
      required: [true, "Section description is required"],
      trim: true,
    },
    employerSteps: [howWeWorkStepSchema],
    employeeSteps: [howWeWorkStepSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HowWeWork", howWeWorkSchema);
