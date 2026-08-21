const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    highlightedText: {
      type: String,
      required: true,
      trim: true,
    },
    backgroundImage: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ContactUs', contactUsSchema);
