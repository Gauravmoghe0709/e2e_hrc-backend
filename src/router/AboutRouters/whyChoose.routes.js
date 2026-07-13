/*const express = require('express');
const router = express.Router();
const whyChooseController = require('../../controllers/HomeControllers/whyChoose.controller');
//const protectedRoute = require('../../middleware/auth.middleware');
const upload = require('../../middleware/upload.middleware');

// Public routes
router.get('/about-us/why-choose', whyChooseController.getActiveWhyChoose);

// Admin routes
router.get('/admin/why-choose', //protectedRoute, 
  whyChooseController.getAdminWhyChoose);
router.get('/admin/why-choose/:id', //protectedRoute, 
  whyChooseController.getWhyChooseById);
router.post('/admin/why-choose', //protectedRoute, 
  whyChooseController.createWhyChoose);
router.put('/admin/why-choose/:id', //protectedRoute, 
  whyChooseController.updateWhyChoose);
router.delete('/admin/why-choose/:id', //protectedRoute, 
  whyChooseController.deleteWhyChoose);
router.post('/admin/why-choose/:id/image', //protectedRoute, 
  upload.single('image'), whyChooseController.uploadWhyChooseImage);

module.exports = router;*/
