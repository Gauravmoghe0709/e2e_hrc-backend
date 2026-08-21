const mongoose = require('mongoose');

const headOfficeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    address_line: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: false,
      trim: true,
    },
    postal_code: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    opening_hours_title: {
      type: String,
      required: true,
      trim: true,
    },
    opening_hours: {
      type: String,
      required: true,
      trim: true,
    },
    global_inquiries_title: {
      type: String,
      required: true,
      trim: true,
    },
    global_inquiries_description: {
      type: String,
      required: true,
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('HeadOffice', headOfficeSchema);
