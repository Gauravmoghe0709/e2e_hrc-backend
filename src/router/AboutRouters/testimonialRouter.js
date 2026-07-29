const express = require('express');
const router = express.Router();
const multer = require('multer');

// Controller imports
const sectionController = require('../../controllers/AboutControllers/testimonialSectionController');
const cardController = require('../../controllers/AboutControllers/testimonialCardController');

// Multer setup for memory storage (for ImageKit upload)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// --- Public API ---
router.get('/testimonials', cardController.getPublicTestimonials);

// --- Admin Section API ---
router.get('/admin/testimonial-section', sectionController.getSection);
router.post('/admin/testimonial-section', sectionController.upsertSection);
router.put('/admin/testimonial-section/:id', sectionController.upsertSection); // Using same upsert logic
router.delete('/admin/testimonial-section/:id', sectionController.deleteSection);

// --- Admin Cards API ---
router.post('/admin/testimonial-cards', cardController.createCard);
router.get('/admin/testimonial-cards', cardController.getCards);
router.get('/admin/testimonial-cards/:id', cardController.getCard);
router.put('/admin/testimonial-cards/:id', cardController.updateCard);
router.delete('/admin/testimonial-cards/:id', cardController.deleteCard);

// Logo upload route
router.patch('/admin/testimonial-cards/:id/logo', upload.single('image'), cardController.uploadLogo);

module.exports = router;
