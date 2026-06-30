const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String },
    heroImage: { type: String },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

const Hero = mongoose.model("Hero", heroSchema);

module.exports = Hero;
