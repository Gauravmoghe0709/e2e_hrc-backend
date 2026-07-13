const mongoose = require("mongoose");

const employeeJourneySectionSchema = new mongoose.Schema(
  {
    badgeText: {
      type: String,
      default: "TRUSTED DIGITAL SOLUTIONS FOR YOUR BUSINESS",
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
  mongoose.models.EmployeeJourneySection ||
  mongoose.model("EmployeeJourneySection", employeeJourneySectionSchema);
