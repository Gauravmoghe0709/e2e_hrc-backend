const mongoose = require('mongoose');
const seoSchema = require('./SeoSchema');

const blogSchema = new mongoose.Schema(
  {
    blogHeading: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    publishDate: {
      type: Date,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    paragraph1: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    paragraph2: {
      type: String,
    },
    heading2: {
      type: String,
    },
    paragraph3: {
      type: String,
    },
    quote: {
      type: String,
    },
    heading3: {
      type: String,
    },
    paragraph4: {
      type: String,
    },
    paragraph5: {
      type: String,
    },
    heading4: {
      type: String,
    },
    paragraph6: {
      type: String,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    seo: {
      type: seoSchema,
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

module.exports = mongoose.model('Blog', blogSchema);
