const mongoose = require('mongoose');
const WorkforceSolutionHero = require('../../model/WorkforceSolution/workforceSolutionHero.model');
const WorkforcecardSolution = require("../../model/WorkforceSolution/workforceSolutions.model");
const WorkforceSolutionSection = require("../../model/WorkforceSolution/workforceSolutionSection.model");
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

const parseStats = (stats) => {
    if (typeof stats === 'string') {
        try {
            const parsed = JSON.parse(stats);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    return Array.isArray(stats) ? stats : [];
};

const normalizeStats = (stats = []) => {
    const normalized = (stats || []).map((item, index) => ({
        value: item?.value || '',
        label: item?.label || '',
        order: Number(item?.order) || index,
    }));

    return normalized.sort((a, b) => (a.order || 0) - (b.order || 0));
};

const normalizeHeroRecord = (hero) => {
    if (!hero) return hero;

    const plainHero = hero.toObject ? hero.toObject() : { ...hero };

    return {
        ...plainHero,
        stats: normalizeStats(plainHero.stats || []),
    };
};

const deactivateOtherActiveRecords = async (excludeId = null) => {
    const filter = { isActive: true };
    if (excludeId) {
        filter._id = { $ne: excludeId };
    }

    await WorkforceSolutionHero.updateMany(filter, { isActive: false });
};

const createWorkforceSolutionHero = async (req, res) => {
    try {
        const { badgeText, titleLine1, highlightedTitle, description, isActive, stats } = req.body;

        if (!badgeText || !titleLine1 || !highlightedTitle || !description) {
            return res.status(400).json({ success: false, message: 'badgeText, titleLine1, highlightedTitle, and description are required.' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'heroImage is required.' });
        }

        const parsedStats = parseStats(stats);
        const normalizedStats = normalizeStats(parsedStats);

        if (normalizedStats.some((item) => !item.value || !item.label)) {
            return res.status(400).json({ success: false, message: 'Each stat must include value and label.' });
        }

        const uploadFile = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-workforce-solution');

        const heroData = {
            badgeText,
            titleLine1,
            highlightedTitle,
            description,
            heroImage: uploadFile.url,
            stats: normalizedStats,
            isActive: normalizeBoolean(isActive),
        };

        if (heroData.isActive) {
            await deactivateOtherActiveRecords();
        }

        const createdHero = await WorkforceSolutionHero.create(heroData);

        return res.status(201).json({
            success: true,
            message: 'Workforce Solution hero created successfully.',
            data: normalizeHeroRecord(createdHero),
        });
    } catch (error) {
        console.error('Error creating workforce solution hero:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

const getPublicWorkforceSolutionHero = async (req, res) => {
    try {
        const hero = await WorkforceSolutionHero.findOne({ isActive: true }).sort({ createdAt: -1 }).lean();

        if (!hero) {
            return res.status(404).json({ success: false, message: 'No active workforce solution hero found.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Workforce Solution hero fetched successfully.',
            data: normalizeHeroRecord(hero),
        });
    } catch (error) {
        console.error('Error fetching public workforce solution hero:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

const getAdminWorkforceSolutionHero = async (req, res) => {
    try {
        const heroes = await WorkforceSolutionHero.find().sort({ createdAt: -1 }).lean();

        return res.status(200).json({
            success: true,
            message: 'Workforce Solution heroes fetched successfully.',
            data: heroes.map((hero) => normalizeHeroRecord(hero)),
        });
    } catch (error) {
        console.error('Error fetching admin workforce solution heroes:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

const updateWorkforceSolutionHero = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid workforce solution hero ID.' });
        }

        const updateData = {};
        const { badgeText, titleLine1, highlightedTitle, description, isActive, stats } = req.body;

        if (badgeText !== undefined) updateData.badgeText = badgeText;
        if (titleLine1 !== undefined) updateData.titleLine1 = titleLine1;
        if (highlightedTitle !== undefined) updateData.highlightedTitle = highlightedTitle;
        if (description !== undefined) updateData.description = description;
        if (stats !== undefined) {
            const parsedStats = parseStats(stats);
            const normalizedStats = normalizeStats(parsedStats);

            if (normalizedStats.some((item) => !item.value || !item.label)) {
                return res.status(400).json({ success: false, message: 'Each stat must include value and label.' });
            }

            updateData.stats = normalizedStats;
        }

        if (isActive !== undefined) {
            updateData.isActive = normalizeBoolean(isActive);
        }

        if (updateData.isActive === true) {
            await deactivateOtherActiveRecords(id);
        }

        const updatedHero = await WorkforceSolutionHero.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedHero) {
            return res.status(404).json({ success: false, message: 'Workforce Solution hero not found.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Workforce Solution hero updated successfully.',
            data: normalizeHeroRecord(updatedHero),
        });
    } catch (error) {
        console.error('Error updating workforce solution hero:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

const updateWorkforceSolutionHeroImage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid workforce solution hero ID.' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'heroImage is required.' });
        }

        const hero = await WorkforceSolutionHero.findById(id);

        if (!hero) {
            return res.status(404).json({ success: false, message: 'Workforce Solution hero not found.' });
        }

        const uploadFile = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-workforce-solution');
        hero.heroImage = uploadFile.url;
        await hero.save();

        return res.status(200).json({
            success: true,
            message: 'Workforce Solution hero image updated successfully.',
            data: normalizeHeroRecord(hero),
        });
    } catch (error) {
        console.error('Error updating workforce solution hero image:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

const deleteWorkforceSolutionHero = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid workforce solution hero ID.' });
        }

        const deletedHero = await WorkforceSolutionHero.findByIdAndDelete(id);

        if (!deletedHero) {
            return res.status(404).json({ success: false, message: 'Workforce Solution hero not found.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Workforce Solution hero deleted successfully.',
            data: null,
        });
    } catch (error) {
        console.error('Error deleting workforce solution hero:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};


// ─── Workforce Solution Section ───────────────────────────────────────────────

const deactivateOtherActiveSections = async (excludeId = null) => {
    const filter = { isActive: true };
    if (excludeId) filter._id = { $ne: excludeId };
    await WorkforceSolutionSection.updateMany(filter, { isActive: false });
};

const createWorkforceSolutionSection = async (req, res) => {
    try {
        const { badgeText, titleLine1, highlightedTitle, description, isActive } = req.body;

        const normalizedTitleLine1 = typeof titleLine1 === 'string' ? titleLine1.trim() : '';
        const normalizedHighlightedTitle = typeof highlightedTitle === 'string' ? highlightedTitle.trim() : '';
        const normalizedDescription = typeof description === 'string' ? description.trim() : '';

        if (!normalizedTitleLine1 || !normalizedHighlightedTitle || !normalizedDescription) {
            return res.status(400).json({ success: false, message: 'titleLine1, highlightedTitle, and description are required.', data: null });
        }

        const activeValue = isActive !== undefined ? normalizeBoolean(isActive) : true;
        if (activeValue) await deactivateOtherActiveSections();

        const created = await WorkforceSolutionSection.create({
            badgeText: typeof badgeText === 'string' && badgeText.trim() ? badgeText.trim() : 'WHAT WE OFFER',
            titleLine1: normalizedTitleLine1,
            highlightedTitle: normalizedHighlightedTitle,
            description: normalizedDescription,
            isActive: activeValue,
        });

        return res.status(201).json({
            success: true,
            message: 'Workforce solution section created successfully.',
            data: created,
        });
    } catch (error) {
        console.error('Error creating workforce solution section:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.', data: null });
    }
};

const getAdminWorkforceSolutionSections = async (req, res) => {
    try {
        const sections = await WorkforceSolutionSection.find().sort({ createdAt: -1 }).lean();
        return res.status(200).json({
            success: true,
            message: 'Workforce solution sections fetched successfully.',
            data: sections,
        });
    } catch (error) {
        console.error('Error fetching workforce solution sections:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.', data: null });
    }
};

const updateWorkforceSolutionSection = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid section ID.', data: null });
        }

        const updateData = {};
        const { badgeText, titleLine1, highlightedTitle, description, isActive } = req.body;

        if (badgeText !== undefined) {
            updateData.badgeText = typeof badgeText === 'string' && badgeText.trim() ? badgeText.trim() : 'WHAT WE OFFER';
        }
        if (titleLine1 !== undefined) {
            updateData.titleLine1 = typeof titleLine1 === 'string' ? titleLine1.trim() : '';
        }
        if (highlightedTitle !== undefined) {
            updateData.highlightedTitle = typeof highlightedTitle === 'string' ? highlightedTitle.trim() : '';
        }
        if (description !== undefined) {
            updateData.description = typeof description === 'string' ? description.trim() : '';
        }
        if (isActive !== undefined) {
            updateData.isActive = normalizeBoolean(isActive);
        }

        if (updateData.isActive === true) await deactivateOtherActiveSections(id);

        const updated = await WorkforceSolutionSection.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Workforce solution section not found.', data: null });
        }

        return res.status(200).json({
            success: true,
            message: 'Workforce solution section updated successfully.',
            data: updated,
        });
    } catch (error) {
        console.error('Error updating workforce solution section:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.', data: null });
    }
};

const deleteWorkforceSolutionSection = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid section ID.', data: null });
        }

        const deleted = await WorkforceSolutionSection.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Workforce solution section not found.', data: null });
        }

        return res.status(200).json({
            success: true,
            message: 'Workforce solution section deleted successfully.',
            data: null,
        });
    } catch (error) {
        console.error('Error deleting workforce solution section:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.', data: null });
    }
};


// ─── Workforce Solution Cards ─────────────────────────────────────────────────

const createWorkforceSolution = async (req, res) => {
    try {
        const { cardTitle, cardDescription, order, isActive } = req.body;

        const normalizedCardTitle = typeof cardTitle === 'string' ? cardTitle.trim() : '';
        const normalizedCardDescription = typeof cardDescription === 'string' ? cardDescription.trim() : '';

        if (!normalizedCardTitle || !normalizedCardDescription) {
            return res.status(400).json({
                success: false,
                message: 'cardTitle and cardDescription are required.',
                data: null,
            });
        }

        const createdCard = await WorkforcecardSolution.create({
            cardTitle: normalizedCardTitle,
            cardDescription: normalizedCardDescription,
            order: Number.isFinite(Number(order)) ? Number(order) : 0,
            isActive: isActive !== undefined ? normalizeBoolean(isActive) : true,
        });

        return res.status(201).json({
            success: true,
            message: 'Workforce solution card created successfully.',
            data: createdCard,
        });
    } catch (error) {
        console.error('Error creating workforce solution card:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.', data: null });
    }
};

