const EmployeeTestimonialSection = require('../../model/Employee models/EmployeeTestimonialSection');
const EmployeeTestimonialCard = require('../../model/Employee models/EmployeeTestimonialCard');
const uploadImage = require('../../services/storage.services');

const normalizeBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  }
  return true;
};

// ============================================================
// PUBLIC API
// ============================================================

async function getPublicEmployeeTestimonials(req, res) {
  try {
    const section = await EmployeeTestimonialSection.findOne({ isActive: true }).lean();
    const cards = await EmployeeTestimonialCard.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    res.status(200).json({
      success: true,
      message: 'Employee testimonials fetched successfully.',
      data: {
        section: section || null,
        cards: cards || [],
      },
    });
  } catch (error) {
    console.error('Error fetching employee testimonials:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

// ============================================================
// ADMIN SECTION APIs
// ============================================================

async function createEmployeeTestimonialSection(req, res) {
  try {
    const { sectionTitle, badgeText, sectionDescription, isActive } = req.body;

    if (!sectionTitle || !sectionTitle.toString().trim()) {
      return res
        .status(400)
        .json({ success: false, message: 'Section title is required.' });
    }

   

    const section = await EmployeeTestimonialSection.create({
      sectionTitle: sectionTitle.toString().trim(),
      badgeText: badgeText !== undefined ? badgeText.toString().trim() : 'Testimonials',
      sectionDescription: sectionDescription !== undefined ? sectionDescription : '',
      isActive: isActive !== undefined ? normalizeBoolean(isActive) : true,
    });

    res.status(201).json({
      success: true,
      message: 'Employee testimonial section created successfully.',
      data: section,
    });
  } catch (error) {
    console.error('Error creating employee testimonial section:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

async function getAdminEmployeeTestimonialSections(req, res) {
  try {
    const sections = await EmployeeTestimonialSection.find()
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({
      success: true,
      message: 'Employee testimonial sections fetched successfully.',
      data: sections,
    });
  } catch (error) {
    console.error('Error fetching employee testimonial sections:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

async function updateEmployeeTestimonialSection(req, res) {
  try {
    const { id } = req.params;
    const { sectionTitle, badgeText, sectionDescription, isActive } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Employee testimonial section ID is required.',
      });
    }

    if (sectionTitle !== undefined && !sectionTitle.toString().trim()) {
      return res
        .status(400)
        .json({ success: false, message: 'Section title is required.' });
    }

    const updateData = {};
    if (sectionTitle !== undefined) updateData.sectionTitle = sectionTitle.toString().trim();
    if (badgeText !== undefined) updateData.badgeText = badgeText.toString().trim();
    if (sectionDescription !== undefined) updateData.sectionDescription = sectionDescription;
    if (isActive !== undefined) updateData.isActive = normalizeBoolean(isActive);

    const updatedSection = await EmployeeTestimonialSection.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: 'Employee testimonial section not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee testimonial section updated successfully.',
      data: updatedSection,
    });
  } catch (error) {
    console.error('Error updating employee testimonial section:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

async function deleteEmployeeTestimonialSection(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Employee testimonial section ID is required.',
      });
    }

    const deletedSection = await EmployeeTestimonialSection.findByIdAndDelete(id);

    if (!deletedSection) {
      return res.status(404).json({
        success: false,
        message: 'Employee testimonial section not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee testimonial section deleted successfully.',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting employee testimonial section:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}


// ============================================================
// ADMIN CARD APIs
// ============================================================

async function createEmployeeTestimonialCard(req, res) {
  try {
    const { title, reviewText, companyName, reviewerName, reviewerDesignation, order, isActive } =
      req.body;

    if (!title || !title.toString().trim()) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }
    if (!reviewText || !reviewText.toString().trim()) {
      return res.status(400).json({ success: false, message: 'Review text is required.' });
    }

    // Check maximum 6 cards limit
    const totalCards = await EmployeeTestimonialCard.countDocuments();
    if (totalCards >= 6) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 6 testimonial cards are allowed.',
      });
    }

    let companyLogo = '';
    if (req.file) {
      const uploadfile = await uploadImage(
        req.file.buffer,
        req.file.originalname,
        'e2e-employee-testimonials'
      );
      companyLogo = uploadfile.url;
    }

    const card = await EmployeeTestimonialCard.create({
      title: title.toString().trim(),
      reviewText: reviewText.toString().trim(),
      companyName: companyName !== undefined ? companyName.toString().trim() : '',
      reviewerName: reviewerName !== undefined ? reviewerName.toString().trim() : '',
      reviewerDesignation: reviewerDesignation !== undefined ? reviewerDesignation.toString().trim() : '',
      companyLogo,
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? normalizeBoolean(isActive) : true,
    });

    res.status(201).json({
      success: true,
      message: 'Employee testimonial card created successfully.',
      data: card,
    });
  } catch (error) {
    console.error('Error creating employee testimonial card:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

async function getAdminEmployeeTestimonialCards(req, res) {
  try {
    const cards = await EmployeeTestimonialCard.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    res.status(200).json({
      success: true,
      message: 'Employee testimonial cards fetched successfully.',
      data: cards,
    });
  } catch (error) {
    console.error('Error fetching employee testimonial cards:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

async function getAdminEmployeeTestimonialCardById(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: 'Employee testimonial card ID is required.' });
    }

    const card = await EmployeeTestimonialCard.findById(id).lean();

    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: 'Employee testimonial card not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Employee testimonial card fetched successfully.',
      data: card,
    });
  } catch (error) {
    console.error('Error fetching employee testimonial card:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

async function updateEmployeeTestimonialCard(req, res) {
  try {
    const { id } = req.params;
    const { title, reviewText, companyName, reviewerName, reviewerDesignation, order, isActive } =
      req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Employee testimonial card ID is required.',
      });
    }

    if (title !== undefined && !title.toString().trim()) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }
    if (reviewText !== undefined && !reviewText.toString().trim()) {
      return res.status(400).json({ success: false, message: 'Review text is required.' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.toString().trim();
    if (reviewText !== undefined) updateData.reviewText = reviewText.toString().trim();
    if (companyName !== undefined) updateData.companyName = companyName.toString().trim();
    if (reviewerName !== undefined) updateData.reviewerName = reviewerName.toString().trim();
    if (reviewerDesignation !== undefined)
      updateData.reviewerDesignation = reviewerDesignation.toString().trim();
    if (order !== undefined) updateData.order = Number(order);
    if (isActive !== undefined) updateData.isActive = normalizeBoolean(isActive);

    const updatedCard = await EmployeeTestimonialCard.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedCard) {
      return res.status(404).json({
        success: false,
        message: 'Employee testimonial card not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee testimonial card updated successfully.',
      data: updatedCard,
    });
  } catch (error) {
    console.error('Error updating employee testimonial card:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

async function deleteEmployeeTestimonialCard(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Employee testimonial card ID is required.',
      });
    }

    const deletedCard = await EmployeeTestimonialCard.findByIdAndDelete(id);

    if (!deletedCard) {
      return res.status(404).json({
        success: false,
        message: 'Employee testimonial card not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee testimonial card deleted successfully.',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting employee testimonial card:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

async function updateEmployeeTestimonialCardLogo(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Employee testimonial card ID is required.',
      });
    }

    const card = await EmployeeTestimonialCard.findById(id);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Employee testimonial card not found.',
      });
    }

    if (req.file) {
      const uploadfile = await uploadImage(
        req.file.buffer,
        req.file.originalname,
        'e2e-employee-testimonials'
      );
      card.companyLogo = uploadfile.url;
      await card.save();
    }

    res.status(200).json({
      success: true,
      message: 'Company logo updated successfully.',
      data: card,
    });
  } catch (error) {
    console.error('Error updating company logo:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

module.exports = {
  getPublicEmployeeTestimonials,
  createEmployeeTestimonialSection,
  getAdminEmployeeTestimonialSections,
  updateEmployeeTestimonialSection,
  deleteEmployeeTestimonialSection,
  createEmployeeTestimonialCard,
  getAdminEmployeeTestimonialCards,
  getAdminEmployeeTestimonialCardById,
  updateEmployeeTestimonialCard,
  deleteEmployeeTestimonialCard,
  updateEmployeeTestimonialCardLogo,
};
