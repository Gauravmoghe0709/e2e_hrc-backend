const mongoose = require("mongoose");

const peopleBehindMagicSchema = new mongoose.Schema(
  {
    sectionTitle: {
      type: String,
      required: true,
      trim: true,
    },
    sectionDescription: {
      type: String,
      required: true,
      trim: true,
    },
    sectionDetails: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.PeopleBehindMagic ||
  mongoose.model("PeopleBehindMagic", peopleBehindMagicSchema);
