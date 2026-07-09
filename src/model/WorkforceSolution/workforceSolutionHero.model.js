const mongoose = require('mongoose');

const statsCardSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    trim: true,
  },
  label: {
    type: String,
    required: true,
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, { _id: false });

const workforceSolutionSchema = new mongoose.Schema({
  badgeText: {
    type: String,
    required: true,
    trim: true,
  },
  titleLine1: {
    type: String,
    required: true,
    trim: true,
  },
  highlightedTitle: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  heroImage: {
    type: String,
    default: '',
  },
  stats: [statsCardSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('WorkforceSolution', workforceSolutionSchema);
