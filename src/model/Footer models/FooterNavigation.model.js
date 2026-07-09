const mongoose = require('mongoose');

const footerNavigationMenuItemSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { _id: false });

const footerNavigationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  menuItems: {
    type: [footerNavigationMenuItemSchema],
    default: [],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const FooterNavigation = mongoose.model('FooterNavigation', footerNavigationSchema);

module.exports = FooterNavigation;
