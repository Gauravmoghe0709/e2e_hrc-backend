const employeeCTA = require("../../model/Employee models/EmployeeCTA.model");
const employeeFAQ = require("../../model/Employee models/EmployeeFAQ.model");

async function createemployeeFAQ(req, res) {
    try {
        const { question, answer, order, isActive } = req.body;

        if (!question || !question.toString().trim()) {
            return res.status(400).json({ success: false, message: "Question is required." });
        }
        if (!answer || !answer.toString().trim()) {
            return res.status(400).json({ success: false, message: "Answer is required." });
        }

        const faq = await employeeFAQ.create({
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

async function getAdminemployeeFAQ(req, res) {
    try {
        const faqs = await employeeFAQ.find().sort({ order: 1, createdAt: -1 }).lean();
        res.status(200).json({ success: true, message: "Employer FAQ items fetched successfully.", data: faqs });
    } catch (error) {
        console.error("Error fetching Employer FAQ items:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function getemployeeFAQ(req, res) {
    try {
        const faqs = await employeeFAQ.find({ isActive: true }).sort({ order: 1 }).lean();
        res.status(200).json({ success: true, message: "Employer FAQ items fetched successfully.", data: faqs });
    } catch (error) {
        console.error("Error fetching Employer FAQ items:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function updateemployeeFAQ(req, res) {
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

        const updatedFaq = await employeeFAQ.findByIdAndUpdate(id, updateData, { returnDocument: "after", runValidators: true });

        if (!updatedFaq) {
            return res.status(404).json({ success: false, message: "Employer FAQ item not found." });
        }

        res.status(200).json({ success: true, message: "Employer FAQ item updated successfully.", data: updatedFaq });
    } catch (error) {
        console.error("Error updating Employer FAQ item:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function deleteemployeeFAQ(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Employer FAQ item ID is required." });
        }

        const deletedFaq = await employeeFAQ.findByIdAndDelete(id);

        if (!deletedFaq) {
            return res.status(404).json({ success: false, message: "Employer FAQ item not found." });
        }

        res.status(200).json({ success: true, message: "Employer FAQ item deleted successfully.", data: null });
    } catch (error) {
        console.error("Error deleting Employer FAQ item:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function createemployeeCTA(req, res) {
    try {
        const { ctaTitle, ctaDescription, buttonText, buttonLink, isActive } = req.body;

        if (!ctaTitle || !ctaTitle.toString().trim()) {
            return res.status(400).json({ success: false, message: "CTA title is required." });
        }
        if (!buttonText || !buttonText.toString().trim()) {
            return res.status(400).json({ success: false, message: "Button text is required." });
        }

        if (isActive === true) {
            await employeeCTA.updateMany({ isActive: true }, { isActive: false });
        }

        const cta = await employeeCTA.create({
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

async function getAdminemployeeCTA(req, res) {
    try {
        const ctas = await employeeCTA.find().sort({ createdAt: -1 }).lean();
        res.status(200).json({ success: true, message: "Workforce Solution CTA cards fetched successfully.", data: ctas });
    } catch (error) {
        console.error("Error fetching Workforce Solution CTA cards:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function getemployeeCTA(req, res) {
    try {
        const cta = await employeeCTA.findOne({ isActive: true }).lean();

        if (!cta) {
            return res.status(404).json({ success: false, message: "Active Workforce Solution CTA card not found." });
        }

        res.status(200).json({ success: true, message: "Workforce Solution CTA card fetched successfully.", data: cta });
    } catch (error) {
        console.error("Error fetching Workforce Solution CTA card:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function updateemployeeCTA(req, res) {
    try {
        const { id } = req.params;
        const { ctaTitle, ctaDescription, buttonText, buttonLink, isActive } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "Workforce Solution CTA card ID is required." });
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
            await employeeCTA.updateMany({ isActive: true, _id: { $ne: id } }, { isActive: false });
        }

        const updatedCta = await employeeCTA.findByIdAndUpdate(id, updateData, { returnDocument: "after", runValidators: true });

        if (!updatedCta) {
            return res.status(404).json({ success: false, message: "Workforce Solution CTA card not found." });
        }

        res.status(200).json({ success: true, message: "Workforce Solution CTA card updated successfully.", data: updatedCta });
    } catch (error) {
        console.error("Error updating Workforce Solution CTA card:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

async function deleteemployeeCTA(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Workforce Solution CTA card ID is required." });
        }

        const deletedCta = await employeeCTA.findByIdAndDelete(id);

        if (!deletedCta) {
            return res.status(404).json({ success: false, message: "Workforce Solution CTA card not found." });
        }

        res.status(200).json({ success: true, message: "Workforce Solution CTA card deleted successfully.", data: null });
    } catch (error) {
        console.error("Error deleting Workforce Solution CTA card:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

module.exports = {
    createemployeeFAQ,
    getAdminemployeeFAQ,
    getemployeeFAQ,
    updateemployeeFAQ,
    deleteemployeeFAQ,
    createemployeeCTA,
    getAdminemployeeCTA,
    getemployeeCTA,
    updateemployeeCTA,
    deleteemployeeCTA,
};
