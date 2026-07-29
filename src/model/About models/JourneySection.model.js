const mongoose = require("mongoose");

const journeySectionSchema = new mongoose.Schema(
  {
    badgeText: {
      type: String,
      default: "",
      trim: true,
    },
    badgeSubText: {
      type: String,
      default: "",
      trim: true,
    },
    sectionTitle: {
      type: String,
      required: true,
      trim: true,
    },
    sectionDescription: {
      type: String,
      default: "",
      trim: true,
    },
    introText: {
      type: String,
      default: "",
      trim: true,
    },
    statYears: {
      type: Number,
      default: 0,
    },
    statCountries: {
      type: Number,
      default: 0,
    },
    statMilestones: {
      type: Number,
      default: 0,
    },
    statYearsLabel: {
      type: String,
      default: "Years",
      trim: true,
    },
    statCountriesLabel: {
      type: String,
      default: "Countries",
      trim: true,
    },
    statMilestonesLabel: {
      type: String,
      default: "Milestones",
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
  mongoose.models.JourneySection ||
  mongoose.model("JourneySection", journeySectionSchema);
