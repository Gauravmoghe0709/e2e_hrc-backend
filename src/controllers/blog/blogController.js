const mongoose = require('mongoose');
const Blog = require('../../model/blog/Blog');
const uploadImage = require('../../services/storage.services');

// ─── Helper Function: Normalize Boolean ────────────────────────────────────────
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

// ─── CREATE Blog (Admin) ───────────────────────────────────────────────────────
const createBlog = async (req, res) => {
  try {
    const {
      blogHeading,
      author,
      publishDate,
      slug,
      paragraph1,
      paragraph2,
      heading2,
      paragraph3,
      quote,
      heading3,
      paragraph4,
      paragraph5,
      heading4,
      paragraph6,
      tags,
      seo,
      isActive,
    } = req.body;

    // Validate required fields
    if (!blogHeading || !author || !publishDate || !slug || !paragraph1) {
      return res.status(400).json({
        success: false,
        message: 'blogHeading, author, publishDate, slug, and paragraph1 are required.',
      });
    }

    // Parse JSON fields from FormData
    let parsedSeo = seo;
    let parsedTags = tags;

    // Parse SEO (sent as JSON string from FormData)
    if (typeof seo === 'string') {
      try {
        parsedSeo = JSON.parse(seo);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'Invalid SEO JSON format.',
        });
      }
    }

    // Parse tags (sent as JSON string from FormData)
    if (typeof tags === 'string') {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'Invalid tags JSON format.',
        });
      }
    }

    // Validate SEO fields
    if (!parsedSeo || !parsedSeo.metaTitle || !parsedSeo.metaDescription) {
      return res.status(400).json({
        success: false,
        message: 'seo.metaTitle and seo.metaDescription are required.',
      });
    }

    // Handle image upload
    let imageUrl = null;
    let ogImageUrl = null;

    if (req.files) {
      // Handle main blog image
      if (req.files.image && req.files.image[0]) {
        const uploadedFile = await uploadImage(
          req.files.image[0].buffer,
          req.files.image[0].originalname,
          'e2e-blog'
        );
        imageUrl = uploadedFile.url;
      }
      // Handle OG image
      if (req.files.ogImage && req.files.ogImage[0]) {
        const uploadedFile = await uploadImage(
          req.files.ogImage[0].buffer,
          req.files.ogImage[0].originalname,
          'e2e-blog-og'
        );
        ogImageUrl = uploadedFile.url;
      }
    } else if (req.file) {
      // Fallback for single file upload
      const uploadedFile = await uploadImage(
        req.file.buffer,
        req.file.originalname,
        'e2e-blog'
      );
      imageUrl = uploadedFile.url;
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Blog image is required.',
      });
    }

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug: slug.toLowerCase() });
    if (existingBlog) {
      return res.status(409).json({
        success: false,
        message: 'A blog with this slug already exists',
      });
    }

    // Create blog document
    const newBlog = await Blog.create({
      blogHeading: blogHeading.trim(),
      author: author.trim(),
      publishDate: new Date(publishDate),
      slug: slug.toLowerCase().trim(),
      paragraph1,
      image: imageUrl,
      paragraph2: paragraph2 || undefined,
      heading2: heading2 || undefined,
      paragraph3: paragraph3 || undefined,
      quote: quote || undefined,
      heading3: heading3 || undefined,
      paragraph4: paragraph4 || undefined,
      paragraph5: paragraph5 || undefined,
      heading4: heading4 || undefined,
      paragraph6: paragraph6 || undefined,
      tags: parsedTags || [],
      seo: {
        metaTitle: parsedSeo.metaTitle.trim(),
        metaDescription: parsedSeo.metaDescription.trim(),
        canonicalUrl: parsedSeo.canonicalUrl || undefined,
        ogTitle: parsedSeo.ogTitle || undefined,
        ogDescription: parsedSeo.ogDescription || undefined,
        ogImage: ogImageUrl || parsedSeo.ogImage || undefined,
      },
      isActive: isActive !== undefined ? normalizeBoolean(isActive) : true,
    });

    return res.status(201).json({
      success: true,
      message: 'Blog created successfully.',
      data: newBlog,
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── GET All Blogs (Admin) ────────────────────────────────────────────────────
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ publishDate: -1 }).lean();
    return res.status(200).json({
      success: true,
      message: 'Blogs fetched successfully.',
      data: blogs,
      count: blogs.length,
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── GET Blog by ID (Admin) ───────────────────────────────────────────────────
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID.',
      });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog fetched successfully.',
      data: blog,
    });
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── UPDATE Blog (Admin) ───────────────────────────────────────────────────────
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID.',
      });
    }

    const updateData = {};
    const {
      blogHeading,
      author,
      publishDate,
      slug,
      paragraph1,
      paragraph2,
      heading2,
      paragraph3,
      quote,
      heading3,
      paragraph4,
      paragraph5,
      heading4,
      paragraph6,
      tags,
      seo,
      isActive,
    } = req.body;

    // Update scalar fields
    if (blogHeading !== undefined) updateData.blogHeading = blogHeading.trim();
    if (author !== undefined) updateData.author = author.trim();
    if (publishDate !== undefined) updateData.publishDate = new Date(publishDate);
    if (paragraph1 !== undefined) updateData.paragraph1 = paragraph1;
    if (paragraph2 !== undefined) updateData.paragraph2 = paragraph2;
    if (heading2 !== undefined) updateData.heading2 = heading2;
    if (paragraph3 !== undefined) updateData.paragraph3 = paragraph3;
    if (quote !== undefined) updateData.quote = quote;
    if (heading3 !== undefined) updateData.heading3 = heading3;
    if (paragraph4 !== undefined) updateData.paragraph4 = paragraph4;
    if (paragraph5 !== undefined) updateData.paragraph5 = paragraph5;
    if (heading4 !== undefined) updateData.heading4 = heading4;
    if (paragraph6 !== undefined) updateData.paragraph6 = paragraph6;
    if (isActive !== undefined) updateData.isActive = normalizeBoolean(isActive);

    // Parse and handle tags (sent as JSON string from FormData)
    if (tags !== undefined) {
      let parsedTags = tags;
      if (typeof tags === 'string') {
        try {
          parsedTags = JSON.parse(tags);
        } catch (e) {
          return res.status(400).json({
            success: false,
            message: 'Invalid tags JSON format.',
          });
        }
      }
      updateData.tags = parsedTags;
    }

    // Handle slug update (check for duplicates)
    if (slug !== undefined) {
      const newSlug = slug.toLowerCase().trim();
      const existingBlog = await Blog.findOne({
        slug: newSlug,
        _id: { $ne: id },
      });
      if (existingBlog) {
        return res.status(409).json({
          success: false,
          message: 'A blog with this slug already exists',
        });
      }
      updateData.slug = newSlug;
    }

    // Handle SEO update
    if (seo !== undefined) {
      let parsedSeo = seo;
      // Parse SEO (sent as JSON string from FormData)
      if (typeof seo === 'string') {
        try {
          parsedSeo = JSON.parse(seo);
        } catch (e) {
          return res.status(400).json({
            success: false,
            message: 'Invalid SEO JSON format.',
          });
        }
      }

      if (!parsedSeo.metaTitle || !parsedSeo.metaDescription) {
        return res.status(400).json({
          success: false,
          message: 'seo.metaTitle and seo.metaDescription are required.',
        });
      }
      updateData.seo = {
        metaTitle: parsedSeo.metaTitle.trim(),
        metaDescription: parsedSeo.metaDescription.trim(),
        canonicalUrl: parsedSeo.canonicalUrl || undefined,
        ogTitle: parsedSeo.ogTitle || undefined,
        ogDescription: parsedSeo.ogDescription || undefined,
        ogImage: parsedSeo.ogImage || undefined,
      };
    }

    // Handle image updates
    if (req.files) {
      // Handle main blog image
      if (req.files.image && req.files.image[0]) {
        const uploadedFile = await uploadImage(
          req.files.image[0].buffer,
          req.files.image[0].originalname,
          'e2e-blog'
        );
        updateData.image = uploadedFile.url;
      }
      // Handle OG image
      if (req.files.ogImage && req.files.ogImage[0]) {
        const uploadedFile = await uploadImage(
          req.files.ogImage[0].buffer,
          req.files.ogImage[0].originalname,
          'e2e-blog-og'
        );
        if (!updateData.seo) {
          updateData.seo = {};
        }
        updateData.seo.ogImage = uploadedFile.url;
      }
    } else if (req.file) {
      // Fallback for single file upload
      const uploadedFile = await uploadImage(
        req.file.buffer,
        req.file.originalname,
        'e2e-blog'
      );
      updateData.image = uploadedFile.url;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog updated successfully.',
      data: updatedBlog,
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── DELETE Blog (Admin) ───────────────────────────────────────────────────────
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID.',
      });
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog deleted successfully.',
      data: deletedBlog,
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── UPDATE Blog Status (Admin) ────────────────────────────────────────────────
const updateBlogStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID.',
      });
    }

    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: 'isActive field is required.',
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { isActive: normalizeBoolean(isActive) },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog status updated successfully.',
      data: updatedBlog,
    });
  } catch (error) {
    console.error('Error updating blog status:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── GET Active Blogs (Public) ────────────────────────────────────────────────
const getActiveBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isActive: true }).sort({ publishDate: -1 }).lean();
    return res.status(200).json({
      success: true,
      message: 'Active blogs fetched successfully.',
      data: blogs,
      count: blogs.length,
    });
  } catch (error) {
    console.error('Error fetching active blogs:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── GET Blog by Slug (Public) ────────────────────────────────────────────────
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    // First, check if ANY blog with this slug exists (regardless of status)
    const anyBlog = await Blog.findOne({ slug: slug.toLowerCase() });
    console.log('Blog with any status:', anyBlog ? { slug: anyBlog.slug, isActive: anyBlog.isActive } : 'None found');

    // Then search for active blog
    const blog = await Blog.findOne({
      slug: slug.toLowerCase(),
      isActive: true,
    });


    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog fetched successfully.',
      data: blog,
    });
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  updateBlogStatus,
  getActiveBlogs,
  getBlogBySlug,
};
