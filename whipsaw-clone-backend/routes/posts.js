const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  uploadImage,
  upload,
  clearAllPosts
} = require('../controllers/postController');

// Public routes
router.get('/', getAllPosts);
router.get('/:slug', getPostBySlug);

// Protected routes (require authentication)
router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);

// Image upload route
router.post('/upload-image', auth, upload.single('image'), uploadImage);

// Clear all posts (for testing/admin purposes)
router.delete('/', auth, clearAllPosts);

module.exports = router;
