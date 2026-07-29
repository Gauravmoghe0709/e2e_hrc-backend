const JourneySection = require("../../model/About models/JourneySection.model");
const JourneyTimelineCard = require("../../model/About models/JourneyTimelineCard.model");

// -------------------------------------------------------------
// PUBLIC: GET /api/journey
// Returns the active section + active cards (sorted by order ASC)
// -------------------------------------------------------------
const getPublicJourney = async (req, res) => {
  try {
    const section = await JourneySection.findOne({ isActive: true });
    const cards = await JourneyTimelineCard.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({ success: true, section: section || null, cards });
  } catch (error) {
    console.error("Error in getPublicJourney:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// -------------------------------------------------------------
// ADMIN: Journey Section CRUD
// -------------------------------------------------------------

// POST /api/admin/journey-section  (creates or updates — only one doc allowed)
const createOrUpdateJourneySection = async (req, res) => {
  try {
    const {
      badgeText, badgeSubText, sectionTitle, sectionDescription,
      introText, statYears, statCountries, statMilestones,
      statYearsLabel, statCountriesLabel, statMilestonesLabel, isActive,
    } = req.body;

    if (!sectionTitle?.toString().trim()) {
      return res.status(400).json({ success: false, message: "Section title is required" });
    }

    const existing = await JourneySection.findOne();

    const payload = {
      badgeText: badgeText || "",
      badgeSubText: badgeSubText || "",
      sectionTitle: sectionTitle.toString().trim(),
      sectionDescription: sectionDescription || "",
      introText: introText || "",
      statYears: statYears !== undefined ? Number(statYears) : 0,
      statCountries: statCountries !== undefined ? Number(statCountries) : 0,
      statMilestones: statMilestones !== undefined ? Number(statMilestones) : 0,
      statYearsLabel: statYearsLabel || "Years",
      statCountriesLabel: statCountriesLabel || "Countries",
      statMilestonesLabel: statMilestonesLabel || "Milestones",
      isActive: isActive !== undefined ? isActive : true,
    };

    let section;
    if (existing) {
      section = await JourneySection.findByIdAndUpdate(existing._id, payload, { new: true, runValidators: true });
      return res.status(200).json({ success: true, message: "Journey section updated successfully", data: section });
    } else {
      section = await JourneySection.create(payload);
      return res.status(201).json({ success: true, message: "Journey section created successfully", data: section });
    }
  } catch (error) {
    console.error("Error in createOrUpdateJourneySection:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/admin/journey-section
const getAdminJourneySection = async (req, res) => {
  try {
    const section = await JourneySection.findOne();
    res.status(200).json({ success: true, data: section || null });
  } catch (error) {
    console.error("Error in getAdminJourneySection:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PUT /api/admin/journey-section/:id
const updateJourneySection = async (req, res) => {
  try {
    const {
      badgeText, badgeSubText, sectionTitle, sectionDescription,
      introText, statYears, statCountries, statMilestones,
      statYearsLabel, statCountriesLabel, statMilestonesLabel, isActive,
    } = req.body;

    if (sectionTitle !== undefined && !sectionTitle?.toString().trim()) {
      return res.status(400).json({ success: false, message: "Section title cannot be empty" });
    }

    const updateData = {};
    if (badgeText !== undefined) updateData.badgeText = badgeText;
    if (badgeSubText !== undefined) updateData.badgeSubText = badgeSubText;
    if (sectionTitle !== undefined) updateData.sectionTitle = sectionTitle.toString().trim();
    if (sectionDescription !== undefined) updateData.sectionDescription = sectionDescription;
    if (introText !== undefined) updateData.introText = introText;
    if (statYears !== undefined) updateData.statYears = Number(statYears);
    if (statCountries !== undefined) updateData.statCountries = Number(statCountries);
    if (statMilestones !== undefined) updateData.statMilestones = Number(statMilestones);
    if (statYearsLabel !== undefined) updateData.statYearsLabel = statYearsLabel;
    if (statCountriesLabel !== undefined) updateData.statCountriesLabel = statCountriesLabel;
    if (statMilestonesLabel !== undefined) updateData.statMilestonesLabel = statMilestonesLabel;
    if (isActive !== undefined) updateData.isActive = isActive;

    const section = await JourneySection.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!section) {
      return res.status(404).json({ success: false, message: "Journey section not found" });
    }
    res.status(200).json({ success: true, message: "Journey section updated successfully", data: section });
  } catch (error) {
    console.error("Error in updateJourneySection:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE /api/admin/journey-section/:id
const deleteJourneySection = async (req, res) => {
  try {
    const section = await JourneySection.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: "Journey section not found" });
    }
    res.status(200).json({ success: true, message: "Journey section deleted successfully", data: null });
  } catch (error) {
    console.error("Error in deleteJourneySection:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// -------------------------------------------------------------
// ADMIN: Journey Timeline Cards CRUD
// -------------------------------------------------------------

// POST /api/admin/journey-cards
const createJourneyCard = async (req, res) => {
  try {
    const { title, description, year, side, order, isActive } = req.body;

    if (!title?.toString().trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    if (!year?.toString().trim()) {
      return res.status(400).json({ success: false, message: "Year is required" });
    }
    if (side && !["left", "right"].includes(side)) {
      return res.status(400).json({ success: false, message: "Side must be either left or right" });
    }

    const totalCards = await JourneyTimelineCard.countDocuments();
    if (totalCards >= 12) {
      return res.status(400).json({ success: false, message: "Maximum 12 timeline cards are allowed." });
    }

    const card = await JourneyTimelineCard.create({
      title: title.toString().trim(),
      description: description || "",
      year: year.toString().trim(),
      side: side || "left",
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({ success: true, message: "Timeline card created successfully", data: card });
  } catch (error) {
    console.error("Error in createJourneyCard:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/admin/journey-cards
const getAdminJourneyCards = async (req, res) => {
  try {
    const cards = await JourneyTimelineCard.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: cards });
  } catch (error) {
    console.error("Error in getAdminJourneyCards:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/admin/journey-cards/:id
const getJourneyCardById = async (req, res) => {
  try {
    const card = await JourneyTimelineCard.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ success: false, message: "Timeline card not found" });
    }
    res.status(200).json({ success: true, data: card });
  } catch (error) {
    console.error("Error in getJourneyCardById:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PUT /api/admin/journey-cards/:id
const updateJourneyCard = async (req, res) => {
  try {
    const { title, description, year, side, order, isActive } = req.body;

    if (title !== undefined && !title?.toString().trim()) {
      return res.status(400).json({ success: false, message: "Title cannot be empty" });
    }
    if (year !== undefined && !year?.toString().trim()) {
      return res.status(400).json({ success: false, message: "Year cannot be empty" });
    }
    if (side !== undefined && !["left", "right"].includes(side)) {
      return res.status(400).json({ success: false, message: "Side must be either left or right" });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.toString().trim();
    if (description !== undefined) updateData.description = description;
    if (year !== undefined) updateData.year = year.toString().trim();
    if (side !== undefined) updateData.side = side;
    if (order !== undefined) updateData.order = Number(order);
    if (isActive !== undefined) updateData.isActive = isActive;

    const card = await JourneyTimelineCard.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!card) {
      return res.status(404).json({ success: false, message: "Timeline card not found" });
    }
    res.status(200).json({ success: true, message: "Timeline card updated successfully", data: card });
  } catch (error) {
    console.error("Error in updateJourneyCard:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE /api/admin/journey-cards/:id
const deleteJourneyCard = async (req, res) => {
  try {
    const card = await JourneyTimelineCard.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ success: false, message: "Timeline card not found" });
    }
    res.status(200).json({ success: true, message: "Timeline card deleted successfully", data: null });
  } catch (error) {
    console.error("Error in deleteJourneyCard:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getPublicJourney,
  createOrUpdateJourneySection,
  getAdminJourneySection,
  updateJourneySection,
  deleteJourneySection,
  createJourneyCard,
  getAdminJourneyCards,
  getJourneyCardById,
  updateJourneyCard,
  deleteJourneyCard,
};
