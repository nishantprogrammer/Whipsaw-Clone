const Post = require('../models/Post');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/blog-images/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get post by slug
const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new post
const createPost = async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      author: req.user.username
    });
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    Object.assign(post, req.body);
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete associated image files if they exist
    if (post.featuredImage && post.featuredImage.includes('/uploads/blog-images/optimized/')) {
      try {
        const baseName = path.parse(post.featuredImage).name.replace('-optimized', '');

        // Paths to all variations
        const thumbnailsDir = path.join(__dirname, '..', 'uploads', 'blog-images', 'thumbnails');
        const optimizedDir = path.join(__dirname, '..', 'uploads', 'blog-images', 'optimized');

        const filesToDelete = [
          path.join(thumbnailsDir, `${baseName}-thumb.webp`),
          path.join(optimizedDir, `${baseName}-optimized.webp`),
          path.join(optimizedDir, `${baseName}-medium.webp`),
          path.join(optimizedDir, `${baseName}-small.webp`)
        ];

        // Delete all variations
        filesToDelete.forEach(filePath => {
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          } catch (err) {
            console.log(`Error deleting ${filePath}:`, err.message);
          }
        });
      } catch (fileError) {
        console.log('Error deleting image files:', fileError.message);
      }
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload and optimize image for posts
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const originalPath = req.file.path;
    const baseName = path.parse(req.file.filename).name;

    // Ensure upload directories exist
    const uploadDir = path.join(__dirname, '..', 'uploads', 'blog-images');
    const thumbnailsDir = path.join(uploadDir, 'thumbnails');
    const optimizedDir = path.join(uploadDir, 'optimized');

    await fs.mkdir(thumbnailsDir, { recursive: true });
    await fs.mkdir(optimizedDir, { recursive: true });

    // Generate optimized images
    const sharpInstance = sharp(originalPath);
    const metadata = await sharpInstance.metadata();

    // Create thumbnail (300px wide, max height 200px)
    const thumbnailPath = path.join(thumbnailsDir, `${baseName}-thumb.webp`);
    await sharpInstance
      .resize(300, 200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(thumbnailPath);

    // Create optimized large image (1200px wide, max height 900px)
    const optimizedPath = path.join(optimizedDir, `${baseName}-optimized.webp`);
    await sharpInstance
      .resize(1200, 900, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 90 })
      .toFile(optimizedPath);

    // Create responsive images for different screen sizes
    const mediumPath = path.join(optimizedDir, `${baseName}-medium.webp`);
    const smallPath = path.join(optimizedDir, `${baseName}-small.webp`);

    await Promise.all([
      sharpInstance
        .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 88 })
        .toFile(mediumPath),

      sharpInstance
        .resize(600, 400, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(smallPath)
    ]);

    // Delete original uploaded file
    await fs.unlink(originalPath);

    // Get file sizes for metadata
    const [thumbStats, optimizedStats] = await Promise.all([
      fs.stat(thumbnailPath),
      fs.stat(optimizedPath)
    ]);

    const imageData = {
      message: 'Image optimized and uploaded successfully',
      originalName: req.file.originalname,
      format: 'WebP',
      originalSize: req.file.size,
      optimizedSize: optimizedStats.size,
      thumbnailSize: thumbStats.size,
      dimensions: {
        original: { width: metadata.width, height: metadata.height },
        optimized: '1200x900px max',
        thumbnail: '300x200px max'
      },

      // URLs for different image versions
      imageUrl: `/uploads/blog-images/optimized/${baseName}-optimized.webp`,
      thumbnailUrl: `/uploads/blog-images/thumbnails/${baseName}-thumb.webp`,
      responsiveUrls: {
        large: `/uploads/blog-images/optimized/${baseName}-optimized.webp`,
        medium: `/uploads/blog-images/optimized/${baseName}-medium.webp`,
        small: `/uploads/blog-images/optimized/${baseName}-small.webp`
      },

      baseName: baseName
    };

    res.json(imageData);
  } catch (error) {
    console.error('Image processing error:', error);

    // Clean up on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: 'Failed to process image' });
  }
};

const clearAllPosts = async (req, res) => {
  try {
    // Delete associated image files from all posts
    const posts = await Post.find({});
    for (const post of posts) {
      if (post.featuredImage && post.featuredImage.includes('/uploads/blog-images/optimized/')) {
        try {
          const baseName = path.parse(post.featuredImage).name.replace('-optimized', '');

          // Paths to all variations
          const thumbnailsDir = path.join(__dirname, '..', 'uploads', 'blog-images', 'thumbnails');
          const optimizedDir = path.join(__dirname, '..', 'uploads', 'blog-images', 'optimized');

          const filesToDelete = [
            path.join(thumbnailsDir, `${baseName}-thumb.webp`),
            path.join(optimizedDir, `${baseName}-optimized.webp`),
            path.join(optimizedDir, `${baseName}-medium.webp`),
            path.join(optimizedDir, `${baseName}-small.webp`)
          ];

          // Delete all variations
          filesToDelete.forEach(filePath => {
            try {
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
            } catch (err) {
              console.log(`Error deleting ${filePath}:`, err.message);
            }
          });
        } catch (fileError) {
          console.log('Error deleting image files:', fileError.message);
        }
      }
    }

    // Clear database
    await Post.deleteMany({});
    console.log('All posts cleared from database');

    res.json({ message: 'All posts and associated images deleted successfully' });
  } catch (error) {
    console.error('Error clearing posts:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  uploadImage,
  upload,
  clearAllPosts
};
