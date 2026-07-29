const TestimonialCard = require('../../model/About models/TestimonialCard');
const TestimonialSection = require('../../model/About models/TestimonialSection');
const uploadImage = require('../../services/storage.services');

exports.getCards = async (req, res) => {
  try {
    const cards = await TestimonialCard.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: cards });
  } catch (error) {
    console.error("Error in getCards:", error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getCard = async (req, res) => {
  try {
    const card = await TestimonialCard.findById(req.params.id);
    if (!card) return res.status(404).json({ success: false, message: 'Card not found' });
    res.status(200).json({ success: true, data: card });
  } catch (error) {
    console.error("Error in getCard:", error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.createCard = async (req, res) => {
  try {
    const { companyName, title, description, order, isActive } = req.body;
    if (!companyName || !title || !description || order === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const newCard = await TestimonialCard.create({
      companyName,
      title,
      description,
      order,
      isActive: isActive !== undefined ? isActive : true
    });
    res.status(201).json({ success: true, message: 'Card created successfully', data: newCard });
  } catch (error) {
    console.error("Error in createCard:", error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const card = await TestimonialCard.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!card) return res.status(404).json({ success: false, message: 'Card not found' });
    res.status(200).json({ success: true, message: 'Card updated successfully', data: card });
  } catch (error) {
    console.error("Error in updateCard:", error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const card = await TestimonialCard.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ success: false, message: 'Card not found' });
    res.status(200).json({ success: true, message: 'Card deleted successfully' });
  } catch (error) {
    console.error("Error in deleteCard:", error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image provided' });

    const card = await TestimonialCard.findById(req.params.id);
    if (!card) return res.status(404).json({ success: false, message: 'Card not found' });

    const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, 'testimonials');
    card.companyLogo = uploadResponse.url;
    await card.save();

    res.status(200).json({ success: true, message: 'Logo uploaded successfully', data: card });
  } catch (error) {
    console.error("Error in uploadLogo:", error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getPublicTestimonials = async (req, res) => {
  try {
    const section = await TestimonialSection.findOne({ isActive: true });
    if (!section) {
      return res.status(200).json({ success: true, data: { section: null, cards: [] } });
    }
    const cards = await TestimonialCard.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({ success: true, data: { section, cards } });
  } catch (error) {
    console.error("Error in getPublicTestimonials:", error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
