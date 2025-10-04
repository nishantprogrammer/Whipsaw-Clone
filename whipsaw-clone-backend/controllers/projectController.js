const Project = require('../models/Project');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads (reuse the same directory structure as posts)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/projects/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
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

// Get all projects (published only, for frontend)
const getAllProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const projects = await Project.find({ status: 'published' })
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments({ status: 'published' });

    res.json({
      projects,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all projects for admin (no filters)
const getAllProjectsAdmin = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get project by slug
const getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get projects by category
const getProjectsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const projects = await Project.find({
      category: category,
      status: 'published'
    }).sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new project
const createProject = async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      author: req.user.username
    });
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    Object.assign(project, req.body);
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete associated image files if they exist
    const imagesToDelete = [
      project.featuredImage,
      ...project.galleryImages
    ].filter(img => img && img.startsWith('/uploads/projects/'));

    imagesToDelete.forEach(imagePath => {
      try {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (err) {
        console.log(`Error deleting ${imagePath}:`, err.message);
      }
    });

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload image for projects
const uploadProjectImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const originalPath = req.file.path;
    const baseName = path.parse(req.file.filename).name;

    // Ensure upload directories exist
    const uploadDir = path.join(__dirname, '..', 'uploads', 'projects');
    const optimizedDir = path.join(uploadDir, 'optimized');

    await fs.mkdir(optimizedDir, { recursive: true });

    // Generate optimized image
    const sharpInstance = sharp(originalPath);
    const metadata = await sharpInstance.metadata();

    // Create optimized image (1200px wide, max height 900px)
    const optimizedPath = path.join(optimizedDir, `${baseName}-optimized.webp`);
    await sharpInstance
      .resize(1200, 900, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 90 })
      .toFile(optimizedPath);

    // Delete original uploaded file
    await fs.unlink(originalPath);

    // Get file sizes for metadata
    const stat = await fs.stat(optimizedPath);

    const imageData = {
      message: 'Project image optimized and uploaded successfully',
      originalName: req.file.originalname,
      format: 'WebP',
      originalSize: req.file.size,
      optimizedSize: stat.size,
      dimensions: {
        original: { width: metadata.width, height: metadata.height },
        optimized: '1200x900px max'
      },
      imageUrl: `/uploads/projects/optimized/${baseName}-optimized.webp`,
      baseName: baseName
    };

    res.json(imageData);
  } catch (error) {
    console.error('Project image processing error:', error);

    // Clean up on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: 'Failed to process image' });
  }
};

module.exports = {
  getAllProjects,
  getAllProjectsAdmin,
  getProjectBySlug,
  getProjectsByCategory,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
  upload
};
