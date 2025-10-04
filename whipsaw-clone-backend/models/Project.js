const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  longDescription: {
    type: String,
    default: ''
  },
  featuredImage: {
    type: String,
    default: ''
  },
  galleryImages: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  client: {
    type: String,
    default: ''
  },
  year: {
    type: Number,
    default: () => new Date().getFullYear()
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-generate slug from title
projectSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
