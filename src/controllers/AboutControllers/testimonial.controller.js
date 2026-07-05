const Testimonial = require("../../model/About models/Testimonial.model");

const createTestimonial = async (req, res) => {
  try {
    const { badgeText, sectionTitle, highlightText, sectionDescription, testimonialTitle, review, companyName, order, isActive } = req.body;
    const reviewText = review?.toString().trim() || "";

    if (!reviewText) {
      return res.status(400).json({ success: false, message: "Review is required" });
    }

    const testimonial = await Testimonial.create({
      badgeText: badgeText || "Testimonials",
      sectionTitle: sectionTitle || "What They Are Saying",
      highlightText: highlightText || "Saying",
      sectionDescription: sectionDescription || "Discover the stories and experiences of individuals and companies who have found success and excellence through E2E HRC.",
      testimonialTitle: testimonialTitle || "",
      review: reviewText,
      companyName: companyName || "",
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({ success: true, message: "Testimonial created successfully", data: testimonial });
  } catch (error) {
    console.error("Error in createTestimonial:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, message: "Testimonials fetched successfully", data: testimonials });
  } catch (error) {
    console.error("Error in getTestimonials:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAdminTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, message: "Admin testimonials fetched successfully", data: testimonials });
  } catch (error) {
    console.error("Error in getAdminTestimonials:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }
    res.status(200).json({ success: true, message: "Testimonial fetched successfully", data: testimonial });
  } catch (error) {
    console.error("Error in getTestimonialById:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const { badgeText, sectionTitle, highlightText, sectionDescription, testimonialTitle, review, companyName, order, isActive } = req.body;

    const updateData = { badgeText, sectionTitle, highlightText, sectionDescription, testimonialTitle, review, companyName, order, isActive };
    Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

    if (updateData.review !== undefined) {
      const reviewText = updateData.review?.toString().trim() || "";
      if (!reviewText) {
        return res.status(400).json({ success: false, message: "Review is required" });
      }
      updateData.review = reviewText;
    }

    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    res.status(200).json({ success: true, message: "Testimonial updated successfully", data: testimonial });
  } catch (error) {
    console.error("Error in updateTestimonial:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }
    res.status(200).json({ success: true, message: "Testimonial deleted successfully", data: null });
  } catch (error) {
    console.error("Error in deleteTestimonial:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createTestimonial,
  getTestimonials,
  getAdminTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
};
