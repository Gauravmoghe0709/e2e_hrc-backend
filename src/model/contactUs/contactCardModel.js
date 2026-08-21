const mongoose = require('mongoose');

const contactCardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    phone_title: {
      type: String,
      required: true,
      trim: true,
    },
    phone_number: {
      type: String,
      required: true,
      trim: true,
    },
    email_title: {
      type: String,
      required: true,
      trim: true,
    },
    email_address: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    office_title: {
      type: String,
      required: true,
      trim: true,
    },
    office_address: {
      type: String,
      required: true,
      trim: true,
    },
    office_map_url: {
      type: String,
      required: false,
      trim: true,
      validate: {
        validator: function (value) {
          if (!value) return true; // optional field
          try {
            new URL(value);
            return true;
          } catch (err) {
            return false;
          }
        },
        message: 'Please provide a valid URL for office map',
      },
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

module.exports = mongoose.model('ContactCard', contactCardSchema);
