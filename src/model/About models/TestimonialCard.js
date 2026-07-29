const mongoose = require('mongoose');

const testimonialCardSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  companyLogo: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('TestimonialCard', testimonialCardSchema);
