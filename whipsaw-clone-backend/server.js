const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const User = require('./models/User');

const app = express();

// Trust proxy for Render
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  skipFailedRequests: true,
  skipSuccessfulRequests: false
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:5173', 'http://localhost:3000'], // Allow frontend origins
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api/', limiter); // Apply rate limiting to API routes

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/posts', require('./routes/posts'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/auth', require('./routes/auth'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Whipsaw Clone Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve static files from the React app build directory
const frontendPath = path.join(__dirname, '../whipsaw-clone-frontend/dist');
console.log('Serving frontend from:', frontendPath);
console.log('Frontend files available:', require('fs').existsSync(frontendPath));
app.use(express.static(frontendPath));

// Error handling middleware (must be before catch-all)
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: 'Validation Error', errors });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `${field} already exists` });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  res.status(500).json({ message: 'Something went wrong!' });
});

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  // Skip API routes - they should have been handled above
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }

  const indexPath = path.join(frontendPath, 'index.html');
  console.log('Serving index.html from:', indexPath);
  console.log('Index file exists:', require('fs').existsSync(indexPath));

  // Check if index.html exists, if not return a simple HTML response
  if (!require('fs').existsSync(indexPath)) {
    console.error('Frontend build not found at:', indexPath);
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Whipsaw Clone - Deployment Error</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #000; color: #fff; }
            .error { background: #ff0000; color: white; padding: 20px; border-radius: 10px; margin: 20px; }
          </style>
        </head>
        <body>
          <h1>🚫 Deployment Error</h1>
          <div class="error">
            <h2>Frontend build files not found!</h2>
            <p>The React application has not been built properly.</p>
            <p>Please check the build process and ensure frontend files are deployed.</p>
          </div>
          <p><strong>Expected path:</strong> ${indexPath}</p>
        </body>
      </html>
    `);
  }

  res.sendFile(indexPath);
});

const createAdminIfNeeded = async () => {
  try {
    const adminUser = await User.findOne({ username: process.env.ADMIN_USERNAME });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await User.create({
        username: process.env.ADMIN_USERNAME,
        password: hashedPassword
      });
      console.log(`✅ Admin user '${process.env.ADMIN_USERNAME}' created successfully`);
    } else {
      console.log(`ℹ️ Admin user '${process.env.ADMIN_USERNAME}' already exists`);
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Whipsaw Clone Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 API Documentation:`);
  console.log(`   POST /api/auth/login - Admin login`);
  console.log(`   GET  /api/posts - Get all blog posts`);
  console.log(`   POST /api/posts - Create new post (admin only)`);
  console.log(`   POST /api/contact - Send contact email`);

  // Create admin user if not exists
  await createAdminIfNeeded();
});
