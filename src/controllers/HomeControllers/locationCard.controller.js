const locationCardmodel = require('../../model/Home models/LocationCard.model');
const uploadImage = require('../../services/storage.services');



async function getAllLocationCards(req, res) {
    try {
        const locationCards = await locationCardmodel.find({ isActive: true }).sort({ order: 1 });
        res.status(200).json({ success: true, message: 'Location cards fetched successfully', data: locationCards });
    } catch (error) {
        console.error('Error in getAllLocationCards:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function getAllLocationCardsAdmin(req, res) {
    try {
        const locationCards = await locationCardmodel.find().sort({ order: 1 });
        res.status(200).json({ success: true, message: 'All location cards fetched successfully', data: locationCards });
    } catch (error) {
        console.error('Error in getAllLocationCardsAdmin:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function createLocationCard(req, res) {
    const { sectiontitle, contryname, cityname, isActive } = req.body;
    let imageurl = '';

    if (req.file) {
        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-location-cards');
        imageurl = uploadResponse.url;
    }

    try {
        const newLocationCard = await locationCardmodel.create({
            sectiontitle,
            contryname,
            cityname,
            image: imageurl,
            isActive: isActive ?? true
        });
        res.status(201).json({ success: true, message: 'Location card created successfully', data: newLocationCard });
    } catch (error) {
        console.error('Error in createLocationCard:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
async function updateLocationCard(req, res) {
    const { id } = req.params;
    const { sectiontitle, contryname, cityname, isActive } = req.body;
    try {
        const updatedLocationCard = await locationCardmodel.findByIdAndUpdate(
            id,
            { sectiontitle, contryname, cityname, isActive },
           { returnDocument: "after" }
        );
        res.status(200).json({ success: true, message: 'Location card updated successfully', data: updatedLocationCard });

    } catch (error) {
        console.error('Error in updateLocationCard:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function deleteLocationCard(req, res) {
    const { id } = req.params;
    try {
        await locationCardmodel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Location card deleted successfully' });
    } catch (error) {
        console.error('Error in deleteLocationCard:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function uploadLocationCardImage(req, res) {
    const { id } = req.params;
    try{
        if(!req.file){
            return res.status(400).json({ success: false, message: 'No image file provided' });
        }
        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-location-cards');
        const updatedLocationCard = await locationCardmodel.findByIdAndUpdate(
            id,
            { image: uploadResponse.url },
             { returnDocument: "after" }
        );
        res.status(200).json({ success: true, message: 'Location card image uploaded successfully', data: updatedLocationCard });
    } catch (error) {
        console.error('Error in uploadLocationCardImage:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = {
    getAllLocationCards,
    getAllLocationCardsAdmin,
    createLocationCard,
    updateLocationCard,
    deleteLocationCard,
    uploadLocationCardImage
};

