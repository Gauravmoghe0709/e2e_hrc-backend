const employeCardmodel = require('../../model/Home models/Employersection.model');
const uploadImage = require('../../services/storage.services');

async function getActiveEmployeeCards(req, res) {
    try {
        const employeeCards = await employeCardmodel.find({ isActive: true }).sort({ displayOrder: 1 });
        res.status(200).json({ success: true, message: 'Employer section cards fetched successfully', data: employeeCards });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching employee cards', error: error.message });
    }
}

async function getAdminEmployeeCards(req, res) {
    try {
        const employeeCards = await employeCardmodel.find().sort({ displayOrder: 1 });
        res.status(200).json({ success: true, message: 'Admin employer section cards fetched successfully', data: employeeCards });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching employee cards', error: error.message });
    }
}

async function createEmployeeCard(req, res) {
    const { badgeText, titleLine, highlightedText, description, buttonText, buttonLink, cardType, displayOrder, isActive } = req.body;
    const normalizedDisplayOrder = Number(displayOrder ?? 1);

    if (!badgeText?.trim() || !titleLine?.trim() || !highlightedText?.trim() || !description?.trim() || !buttonText?.trim() || !buttonLink?.trim() || !cardType || Number.isNaN(normalizedDisplayOrder)) {
        return res.status(400).json({ success: false, message: 'All required fields are required' });
    }

    try {
        let imageUrl = '';
        if (req.file) {
            const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-employee-cards');
            imageUrl = uploadResponse?.url || '';
        }

        const newEmployeeCard = await employeCardmodel.create({
            badgeText: badgeText.trim(),
            titleLine: titleLine.trim(),
            highlightedText: highlightedText.trim(),
            description: description.trim(),
            buttonText: buttonText.trim(),
            buttonLink: buttonLink.trim(),
            cardType,
            image: imageUrl,
            displayOrder: normalizedDisplayOrder,
            isActive: isActive !== undefined ? isActive : true,
        });
        res.status(201).json({ success: true, message: 'Employee card created successfully', data: newEmployeeCard });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating employee card', error: error.message });
    }
}

async function updateEmployeeCard(req, res) {
    const { id } = req.params;
    const { badgeText, titleLine, highlightedText, description, buttonText, buttonLink, cardType, displayOrder, isActive } = req.body;
    const updateData = { badgeText, titleLine, highlightedText, description, buttonText, buttonLink, cardType, displayOrder, isActive };

    Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

    if (updateData.displayOrder !== undefined) {
        updateData.displayOrder = Number(updateData.displayOrder);
    }

    if (!updateData.badgeText?.trim() || !updateData.titleLine?.trim() || !updateData.highlightedText?.trim() || !updateData.description?.trim() || !updateData.buttonText?.trim() || !updateData.buttonLink?.trim() || Number.isNaN(updateData.displayOrder)) {
        return res.status(400).json({ success: false, message: 'All required fields are required' });
    }

    try {
        let imageUrl;
        if (req.file) {
            const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-employee-cards');
            imageUrl = uploadResponse?.url || '';
        }

        if (imageUrl !== undefined) {
            updateData.image = imageUrl;
        }

        const updatedEmployeeCard = await employeCardmodel.findByIdAndUpdate(id, {
            ...updateData,
            badgeText: updateData.badgeText.trim(),
            titleLine: updateData.titleLine.trim(),
            highlightedText: updateData.highlightedText.trim(),
            description: updateData.description.trim(),
            buttonText: updateData.buttonText.trim(),
            buttonLink: updateData.buttonLink.trim(),
        }, { new: true, runValidators: true });

        if (!updatedEmployeeCard) {
            return res.status(404).json({ success: false, message: 'Employee card not found' });
        }

        res.status(200).json({ success: true, message: 'Employee card updated successfully', data: updatedEmployeeCard });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating employee card', error: error.message });
    }
}

async function deleteEmployeeCard(req, res) {
    const { id } = req.params;
    try {
        const deleteemployeecard = await employeCardmodel.findByIdAndDelete(id);
        if (!deleteemployeecard) {
            return res.status(404).json({ success: false, message: 'Employee card not found' });
        }
        res.status(200).json({ success: true, message: 'Employee card deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting employee card', error: error.message });
    }
}


async function uploadEmployeeCardImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image file provided' });
        }

        const card = await employeCardmodel.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ success: false, message: 'Employee card not found' });
        }

        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-employee-cards');

        if (!uploadResponse?.url) {
            return res.status(500).json({ success: false, message: 'Failed to upload image to ImageKit' });
        }

        card.image = uploadResponse.url;
        await card.save();

        res.status(200).json({ success: true, message: 'Employee card image uploaded successfully', data: card });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error uploading employee card image', error: error.message });
    }
}

module.exports = {
    getActiveEmployeeCards,
    getAdminEmployeeCards,
    createEmployeeCard,
    updateEmployeeCard,
    deleteEmployeeCard,
    uploadEmployeeCardImage,
};