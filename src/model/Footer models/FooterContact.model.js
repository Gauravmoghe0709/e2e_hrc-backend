const mongoose = require('mongoose');

const footerContactSchema = new mongoose.Schema({
  sectionTitle: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const FooterContact = mongoose.model('FooterContact', footerContactSchema);

module.exports = FooterContact;
