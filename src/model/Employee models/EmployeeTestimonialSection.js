const mongoose = require('mongoose');

const employeeTestimonialSectionSchema = new mongoose.Schema(
  {
    badgeText: {
      type: String,
      trim: true,
      default: 'Testimonials',
    },
    sectionTitle: {
      type: String,
      required: true,
      trim: true,
    },
    sectionDescription: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.EmployeeTestimonialSection || mongoose.model('EmployeeTestimonialSection', employeeTestimonialSectionSchema);
