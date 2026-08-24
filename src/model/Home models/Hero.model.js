const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String },
    heroImage: { type: String },
    stats: {
        type: [{
            label: { type: String, required: true, trim: true },
            value: { type: String, required: true, trim: true },
        }],
        validate: {
            validator: (stats) => stats.length <= 4,
            message: "Hero can have a maximum of 4 stats",
        },
        default: [],
    },
    isActive: { type: Boolean, default: true }

}, {
    timestamps: true
});

const Hero = mongoose.model("Hero", heroSchema);

module.exports = Hero;