const getPublicWorkforceSolutions = async (req, res) => {
    try {
        const [section, cards] = await Promise.all([
            WorkforceSolutionSection.findOne({ isActive: true }).sort({ createdAt: -1 }).lean(),
            WorkforcecardSolution.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean(),
        ]);

        return res.status(200).json({
            success: true,
            message: 'Workforce solutions fetched successfully.',
            data: { section: section || null, cards },
        });
    } catch (error) {
        console.error('Error fetching public workforce solutions:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.', data: null });
    }
};

const getAdminWorkforceSolutions = async (req, res) => {
    try {
        const cards = await WorkforcecardSolution.find().sort({ order: 1, createdAt: 1 }).lean();
        return res.status(200).json({
            success: true,
            message: 'Workforce solution cards fetched successfully.',
            data: cards,
        });
    } catch (error) {
        console.error('Error fetching admin workforce solutions:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.', data: null });
    }
};

const updateWorkforceSolution = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid workforce solution ID.', data: null });
        }

        const updateData = {};
        const { cardTitle, cardDescription, order, isActive } = req.body;

        if (cardTitle !== undefined) updateData.cardTitle = typeof cardTitle === 'string' ? cardTitle.trim() : '';
        if (cardDescription !== undefined) updateData.cardDescription = typeof cardDescription === 'string' ? cardDescription.trim() : '';
        if (order !== undefined) updateData.order = Number.isFinite(Number(order)) ? Number(order) : 0;
        if (isActive !== undefined) updateData.isActive = normalizeBoolean(isActive);

        const updatedCard = await WorkforcecardSolution.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedCard) {
            return res.status(404).json({ success: false, message: 'Workforce solution card not found.', data: null });
        }

        return res.status(200).json({
            success: true,
            message: 'Workforce solution card updated successfully.',
            data: updatedCard,
        });
    } catch (error) {
        console.error('Error updating workforce solution card:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.', data: null });
    }
};

const deleteWorkforceSolution = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid workforce solution ID.', data: null });
        }

        const deletedCard = await WorkforcecardSolution.findByIdAndDelete(id);
        if (!deletedCard) {
            return res.status(404).json({ success: false, message: 'Workforce solution card not found.', data: null });
        }

        return res.status(200).json({
            success: true,
            message: 'Workforce solution card deleted successfully.',
            data: null,
        });
    } catch (error) {
        console.error('Error deleting workforce solution card:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.', data: null });
    }
};




module.exports = {
    // Hero
    createWorkforceSolutionHero,
    getPublicWorkforceSolutionHero,
    getAdminWorkforceSolutionHero,
    updateWorkforceSolutionHero,
    updateWorkforceSolutionHeroImage,
    deleteWorkforceSolutionHero,
    // Section
    createWorkforceSolutionSection,
    getAdminWorkforceSolutionSections,
    updateWorkforceSolutionSection,
    deleteWorkforceSolutionSection,
    // Cards
    createWorkforceSolution,
    getPublicWorkforceSolutions,
    getAdminWorkforceSolutions,
    updateWorkforceSolution,
    deleteWorkforceSolution,
};
