const EmployeeJourneySection = require("../../model/Employee models/EmployeeJourneySection.model");
const EmployeeJourneyCard = require("../../model/Employee models/EmployeeJourneyCard.model");

// GET /employee-journey
exports.getPublicEmployeeJourney = async (req, res) => {
  try {
    const activeSection = await EmployeeJourneySection.findOne({ isActive: true });
    
    if (!activeSection) {
      return res.status(200).json({
        success: true,
        data: {
          section: null,
          cards: []
        }
      });
    }

    const activeCards = await EmployeeJourneyCard.find({ isActive: true }).sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      data: {
        section: activeSection,
        cards: activeCards
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
