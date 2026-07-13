const mongoose = require("mongoose");

const employeeJourneyCardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.EmployeeJourneyCard ||
  mongoose.model("EmployeeJourneyCard", employeeJourneyCardSchema);
