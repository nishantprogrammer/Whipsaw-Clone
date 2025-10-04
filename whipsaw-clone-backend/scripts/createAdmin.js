const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });

    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create new admin user
    const admin = new User({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123'
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log(`Username: ${admin.username}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log('');
    console.log(' You can now login at: http://localhost:5173/admin');
    process.exit(0);
  } catch (error) {
    console.error(' Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
