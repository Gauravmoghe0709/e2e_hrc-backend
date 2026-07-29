const TestimonialSection = require('../../model/About models/TestimonialSection');

exports.getSection = async (req, res) => {
  try {
    let section = await TestimonialSection.findOne();
    if (!section) {
      // Return default structure if nothing exists
      section = {
        badgeText: 'Testimonials',
        sectionTitle: 'What They Are Saying',
        sectionDescription: 'Discover the stories and experiences of our satisfied clients and candidates.',
        isActive: true
      };
    }
    res.status(200).json({ success: true, data: section });
  } catch (error) {
    console.error("Error in getSection:", error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.upsertSection = async (req, res) => {
  try {
    const { badgeText, sectionTitle, sectionDescription, isActive } = req.body;
    let section = await TestimonialSection.findOne();

    if (section) {
      section.badgeText = badgeText || section.badgeText;
      section.sectionTitle = sectionTitle || section.sectionTitle;
      section.sectionDescription = sectionDescription || section.sectionDescription;
      if (isActive !== undefined) section.isActive = isActive;
      await section.save();
    } else {
      section = await TestimonialSection.create({
        badgeText,
        sectionTitle,
        sectionDescription,
        isActive
      });
    }
    res.status(200).json({ success: true, message: 'Section updated successfully', data: section });
  } catch (error) {
    console.error("Error in upsertSection:", error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const section = await TestimonialSection.findOne();
    if (section) {
      await TestimonialSection.findByIdAndDelete(section._id);
    }
    res.status(200).json({ success: true, message: 'Section deleted successfully' });
  } catch (error) {
    console.error("Error in deleteSection:", error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
