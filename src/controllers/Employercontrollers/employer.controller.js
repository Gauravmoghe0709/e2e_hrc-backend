const employerheromodel = require('../../model/Employer models/employerhero.model');
const HowWeWork = require('../../model/Employer models/HowWeWork.model');
const EmployerFAQ = require('../../model/Employer models/EmployerFAQ.model');
const EmployerCTA = require('../../model/Employer models/EmployerCTA.model');
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

const normalizeEmployerHeroResponse = (hero) => {
    if (!hero) return hero;

    const plainHero = hero.toObject ? hero.toObject() : { ...hero };
    const heroImageUrl = plainHero.heroImage || plainHero.image || plainHero.imageurl || '';

    return {
        ...plainHero,
        heroImage: heroImageUrl,
        image: heroImageUrl,
        imageurl: heroImageUrl,
    };
};

async function getEmployerHero(req, res) {
    try {
        const hero = await employerheromodel.findOne({ isActive: true }).sort({ createdAt: -1 });
        if (!hero) {
            return res.status(404).json({ success: false, message: "No active employer hero section found." });
        }
        res.status(200).json({ success: true, message: "Employer hero section fetched successfully.", data: normalizeEmployerHeroResponse(hero) });
    } catch (error) {
        console.error("Error fetching employer hero section:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function createEmployerHero(req, res) {
    try {
        const { title, subtitle, isActive } = req.body;

        let heroImage = '';
        if (req.file) {
            const uploadfile = await uploadImage(req.file.buffer, req.file.originalname, "e2e-about");
            heroImage = uploadfile.url;
        }

        const employerHero = await employerheromodel.create({
            title,
            subtitle: subtitle || '',
            heroImage,
            image: heroImage,
            imageurl: heroImage,
            isActive: normalizeBoolean(isActive),
        });

        res.status(201).json({ success: true, message: "Employer hero section created successfully.", data: normalizeEmployerHeroResponse(employerHero) });
    }
    catch (error) {
        console.error("Error creating employer hero section:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function updateEmployerHero(req, res) {
    const { id } = req.params;
    const { title, subtitle, isActive } = req.body;
    try {
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (subtitle !== undefined) updateData.subtitle = subtitle;
        if (isActive !== undefined) updateData.isActive = normalizeBoolean(isActive);

        if (req.file) {
            const uploadfile = await uploadImage(req.file.buffer, req.file.originalname, "e2e-about");
            updateData.heroImage = uploadfile.url;
            updateData.image = uploadfile.url;
            updateData.imageurl = uploadfile.url;
        }

        if (updateData.isActive === true) {
            await employerheromodel.updateMany({ isActive: true, _id: { $ne: id } }, { isActive: false });
        }

        const updatedHero = await employerheromodel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedHero) {
            return res.status(404).json({ success: false, message: "Employer hero section not found." });
        }

        res.status(200).json({ success: true, message: "Employer hero section updated successfully.", data: normalizeEmployerHeroResponse(updatedHero) });
    } catch (error) {
        console.error("Error updating employer hero section:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function uploadEmployerHeroImage(req, res) {
    try {
        const hero = await employerheromodel.findById(req.params.id);
        if (!hero) {
            return res.status(404).json({ success: false, message: "Employer hero section not found." });
        }
        if (req.file) {
            const uploadfile = await uploadImage(req.file.buffer, req.file.originalname, "e2e-about");
            hero.heroImage = uploadfile.url;
            hero.image = uploadfile.url;
            hero.imageurl = uploadfile.url;
            await hero.save();
        }
        res.status(200).json({ success: true, message: "Image uploaded successfully.", data: normalizeEmployerHeroResponse(hero) });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function deleteEmployerHero(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Employer hero ID is required." });
        }

        const deleted = await employerheromodel.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Employer hero not found." });
        }

        res.status(200).json({ success: true, message: "Employer hero deleted successfully.", data: null });
    } catch (error) {
        console.error("Error deleting employer hero:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}


async function createEmployerHowWeWorkStep(req, res) {
    try {
        const { title, description, order, isActive } = req.body;
        if (!title || !description) {
            return res.status(400).json({ success: false, message: "Title and description are required." });
        }
        const step = await HowWeWork.create({ title, description, order: Number(order) || 0, isActive: Boolean(isActive) });
        res.status(201).json({ success: true, message: "Step created successfully.", data: step });
    } catch (error) {
        console.error("Error creating How We Work step:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function getAdminHowWeWorkSteps(req, res) {
    try {
        const steps = await HowWeWork.find().sort({ order: 1 }).lean();
        res.status(200).json({ success: true, message: "Steps fetched successfully.", data: steps });
    } catch (error) {
        console.error("Error fetching How We Work steps:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function getEmployerHowWeWorkSteps(req, res) {
    try {
        const steps = await HowWeWork.find({ isActive: true }).sort({ order: 1 }).lean();
        res.status(200).json({ success: true, message: "Active steps fetched successfully.", data: steps });
    } catch (error) {
        console.error("Error fetching active How We Work steps:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function updateEmployerHowWeWorkStep(req, res) {
    try {
        const { id } = req.params;
        const updateData = {};
        if (req.body.title !== undefined) updateData.title = req.body.title;
        if (req.body.description !== undefined) updateData.description = req.body.description;
        if (req.body.order !== undefined) updateData.order = Number(req.body.order);
        if (req.body.isActive !== undefined) updateData.isActive = Boolean(req.body.isActive);

        const updatedStep = await HowWeWork.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedStep) {
            return res.status(404).json({ success: false, message: "Step not found." });
        }
        res.status(200).json({ success: true, message: "Step updated successfully.", data: updatedStep });
    } catch (error) {
        console.error("Error updating How We Work step:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function deleteEmployerHowWeWorkStep(req, res) {
    try {
        const { id } = req.params;
        const deletedStep = await HowWeWork.findByIdAndDelete(id);
        if (!deletedStep) {
            return res.status(404).json({ success: false, message: "Step not found." });
        }
        res.status(200).json({ success: true, message: "Step deleted successfully.", data: null });
    } catch (error) {
        console.error("Error deleting How We Work step:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function createEmployerFAQ(req, res) {
    try {
        const { question, answer, order, isActive } = req.body;

        if (!question || !question.toString().trim()) {
            return res.status(400).json({ success: false, message: "Question is required." });
        }
        if (!answer || !answer.toString().trim()) {
            return res.status(400).json({ success: false, message: "Answer is required." });
        }

        const faq = await EmployerFAQ.create({
            question: question.toString().trim(),
            answer,
            order: order !== undefined ? Number(order) : 0,
            isActive: isActive !== undefined ? Boolean(isActive) : true,
        });

        res.status(201).json({ success: true, message: "Employer FAQ item created successfully.", data: faq });
    } catch (error) {
        console.error("Error creating Employer FAQ item:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function getAdminEmployerFAQ(req, res) {
    try {
        const faqs = await EmployerFAQ.find().sort({ order: 1, createdAt: -1 }).lean();
        res.status(200).json({ success: true, message: "Employer FAQ items fetched successfully.", data: faqs });
    } catch (error) {
        console.error("Error fetching Employer FAQ items:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function getEmployerFAQ(req, res) {
    try {
        const faqs = await EmployerFAQ.find({ isActive: true }).sort({ order: 1 }).lean();
        res.status(200).json({ success: true, message: "Employer FAQ items fetched successfully.", data: faqs });
    } catch (error) {
        console.error("Error fetching Employer FAQ items:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function updateEmployerFAQ(req, res) {
    try {
        const { id } = req.params;
        const { question, answer, order, isActive } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "Employer FAQ item ID is required." });
        }

        if (question !== undefined && !question.toString().trim()) {
            return res.status(400).json({ success: false, message: "Question is required." });
        }
        if (answer !== undefined && !answer.toString().trim()) {
            return res.status(400).json({ success: false, message: "Answer is required." });
        }

        const updateData = {};
        if (question !== undefined) updateData.question = question.toString().trim();
        if (answer !== undefined) updateData.answer = answer;
        if (order !== undefined) updateData.order = Number(order);
        if (isActive !== undefined) updateData.isActive = Boolean(isActive);

        const updatedFaq = await EmployerFAQ.findByIdAndUpdate(id, updateData, { returnDocument: "after", runValidators: true });

        if (!updatedFaq) {
            return res.status(404).json({ success: false, message: "Employer FAQ item not found." });
        }

        res.status(200).json({ success: true, message: "Employer FAQ item updated successfully.", data: updatedFaq });
    } catch (error) {
        console.error("Error updating Employer FAQ item:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function deleteEmployerFAQ(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Employer FAQ item ID is required." });
        }

        const deletedFaq = await EmployerFAQ.findByIdAndDelete(id);

        if (!deletedFaq) {
            return res.status(404).json({ success: false, message: "Employer FAQ item not found." });
        }

        res.status(200).json({ success: true, message: "Employer FAQ item deleted successfully.", data: null });
    } catch (error) {
        console.error("Error deleting Employer FAQ item:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function createEmployerCTA(req, res) {
    try {
        const { ctaTitle, ctaDescription, buttonText, buttonLink, isActive } = req.body;

        if (!ctaTitle || !ctaTitle.toString().trim()) {
            return res.status(400).json({ success: false, message: "CTA title is required." });
        }
        if (!buttonText || !buttonText.toString().trim()) {
            return res.status(400).json({ success: false, message: "Button text is required." });
        }

        if (isActive === true) {
            await EmployerCTA.updateMany({ isActive: true }, { isActive: false });
        }

        const cta = await EmployerCTA.create({
            ctaTitle: ctaTitle.toString().trim(),
            ctaDescription: ctaDescription !== undefined ? ctaDescription : "",
            buttonText: buttonText.toString().trim(),
            buttonLink: buttonLink !== undefined ? buttonLink : "",
            isActive: isActive !== undefined ? Boolean(isActive) : true,
        });

        res.status(201).json({ success: true, message: "Employer CTA card created successfully.", data: cta });
    } catch (error) {
        console.error("Error creating Employer CTA card:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function getAdminEmployerCTA(req, res) {
    try {
        const ctas = await EmployerCTA.find().sort({ createdAt: -1 }).lean();
        res.status(200).json({ success: true, message: "Employer CTA cards fetched successfully.", data: ctas });
    } catch (error) {
        console.error("Error fetching Employer CTA cards:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function getEmployerCTA(req, res) {
    try {
        const cta = await EmployerCTA.findOne({ isActive: true }).lean();

        if (!cta) {
            return res.status(404).json({ success: false, message: "Active Employer CTA card not found." });
        }

        res.status(200).json({ success: true, message: "Employer CTA card fetched successfully.", data: cta });
    } catch (error) {
        console.error("Error fetching Employer CTA card:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function updateEmployerCTA(req, res) {
    try {
        const { id } = req.params;
        const { ctaTitle, ctaDescription, buttonText, buttonLink, isActive } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "Employer CTA card ID is required." });
        }

        if (ctaTitle !== undefined && !ctaTitle.toString().trim()) {
            return res.status(400).json({ success: false, message: "CTA title is required." });
        }
        if (buttonText !== undefined && !buttonText.toString().trim()) {
            return res.status(400).json({ success: false, message: "Button text is required." });
        }

        const updateData = {};
        if (ctaTitle !== undefined) updateData.ctaTitle = ctaTitle.toString().trim();
        if (ctaDescription !== undefined) updateData.ctaDescription = ctaDescription;
        if (buttonText !== undefined) updateData.buttonText = buttonText.toString().trim();
        if (buttonLink !== undefined) updateData.buttonLink = buttonLink;
        if (isActive !== undefined) updateData.isActive = Boolean(isActive);

        if (updateData.isActive === true) {
            await EmployerCTA.updateMany({ isActive: true, _id: { $ne: id } }, { isActive: false });
        }

        const updatedCta = await EmployerCTA.findByIdAndUpdate(id, updateData, { returnDocument: "after", runValidators: true });

        if (!updatedCta) {
            return res.status(404).json({ success: false, message: "Employer CTA card not found." });
        }

        res.status(200).json({ success: true, message: "Employer CTA card updated successfully.", data: updatedCta });
    } catch (error) {
        console.error("Error updating Employer CTA card:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function deleteEmployerCTA(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Employer CTA card ID is required." });
        }

        const deletedCta = await EmployerCTA.findByIdAndDelete(id);

        if (!deletedCta) {
            return res.status(404).json({ success: false, message: "Employer CTA card not found." });
        }

        res.status(200).json({ success: true, message: "Employer CTA card deleted successfully.", data: null });
    } catch (error) {
        console.error("Error deleting Employer CTA card:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

module.exports = {
    getEmployerHero,
    createEmployerHero,
    updateEmployerHero,
    uploadEmployerHeroImage,
    deleteEmployerHero,
    createEmployerHowWeWorkStep,
    getAdminHowWeWorkSteps,
    getEmployerHowWeWorkSteps,
    updateEmployerHowWeWorkStep,
    deleteEmployerHowWeWorkStep,
    createEmployerFAQ,
    getAdminEmployerFAQ,
    getEmployerFAQ,
    updateEmployerFAQ,
    deleteEmployerFAQ,
    createEmployerCTA,
    getAdminEmployerCTA,
    getEmployerCTA,
    updateEmployerCTA,
    deleteEmployerCTA,
};
