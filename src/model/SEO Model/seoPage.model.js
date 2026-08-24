const mongoose = require('mongoose');

const seoPageSchema = new mongoose.Schema(
  {
    page_key: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      enum: [
        'home',
        'about-us',
        'employer',
        'employee',
        'workforce-solutions',
        'become-a-partner',
        'blog',
        'contact-us',
      ],
    },
    page_name: {
      type: String,
      required: true,
      trim: true,
    },
    page_url: {
      type: String,
      required: true,
      trim: true,
    },
    meta_title: {
      type: String,
      required: true,
      trim: true,
    },
    meta_description: {
      type: String,
      required: true,
      trim: true,
    },
    canonical_url: {
      type: String,
      trim: true,
      default: null,
    },
    robots: {
      type: String,
      trim: true,
      default: 'index, follow',
    },
    og_title: {
      type: String,
      trim: true,
      default: null,
    },
    og_description: {
      type: String,
      trim: true,
      default: null,
    },
    og_image: {
      type: String,
      trim: true,
      default: null,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

seoPageSchema.virtual('id').get(function () {
  return this._id.toString();
});

module.exports = mongoose.model('SeoPage', seoPageSchema);
