const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String },
    image: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
