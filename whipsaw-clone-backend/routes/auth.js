const express = require('express');
const router = express.Router();
const { login, verifyToken } = require('../controllers/authController');

// Login route
router.post('/login', login);

// Verify token route
router.get('/verify', verifyToken);

module.exports = router;
