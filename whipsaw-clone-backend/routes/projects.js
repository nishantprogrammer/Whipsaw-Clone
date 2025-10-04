const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllProjects,
  getAllProjectsAdmin,
  getProjectBySlug,
  getProjectsByCategory,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
  upload
} = require('../controllers/projectController');

// Public routes
router.get('/', getAllProjects);
router.get('/category/:category', getProjectsByCategory);
router.get('/:slug', getProjectBySlug);

// Admin-only routes
router.get('/admin/all', auth, getAllProjectsAdmin);
router.post('/', auth, createProject);
router.put('/:id', auth, updateProject);
router.delete('/:id', auth, deleteProject);

// Project image upload
router.post('/upload-image', auth, upload.single('image'), uploadProjectImage);

module.exports = router;
