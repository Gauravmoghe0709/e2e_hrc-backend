const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    officeName: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    address: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    hours: {
      type: String,
      trim: true,
    },
    openingHours: {
      type: String,
      trim: true,
    },
    aboutText: {
      type: String,
      trim: true,
    },
    aboutTitle: {
      type: String,
      trim: true,
    },
    aboutDescription: {
      type: String,
      trim: true,
    },
    directionsQuery: {
      type: String,
      trim: true,
    },
    stats: {
      type: [
        {
          value: {
            type: String,
            required: true,
            trim: true,
          },
          label: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
      required: true,
      validate: {
        validator: function validateStatsLength(value) {
          return Array.isArray(value) && value.length === 4;
        },
        message: 'Exactly 4 statistics are required.',
      },
    },
    type: {
      type: String,
      enum: ['headOffice', 'regional'],
      default: 'regional',
      index: true,
    },
    displayOrder: {
      type: Number,
      min: 1,
      default: null,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

locationSchema.index({ type: 1, displayOrder: 1, createdAt: 1 });

module.exports = mongoose.model('Location', locationSchema);
