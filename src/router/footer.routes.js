const express = require('express');
const router = express.Router();
const footerController = require('../controllers/footer.controller');
//const protectedRoute = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Frontend GET routes
router.get('/footer-company', footerController.getFooterCompanyInfo);
router.get('/footer-contact', footerController.getFooterContact);
router.get('/footer-navigation', footerController.getFooterNavigation);
router.get('/footer-office-location', footerController.getFooterOfficeLocation);

// Admin routes
router.post('/admin/footer-company', //protectedRoute, 
  upload.single('logo'), footerController.createFooterCompanyInfo);
router.get('/admin/footer-company', //protectedRoute, 
  footerController.getFooterCompanyInfosAdmin);
router.put('/admin/footer-company/:id', //protectedRoute, 
  upload.single('logo'), footerController.updateFooterCompanyInfo);
router.delete('/admin/footer-company/:id', //protectedRoute, 
  footerController.deleteFooterCompanyInfo);

router.post('/admin/footer-contact', //protectedRoute, 
  footerController.createFooterContact);
router.get('/admin/footer-contact', //protectedRoute, 
  footerController.getFooterContactsAdmin);
router.put('/admin/footer-contact/:id', //protectedRoute, 
  footerController.updateFooterContact);
router.delete('/admin/footer-contact/:id', //protectedRoute, 
  footerController.deleteFooterContact);

router.post('/admin/footer-navigation', //protectedRoute, 
  footerController.createFooterNavigation);
router.get('/admin/footer-navigation', //protectedRoute, 
  footerController.getFooterNavigationsAdmin);
router.put('/admin/footer-navigation/:id', //protectedRoute, 
  footerController.updateFooterNavigation);
router.delete('/admin/footer-navigation/:id', //protectedRoute, 
  footerController.deleteFooterNavigation);

router.post('/admin/footer-office-location', //protectedRoute, 
  upload.single('image'), footerController.createFooterOfficeLocation);
router.get('/admin/footer-office-location', //protectedRoute, 
  footerController.getFooterOfficeLocationsAdmin);
router.put('/admin/footer-office-location/:id', //protectedRoute, 
  upload.single('image'), footerController.updateFooterOfficeLocation);
router.delete('/admin/footer-office-location/:id', //protectedRoute, 
  footerController.deleteFooterOfficeLocation);

module.exports = router;
