const mongoose = require("mongoose");

const trustedBySchema = new mongoose.Schema(
  {
    eyebrowText: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    logos: [
      {
        image: {
          type: String,
          required: true,
        },

        altText: {
          type: String,
          default: "",
        },

        order: {
          type: Number,
          default: 0,
        },

        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TrustedBy", trustedBySchema);
