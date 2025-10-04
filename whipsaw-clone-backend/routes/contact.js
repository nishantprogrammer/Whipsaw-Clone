const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../controllers/contactController');
const { body } = require('express-validator');

// Validation rules
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
];

router.post('/', contactValidation, sendContactEmail);

module.exports = router;
