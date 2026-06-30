const mongoose = require("mongoose");

const aboutHeroSchema = new mongoose.Schema(
    {
        mainTitle: { type: String, required: true },
        description: { type: String, default: "" },
        button1Text: { type: String, default: "" },
        button1Link: { type: String, default: "" },
        button2Text: { type: String, default: "" },
        button2Link: { type: String, default: "" },
        heroImage: { type: String, default: "" },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("AboutHero", aboutHeroSchema);
