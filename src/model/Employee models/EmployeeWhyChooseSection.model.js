const mongoose = require("mongoose");

const employeeWhyChooseSectionSchema = new mongoose.Schema(
  {
    badgeText: {
      type: String,
      default: "",
      trim: true,
    },
    sectionTitle: {
      type: String,
      required: [true, "Section title is required"],
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
  mongoose.models.EmployeeWhyChooseSection ||
  mongoose.model("EmployeeWhyChooseSection", employeeWhyChooseSectionSchema);
