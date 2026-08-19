/**
 * Seed Script: Add test blog to MongoDB
 * 
 * Usage: node seed-blog.js
 * 
 * This script creates a test blog entry with the slug "navigating-leadership-transitions"
 * that matches the hardcoded frontend link and can be used to test the BlogArticle component.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('./src/model/blog/Blog');
const connectDB = require('./src/db/db');

const seedBlog = async () => {
  try {
    console.log('🌱 Starting blog seed...');
    
    // Connect to database
    await connectDB();
    console.log('✓ Connected to MongoDB');

    // Check if blog already exists
    const existingBlog = await Blog.findOne({ 
      slug: 'navigating-leadership-transitions' 
    });

    if (existingBlog) {
      console.log('⚠️  Blog already exists with ID:', existingBlog._id);
      console.log('✓ Blog data:', {
        slug: existingBlog.slug,
        blogHeading: existingBlog.blogHeading,
        isActive: existingBlog.isActive,
      });
      process.exit(0);
    }

    // Create test blog
    const newBlog = await Blog.create({
      blogHeading: 'Navigating Leadership Transitions in Fast-Growing Tech Firms',
      author: 'HR Consultancy Team',
      publishDate: new Date('2026-04-08'),
      slug: 'navigating-leadership-transitions',
      paragraph1: 'As tech startups move from seed funding to scale-up phases, the leadership requirements shift dramatically. Identifying "transitional talent"—leaders who can navigate the chaos of growth while building sustainable systems—is the primary challenge for modern executive search.',
      image: 'https://via.placeholder.com/800x450?text=Blog+Hero+Image',
      paragraph2: 'The transition from a founding team to a professionalized leadership tier is often the most precarious period for a fast-growing tech firm. Cultural erosion, process friction, and loss of momentum are common pitfalls that occur when leadership growth fails to keep pace with operational scaling.',
      heading2: 'The Cultural Fit Paradox',
      paragraph3: 'In the early days of a startup, "culture fit" often means shared interests and late-night coding sessions. However, as a firm grows, culture fit must evolve into "culture add." This requires leaders who don\'t just mimic the existing environment but bring the professional maturity needed to stabilize it. Executive search in this domain isn\'t just about matching resumes; it\'s about identifying individuals who can translate founder vision into scalable corporate strategy without extinguishing the entrepreneurial spark.',
      quote: 'The best transitional leaders act as a bridge between the "move fast and break things" mentality and the "build to last" infrastructure required for IPO readiness.',
      heading3: 'Common Organizational Structures',
      paragraph4: 'Understanding how to structure an organization during hyper-growth is critical. Much like a UI grid provides a framework for design, an organizational grid provides a framework for communication and accountability. We identify three primary structures used in modern tech environments: Columnar (vertical reporting), Modular (cross-functional squads), and Hierarchical (priority-based allocation).',
      paragraph5: 'When scaling, firms often start with a flat (Columnar) structure and must pivot toward a Modular or Matrix approach to maintain agility. The role of HR consultancy is to diagnose which "grid" best supports the current growth stage and to source the executive talent capable of managing that specific architecture.',
      heading4: 'Identifying the Leadership Gap',
      paragraph6: 'The gap is rarely one of technical skill. In our experience, leadership failures in tech firms usually stem from a lack of "emotional intelligence at scale." Can the leader manage 50 people with the same empathy they managed 5? This is where the Executive Search methodology must transcend traditional metrics and dive deep into behavioral psychology and organizational health markers.',
      tags: ['Leadership', 'Tech Startups', 'Talent Strategy', 'Scale-Up'],
      seo: {
        metaTitle: 'Navigating Leadership Transitions - E2E HR Consultancy',
        metaDescription: 'Guide to managing executive transitions during tech startup growth. Learn how to identify transitional leaders and build scalable organizational structures.',
        canonicalUrl: 'https://e2e-consultancy.com/blogs/navigating-leadership-transitions',
        ogTitle: 'Leadership Transitions in Tech: A Strategy Guide',
        ogDescription: 'Executive search best practices for fast-growing tech firms.',
        ogImage: 'https://via.placeholder.com/1200x630?text=OG+Image',
      },
      isActive: true,
    });

    console.log('✅ Blog created successfully!');
    console.log('📝 Blog Details:');
    console.log('   ID:', newBlog._id);
    console.log('   Slug:', newBlog.slug);
    console.log('   Title:', newBlog.blogHeading);
    console.log('   Status:', newBlog.isActive ? 'Active ✓' : 'Inactive ✗');
    console.log('   Created:', newBlog.createdAt);

    console.log('\n🎯 Next Steps:');
    console.log('   1. Start your frontend dev server');
    console.log('   2. Navigate to: http://localhost:3000/blogs/navigating-leadership-transitions');
    console.log('   3. Blog should load with dynamic content and SEO metadata');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding blog:', error.message);
    if (error.code === 11000) {
      console.error('⚠️  Duplicate key error - blog slug may already exist');
    }
    process.exit(1);
  }
};

// Run seed
seedBlog();
