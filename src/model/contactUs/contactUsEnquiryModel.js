const mongoose = require('mongoose');

const contactUsEnquirySchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    iam: {
      type: String,
      required: true,
      enum: {
        values: ['employer', 'job_seeker', 'recruitment_partner', 'other'],
        message: 'iam must be one of: employer, job_seeker, recruitment_partner, other',
      },
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    attachment: {
      filename: {
        type: String,
      },
      url: {
        type: String,
      },
      mimeType: {
        type: String,
      },
      size: {
        type: Number,
      },
    },
    status: {
      type: String,
      enum: {
        values: ['new', 'read', 'replied'],
        message: 'status must be one of: new, read, replied',
      },
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ContactUsEnquiry', contactUsEnquirySchema);
