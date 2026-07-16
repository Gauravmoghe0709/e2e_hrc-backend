const mongoose = require('mongoose');

const employeeTestimonialCardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    reviewText: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
      default: '',
    },
    companyLogo: {
      type: String,
      default: '',
    },
    reviewerName: {
      type: String,
      trim: true,
      default: '',
    },
    reviewerDesignation: {
      type: String,
      trim: true,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.EmployeeTestimonialCard || mongoose.model('EmployeeTestimonialCard', employeeTestimonialCardSchema);
