const mongoose = require('mongoose');

const footerOfficeLocationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const FooterOfficeLocation = mongoose.model('FooterOfficeLocation', footerOfficeLocationSchema);

module.exports = FooterOfficeLocation;
