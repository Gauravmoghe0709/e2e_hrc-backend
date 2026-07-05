const mongoose = require("mongoose");

const missionVisionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["mission", "vision"],
  },
  icon: { type: String, default: "" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("MissionVision", missionVisionSchema);
