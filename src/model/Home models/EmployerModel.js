const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'],
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true,
  },
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
  },
  vacancy: {
    type: String,
    required: [true, 'Vacancy is required'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
  },
  attachment: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new',
  },
}, { timestamps: true });

module.exports = mongoose.model('Employer', employerSchema);
