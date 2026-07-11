const mongoose = require("mongoose");

const homeTestimonialSchema = new mongoose.Schema(
    {
        sectionTitle: { type: String, default: "Testimonials" },
        sectionHeading: { type: String, default: "What They Are Saying" },
        sectionDescription: { type: String, default: "" },
        items: [
            {
                title: { type: String, required: true },
                quote: { type: String, required: true },
                clientName: { type: String, default: "Verified Client" },
                clientCompany: { type: String, default: "E2E Consultancy" },
                displayOrder: { type: Number, default: 0 },
                isActive: { type: Boolean, default: true },
            },
        ],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("HomeTestimonial", homeTestimonialSchema);
