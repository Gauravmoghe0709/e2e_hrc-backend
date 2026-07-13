const mongoose = require("mongoose");

const employeeWhyChooseCardSchema = new mongoose.Schema(
  {
    eyebrowText: {
      type: String,
      default: "",
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Card title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Card description is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    stat1Value: {
      type: String,
      default: "",
      trim: true,
    },
    stat1Label: {
      type: String,
      default: "",
      trim: true,
    },
    stat2Value: {
      type: String,
      default: "",
      trim: true,
    },
    stat2Label: {
      type: String,
      default: "",
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
  mongoose.models.EmployeeWhyChooseCard ||
  mongoose.model("EmployeeWhyChooseCard", employeeWhyChooseCardSchema);
