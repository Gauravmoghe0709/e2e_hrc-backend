const mongoose = require('mongoose');

const testimonialSectionSchema = new mongoose.Schema({
  badgeText: {
    type: String,
    default: 'Testimonials'
  },
  sectionTitle: {
    type: String,
    default: 'What They Are Saying'
  },
  sectionDescription: {
    type: String,
    default: 'Discover the stories and experiences of our satisfied clients and candidates.'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('TestimonialSection', testimonialSectionSchema);
