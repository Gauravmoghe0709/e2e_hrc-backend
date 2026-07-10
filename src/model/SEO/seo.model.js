const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema({
  pageName: {
    type: String,
    required: true,
    trim: true,
  },
  metaTitle: {
    type: String,
    required: true,
    trim: true,
  },
  metaDescription: {
    type: String,
    required: true,
    trim: true,
  },
  metaKeywords: {
    type: String,
    default: "",
    trim: true,
  },
  canonicalUrl: {
    type: String,
    default: "",
    trim: true,
  },
  ogTitle: {
    type: String,
    default: "",
    trim: true,
  },
  ogDescription: {
    type: String,
    default: "",
    trim: true,
  },
  ogImage: {
    type: String,
    default: "",
    trim: true,
  },
  robots: {
    type: String,
    default: "index, follow",
    enum: ["index, follow", "noindex, follow", "index, nofollow", "noindex, nofollow"],
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

const SEO = mongoose.model("SEO", seoSchema);

module.exports = SEO;
