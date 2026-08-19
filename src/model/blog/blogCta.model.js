const mongoose = require('mongoose');

const blogCtaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  buttonText: {
    type: String,
    required: true,
    trim: true,
  },
  buttonLink: {
    type: String,
    required: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model('BlogCTA', blogCtaSchema);