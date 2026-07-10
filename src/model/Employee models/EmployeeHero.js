const mongoose = require("mongoose");

const employeeHeroSchema = new mongoose.Schema({
  badgeText: {
    type: String,
    default: "Find Jobs That Match Your Skills",
    trim: true,
  },
  titleLine1: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  leftTopImage: {
    type: String,
    default: "",
  },
  leftBottomImage: {
    type: String,
    default: "",
  },
  rightImage: {
    type: String,
    default: "",
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("EmployeeHero", employeeHeroSchema);
