const mongoose = require("mongoose");

const aboutTestimonialSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        designation: { type: String, default: "" },
        quote: { type: String, required: true },
        profileImage: { type: String, default: "" },
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("AboutTestimonial", aboutTestimonialSchema);
