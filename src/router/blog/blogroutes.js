const express = require('express');
const router = express.Router();
const {
  getAllBlogHeroes,
  getActiveBlogHero,
  createBlogHero,
  updateBlogHero,
  deleteBlogHero,
} = require('../../controllers/blog/BlogHero.controller');
const {
  getAllFeaturedBlogs,
  getActiveFeaturedBlog,
  createFeaturedBlog,
  updateFeaturedBlog,
  deleteFeaturedBlog,
} = require('../../controllers/blog/FeaturedBlog.controller');
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  updateBlogStatus,
  getActiveBlogs,
  getBlogBySlug,
} = require('../../controllers/blog/blogController');
const upload = require('../../middleware/upload.middleware');
const protectedRoute = require('../../middleware/auth.middleware');

// ─── Blog Hero Routes ──────────────────────────────────────────────────────────

// Public API
router.get('/blog-hero/active', getActiveBlogHero);

// Admin APIs
router.get('/admin/blog-hero', protectedRoute, getAllBlogHeroes);
router.post('/admin/blog-hero', protectedRoute, upload.single('image'), createBlogHero);
router.put('/admin/blog-hero/:id', protectedRoute, upload.single('image'), updateBlogHero);
router.delete('/admin/blog-hero/:id', protectedRoute, deleteBlogHero);

// ─── Featured Blog Routes ──────────────────────────────────────────────────────

// Public API
router.get('/featured-blog/active', getActiveFeaturedBlog);

// Admin APIs
router.get('/admin/featured-blog', protectedRoute, getAllFeaturedBlogs);
router.post('/admin/featured-blog', protectedRoute, upload.single('image'), createFeaturedBlog);
router.put('/admin/featured-blog/:id', protectedRoute, upload.single('image'), updateFeaturedBlog);
router.delete('/admin/featured-blog/:id', protectedRoute, deleteFeaturedBlog);

// ─── Blog CRUD Routes ─────────────────────────────────────────────────────────

// Admin APIs
router.get('/admin/blogs', protectedRoute, getAllBlogs);
router.get('/admin/blogs/:id', protectedRoute, getBlogById);
router.post('/admin/blogs', protectedRoute, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'ogImage', maxCount: 1 }]), createBlog);
router.put('/admin/blogs/:id', protectedRoute, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'ogImage', maxCount: 1 }]), updateBlog);
router.delete('/admin/blogs/:id', protectedRoute, deleteBlog);
router.patch('/admin/blogs/:id/status', protectedRoute, updateBlogStatus);

// Public APIs (place dynamic routes last to avoid conflicts)
router.get('/blogs', getActiveBlogs);
router.get('/blogs/:slug', getBlogBySlug);

module.exports = router;
