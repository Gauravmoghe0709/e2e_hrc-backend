const TestimonialSection = require("../../model/WorkforceSolution/TestimonialSection");
const TestimonialCard = require("../../model/WorkforceSolution/TestimonialCard");

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /testimonials
 * Returns active section header and active testimonial cards
 */
exports.getPublicTestimonials = async (req, res) => {
  try {
    // Get active section
    const section = await TestimonialSection.findOne({ isActive: true }).lean();
    
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Active testimonial section not found"
      });
    }

    // Get active cards, sorted by order
    const cards = await TestimonialCard.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: {
        section: {
          badgeText: section.badgeText,
          sectionTitle: section.sectionTitle,
          isActive: section.isActive
        },
        cards
      }
    });
  } catch (error) {
    console.error("Error in getPublicTestimonials:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN SECTION APIS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * POST /admin/testimonial-section
 * Create a new testimonial section
 */
exports.createTestimonialSection = async (req, res) => {
  try {
    const { badgeText, sectionTitle, isActive } = req.body;

    // Validate required fields
    if (!sectionTitle || !sectionTitle.trim()) {
      return res.status(400).json({
        success: false,
        message: "Section title is required"
      });
    }

    // If isActive is true, deactivate previous active sections
    if (isActive) {
      await TestimonialSection.updateMany({}, { isActive: false });
    }

    const newSection = await TestimonialSection.create({
      badgeText: badgeText || "WHAT OUR CLIENTS SAY",
      sectionTitle: sectionTitle.trim(),
      isActive: isActive !== false
    });

    res.status(201).json({
      success: true,
      message: "Testimonial section created successfully",
      data: newSection
    });
  } catch (error) {
    console.error("Error creating testimonial section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * GET /admin/testimonial-section
 * Get all testimonial sections
 */
exports.getAdminTestimonialSections = async (req, res) => {
  try {
    const sections = await TestimonialSection.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: sections
    });
  } catch (error) {
    console.error("Error fetching testimonial sections:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * PUT /admin/testimonial-section/:id
 * Update a testimonial section
 */
exports.updateTestimonialSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { badgeText, sectionTitle, isActive } = req.body;

    // Validate required fields
    if (sectionTitle && !sectionTitle.trim()) {
      return res.status(400).json({
        success: false,
        message: "Section title cannot be empty"
      });
    }

    // If isActive is true, deactivate other sections
    if (isActive) {
      await TestimonialSection.updateMany(
        { _id: { $ne: id } },
        { isActive: false }
      );
    }

    const updateData = {};
    if (badgeText !== undefined) updateData.badgeText = badgeText.trim();
    if (sectionTitle !== undefined) updateData.sectionTitle = sectionTitle.trim();
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedSection = await TestimonialSection.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Testimonial section not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial section updated successfully",
      data: updatedSection
    });
  } catch (error) {
    console.error("Error updating testimonial section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * DELETE /admin/testimonial-section/:id
 * Delete a testimonial section
 */
exports.deleteTestimonialSection = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSection = await TestimonialSection.findByIdAndDelete(id);

    if (!deletedSection) {
      return res.status(404).json({
        success: false,
        message: "Testimonial section not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial section deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting testimonial section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN CARD APIS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * POST /admin/testimonial-cards
 * Create a new testimonial card
 */
exports.createTestimonialCard = async (req, res) => {
  try {
    const {
      companyName,
      companyCategory,
      reviewText,
      reviewerName,
      reviewerDesignation,
      reviewerCompany,
      order,
      isActive
    } = req.body;

    // Validate required fields
    if (!companyName || !companyName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name is required"
      });
    }
    if (!reviewText || !reviewText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Review text is required"
      });
    }
    if (!reviewerName || !reviewerName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reviewer name is required"
      });
    }
    if (!reviewerDesignation || !reviewerDesignation.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reviewer designation is required"
      });
    }

    const newCard = await TestimonialCard.create({
      companyName: companyName.trim(),
      companyCategory: companyCategory ? companyCategory.trim() : "",
      reviewText: reviewText.trim(),
      reviewerName: reviewerName.trim(),
      reviewerDesignation: reviewerDesignation.trim(),
      reviewerCompany: reviewerCompany ? reviewerCompany.trim() : "",
      order: order ?? 0,
      isActive: isActive !== false
    });

    res.status(201).json({
      success: true,
      message: "Testimonial card created successfully",
      data: newCard
    });
  } catch (error) {
    console.error("Error creating testimonial card:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * GET /admin/testimonial-cards
 * Get all testimonial cards
 */
exports.getAdminTestimonialCards = async (req, res) => {
  try {
    const cards = await TestimonialCard.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: cards
    });
  } catch (error) {
    console.error("Error fetching testimonial cards:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * PUT /admin/testimonial-cards/:id
 * Update a testimonial card
 */
exports.updateTestimonialCard = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      companyName,
      companyCategory,
      reviewText,
      reviewerName,
      reviewerDesignation,
      reviewerCompany,
      order,
      isActive
    } = req.body;

    // Validate required fields if provided
    if (companyName !== undefined && !companyName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name cannot be empty"
      });
    }
    if (reviewText !== undefined && !reviewText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Review text cannot be empty"
      });
    }
    if (reviewerName !== undefined && !reviewerName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reviewer name cannot be empty"
      });
    }
    if (reviewerDesignation !== undefined && !reviewerDesignation.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reviewer designation cannot be empty"
      });
    }

    const updateData = {};
    if (companyName !== undefined) updateData.companyName = companyName.trim();
    if (companyCategory !== undefined) updateData.companyCategory = companyCategory.trim();
    if (reviewText !== undefined) updateData.reviewText = reviewText.trim();
    if (reviewerName !== undefined) updateData.reviewerName = reviewerName.trim();
    if (reviewerDesignation !== undefined) updateData.reviewerDesignation = reviewerDesignation.trim();
    if (reviewerCompany !== undefined) updateData.reviewerCompany = reviewerCompany.trim();
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedCard = await TestimonialCard.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCard) {
      return res.status(404).json({
        success: false,
        message: "Testimonial card not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial card updated successfully",
      data: updatedCard
    });
  } catch (error) {
    console.error("Error updating testimonial card:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * DELETE /admin/testimonial-cards/:id
 * Delete a testimonial card
 */
exports.deleteTestimonialCard = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCard = await TestimonialCard.findByIdAndDelete(id);

    if (!deletedCard) {
      return res.status(404).json({
        success: false,
        message: "Testimonial card not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial card deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting testimonial card:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
