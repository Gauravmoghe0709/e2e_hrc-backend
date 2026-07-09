const mongoose = require('mongoose');

const footerCompanyInfoSchema = new mongoose.Schema({
  logo: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const FooterCompanyInfo = mongoose.model('FooterCompanyInfo', footerCompanyInfoSchema);

module.exports = FooterCompanyInfo;
