const mongoose = require("mongoose");

const employeerSchema = new mongoose.Schema({
    badgeText: {
    type: String,
    required: true,
  },
    titleLine: {
    type: String,
    required: true,
  },
    highlightedText: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
    buttonText: {
    type: String,
    required: true,
  },
    buttonLink: {
    type: String,
    required: true,
  },
  cardType: {
    type: String,
    enum: ['employer', 'employee'],
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  displayOrder: {
    type: Number,
    required: true,
  },
  isActive:{
    type: Boolean,
    default: true,
  }
});

const Employersection = mongoose.model("Employersection", employeerSchema);
module.exports = Employersection;