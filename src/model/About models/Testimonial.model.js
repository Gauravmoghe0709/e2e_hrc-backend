const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  badgeText: { type: String, default: "Testimonials" },
  sectionTitle: { type: String, default: "What They Are Saying" },
  highlightText: { type: String, default: "Saying" },
  sectionDescription: { type: String, default: "Discover the stories and experiences of individuals and companies who have found success and excellence through E2E HRC." },
  testimonialTitle: { type: String, default: "" },
  review: { type: String, required: true },
  companyName: { type: String, default: "" },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Testimonial", testimonialSchema);
