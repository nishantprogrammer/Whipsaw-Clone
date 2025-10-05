import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000, // Increased from 10s to 30s for Render cold starts
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token');

      // Only redirect if not already on admin page
      if (window.location.pathname !== '/admin') {
        window.location.href = '/admin';
      }
      // If already on admin page, just continue (let component handle it)
    }
    return Promise.reject(error);
  }
);
export const postAPI = {
  // Get all posts
  getAllPosts: () => api.get('/posts'),

  // Get post by slug
  getPostBySlug: (slug) => api.get(`/posts/${slug}`),

  // Create new post
  createPost: (postData) => api.post('/posts', postData),

  // Update post
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),

  // Delete post
  deletePost: (id) => api.delete(`/posts/${id}`),

  // Clear all posts
  clearAllPosts: () => api.delete('/posts/'),

  // Upload image
  uploadImage: (formData) => {
    return axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
      timeout: 45000, // Increased for image uploads
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true,
    }).post('/posts/upload-image', formData);
  },
};

export const projectAPI = {
  // Get all projects (published)
  getAllProjects: (params) => api.get('/projects', { params }),

  // Get all projects for admin
  getAllProjectsAdmin: () => api.get('/projects/admin/all'),

  // Get project by slug
  getProjectBySlug: (slug) => api.get(`/projects/${slug}`),

  // Get projects by category
  getProjectsByCategory: (category) => api.get(`/projects/category/${category}`),

  // Create new project
  createProject: (projectData) => api.post('/projects', projectData),

  // Update project
  updateProject: (id, projectData) => api.put(`/projects/${id}`, projectData),

  // Delete project
  deleteProject: (id) => api.delete(`/projects/${id}`),

  // Upload project image
  uploadImage: (formData) => {
    return axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
      timeout: 45000, // Increased for image uploads
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true,
    }).post('/projects/upload-image', formData);
  },
};

export const contactAPI = {
  // Send contact email
  sendContactEmail: (contactData) => api.post('/contact', contactData),
};

export const authAPI = {
  // Admin login
  login: (credentials) => api.post('/auth/login', credentials),

  // Verify token
  verifyToken: () => api.get('/auth/verify'),
};

export default api;
