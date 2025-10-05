import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, LogOut, Plus, Edit, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import { authAPI, postAPI, projectAPI } from '../utils/api';
import Toast from '../components/common/Toast';
import ConfirmationModal from '../components/common/ConfirmationModal';

const PostForm = ({ onSuccess, editingPost = null, isEditing = false, showToast, baseImgURL }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: 'WhipSaw Admin',
    status: 'draft',
    featuredImage: '',
    slug: ''
  });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  // Initialize form data when editing
  useEffect(() => {
    if (isEditing && editingPost) {
      setFormData({
        title: editingPost.title || '',
        content: editingPost.content || '',
        excerpt: editingPost.excerpt || '',
        author: editingPost.author || 'WhipSaw Admin',
        status: editingPost.status || 'draft',
        featuredImage: editingPost.featuredImage || '',
        slug: editingPost.slug || ''
      });
      if (editingPost.featuredImage) {
        setUploadedImageUrl(editingPost.featuredImage);
      }
    } else if (!isEditing) {
      // Reset form for new posts
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        author: 'WhipSaw Admin',
        status: 'draft',
        featuredImage: '',
        slug: ''
      });
      setUploadedImageUrl('');
    }
  }, [editingPost, isEditing]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Generate slug from title if not manually set
      const slug = formData.slug || generateSlug(formData.title);

      if (isEditing && editingPost) {
        // Update existing post
        await postAPI.updatePost(editingPost._id, {
          ...formData,
          slug
        });
        showToast('Post updated successfully!', 'success');
      } else {
        // Create new post
        await postAPI.createPost({
          ...formData,
          slug
        });
        showToast('Post created successfully!', 'success');
      }

      if (!isEditing) {
        // Reset form for new posts
        setFormData({
          title: '',
          content: '',
          excerpt: '',
          author: 'WhipSaw Admin',
          status: 'draft',
          featuredImage: '',
          slug: ''
        });
        setUploadedImageUrl('');
      }

      onSuccess && onSuccess();
    } catch (error) {
      console.error('Error saving post:', error);
      showToast('Failed to save post. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'warning');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be less than 5MB', 'warning');
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await postAPI.uploadImage(formData);
      const imageUrl = response.data.imageUrl;

      setFormData(prev => ({ ...prev, featuredImage: imageUrl }));
      setUploadedImageUrl(imageUrl);
      showToast('Image uploaded successfully!', 'success');
    } catch (error) {
      console.error('Image upload error:', error);
      showToast('Failed to upload image. Please try again.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
            placeholder="Enter post title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Author</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
            placeholder="Post author"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Slug (URL)</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
          placeholder="post-url-slug"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Featured Image</label>

        {/* Image Upload Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent file:text-white hover:file:bg-accent/90"
              disabled={uploadingImage}
            />
            {uploadingImage && (
              <p className="text-accent text-sm mt-1">Uploading image...</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Or Enter Image URL</label>
            <input
              type="url"
              value={formData.featuredImage}
              onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Image Preview */}
          {uploadedImageUrl && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">Image Preview</label>
              <div className="relative inline-block">
                <img
                  src={`${baseImgURL}${uploadedImageUrl}`}
                  alt="Uploaded blog image"
                  className="max-w-full h-32 object-cover rounded-lg border border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, featuredImage: '' });
                    setUploadedImageUrl('');
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Excerpt (Short Description)</label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent resize-vertical"
          placeholder="Brief summary of the post (optional)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Content *</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={10}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent resize-vertical"
          placeholder="Write your blog post content here..."
          required
        />
        <p className="text-xs text-white/50 mt-1">HTML and Markdown supported</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {saving ? 'Saving...' : (
            isEditing ? 'Update Post' : 'Create Post'
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setFormData({
              title: '',
              content: '',
              excerpt: '',
              author: 'WhipSaw Admin',
              status: 'draft',
              featuredImage: '',
              slug: ''
            });
          }}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <X size={16} />
          Clear Form
        </button>
      </div>
    </form>
  );
};

const ProjectForm = ({ onSuccess, editingProject = null, isEditing = false, showToast, baseImgURL }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Consumer Electronics',
    tags: [],
    client: '',
    year: new Date().getFullYear(),
    isFeatured: false,
    status: 'published',
    featuredImage: ''
  });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Initialize form data when editing
  useEffect(() => {
    if (isEditing && editingProject) {
      setFormData({
        title: editingProject.title || '',
        description: editingProject.description || '',
        category: editingProject.category || 'Consumer Electronics',
        tags: editingProject.tags || [],
        client: editingProject.client || '',
        year: editingProject.year || new Date().getFullYear(),
        isFeatured: editingProject.isFeatured || false,
        status: editingProject.status || 'published',
        featuredImage: editingProject.featuredImage || ''
      });
      if (editingProject.featuredImage) {
        setUploadedImageUrl(editingProject.featuredImage);
      }
    } else if (!isEditing) {
      // Reset form for new projects
      setFormData({
        title: '',
        description: '',
        category: 'Consumer Electronics',
        tags: [],
        client: '',
        year: new Date().getFullYear(),
        isFeatured: false,
        status: 'published',
        featuredImage: ''
      });
      setUploadedImageUrl('');
    }
  }, [editingProject, isEditing]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEditing && editingProject) {
        // Update existing project
        await projectAPI.updateProject(editingProject._id, {
          ...formData,
          slug: generateSlug(formData.title)
        });
        showToast('Project updated successfully!', 'success');
      } else {
        // Create new project
        await projectAPI.createProject({
          ...formData,
          slug: generateSlug(formData.title)
        });
        showToast('Project created successfully!', 'success');
      }

      if (!isEditing) {
        // Reset form for new projects
        setFormData({
          title: '',
          description: '',
          category: 'Consumer Electronics',
          tags: [],
          client: '',
          year: new Date().getFullYear(),
          isFeatured: false,
          status: 'published',
          featuredImage: ''
        });
        setTagInput('');
      }

      onSuccess && onSuccess();
    } catch (error) {
      console.error('Error saving project:', error);
      showToast('Failed to save project. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'warning');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be less than 5MB', 'warning');
      return;
    }

    setUploadingImage(true);

    try {
      const formDataImg = new FormData();
      formDataImg.append('image', file);

      const response = await projectAPI.uploadImage(formDataImg);
      const imageUrl = response.data.imageUrl;

      setFormData(prev => ({ ...prev, featuredImage: imageUrl }));
      setUploadedImageUrl(imageUrl);
      showToast('Image uploaded successfully!', 'success');
    } catch (error) {
      console.error('Image upload error:', error);
      showToast('Failed to upload image. Please try again.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
            placeholder="Enter project title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent"
          >
            <option value="Consumer Electronics">Consumer Electronics</option>
            <option value="Healthcare Technology">Healthcare Technology</option>
            <option value="Transportation">Transportation</option>
            <option value="Industrial">Industrial</option>
            <option value="Smart Home">Smart Home</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent resize-vertical"
          placeholder="Brief project description"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Client</label>
          <input
            type="text"
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
            placeholder="Client company name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Year</label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
            placeholder="2024"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Tags</label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
              placeholder="Add tag and press Enter"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent/90"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-accent hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Featured Image</label>
        <div className="space-y-4">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent file:text-white hover:file:bg-accent/90"
              disabled={uploadingImage}
            />
            {uploadingImage && (
              <p className="text-accent text-sm mt-1">Uploading image...</p>
            )}
          </div>

          <div>
            <input
              type="url"
              value={formData.featuredImage}
              onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {uploadedImageUrl && (
            <div className="mb-4">
              <div className="relative inline-block">
                <img
                  src={`${baseImgURL}${uploadedImageUrl}`}
                  alt="Uploaded project image"
                  className="max-w-full h-32 object-cover rounded-lg border border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, featuredImage: '' });
                    setUploadedImageUrl('');
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  title="Remove image"
                >
                  ×
                </button>
                <p className="text-xs text-green-400 mt-1">✓ Project image uploaded</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="w-4 h-4 text-accent bg-gray-800 border-gray-700 rounded focus:ring-accent"
          />
          <span className="text-white text-sm">Featured Project</span>
        </label>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {saving ? 'Saving...' : (
            isEditing ? 'Update Project' : 'Create Project'
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setFormData({
              title: '',
              description: '',
              category: 'Consumer Electronics',
              tags: [],
              client: '',
              year: new Date().getFullYear(),
              isFeatured: false,
              status: 'published',
              featuredImage: ''
            });
            setTagInput('');
          }}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
        >
          Clear Form
        </button>
      </div>
    </form>
  );
};

const AdminPage = () => {
  const baseImgURL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const [showPassword, setShowPassword] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Delete',
    onConfirm: null
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast({ message: '', type: 'info', visible: false });
    }, 4000);
  };

  const checkAuthStatus = async () => {
    try {
      // Check if we have a token first
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      await authAPI.verifyToken();
      setIsAuthenticated(true);
      await Promise.all([fetchPosts(), fetchProjects()]);
    } catch (error) {
      console.log('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await postAPI.getAllPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAllProjectsAdmin();
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(loginData);
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      setLoginError('');
      await Promise.all([fetchPosts(), fetchProjects()]);
    } catch (error) {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setPosts([]);
    setProjects([]);
  };

  const editPost = (post) => {
    setEditingPost(post);
    setActiveTab('edit-post');
  };

  const editProject = (project) => {
    setEditingProject(project);
    setActiveTab('edit-project');
  };

  const deletePost = async (postId) => {
    const post = posts.find(p => p._id === postId);
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Post',
      message: `Are you sure you want to delete "${post?.title || 'this post'}"? This action cannot be undone and will also remove its featured image.`,
      confirmText: 'Delete Post',
      onConfirm: async () => {
        try {
          await postAPI.deletePost(postId);
          showToast('Post deleted successfully!', 'success');
          fetchPosts();
        } catch (error) {
          console.error('Error deleting post:', error);
          showToast('Failed to delete post. Please try again.', 'error');
        }
      }
    });
  };

  const deleteProject = async (projectId) => {
    const project = projects.find(p => p._id === projectId);
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Project',
      message: `Are you sure you want to delete "${project?.title || 'this project'}"? This action cannot be undone and will also remove its featured image.`,
      confirmText: 'Delete Project',
      onConfirm: async () => {
        try {
          await projectAPI.deleteProject(projectId);
          showToast('Project deleted successfully!', 'success');
          fetchProjects();
        } catch (error) {
          console.error('Error deleting project:', error);
          showToast('Failed to delete project. Please try again.', 'error');
        }
      }
    });
  };

  const clearAllProjects = async () => {
    setConfirmationModal({
      isOpen: true,
      title: 'Clear All Projects',
      message: `Are you sure you want to delete ALL ${projects.length} projects and their images? This action cannot be undone!`,
      confirmText: 'Clear All',
      onConfirm: async () => {
        try {
          const deletePromises = projects.map(project =>
            projectAPI.deleteProject(project._id)
          );
          await Promise.all(deletePromises);
          showToast('All projects cleared successfully!', 'success');
          fetchProjects();
        } catch (error) {
          console.error('Error clearing projects:', error);
          showToast('Failed to clear projects. Please try again.', 'error');
        }
      }
    });
  };

  const handleConfirmModalClose = () => {
    setConfirmationModal({
      isOpen: false,
      title: '',
      message: '',
      confirmText: 'Delete',
      onConfirm: null
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20 flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800"
          >
            <h1 className="text-3xl font-bold text-white mb-6 text-center">Admin Login</h1>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {loginError && (
                <p className="text-red-400 text-sm text-center">{loginError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
              >
                <LogIn size={20} />
                Login
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setConfirmationModal({
                  isOpen: true,
                  title: 'Clear All Posts',
                  message: `Are you sure you want to delete ALL ${posts.length} posts and their images? This action cannot be undone!`,
                  confirmText: 'Clear All',
                  onConfirm: async () => {
                    try {
                      await postAPI.clearAllPosts();
                      showToast('All posts cleared successfully!', 'success');
                      fetchPosts();
                    } catch (error) {
                      console.error('Error clearing posts:', error);
                      showToast('Failed to clear posts', 'error');
                    }
                  }
                });
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear All Posts
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 md:flex md:flex-row gap-4 mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'bg-accent text-white'
                  : 'bg-gray-800 text-white/70 hover:bg-gray-700'
              }`}
            >
              Posts ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'new'
                  ? 'bg-accent text-white'
                  : 'bg-gray-800 text-white/70 hover:bg-gray-700'
              }`}
            >
              <Plus size={16} className="inline mr-2" />
              New Post
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'projects'
                  ? 'bg-accent text-white'
                  : 'bg-gray-800 text-white/70 hover:bg-gray-700'
              }`}
            >
              Projects ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('new-project')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'new-project'
                  ? 'bg-accent text-white'
                  : 'bg-gray-800 text-white/70 hover:bg-gray-700'
              }`}
            >
              <Plus size={16} className="inline mr-2" />
              New Project
            </button>
          </div>
        </div>

        {/* Posts Table */}
        {activeTab === 'posts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-medium">Title</th>
                    <th className="px-6 py-4 text-left text-white font-medium">Author</th>
                    <th className="px-6 py-4 text-left text-white font-medium">Status</th>
                    <th className="px-6 py-4 text-left text-white font-medium">Date</th>
                    <th className="px-6 py-4 text-left text-white font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post._id} className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-white">{post.title}</td>
                      <td className="px-6 py-4 text-white/70">{post.author}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === 'published'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/70">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                            className="p-2 text-white/70 hover:text-white transition-colors"
                            title="View Post"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => editPost(post)}
                            className="p-2 text-white/70 hover:text-white transition-colors"
                            title="Edit Post"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deletePost(post._id)}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete Post"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* New Post Form */}
        {activeTab === 'new' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 p-8 rounded-xl border border-gray-800"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Create New Post</h2>
            <PostForm onSuccess={fetchPosts} showToast={showToast} baseImgURL={baseImgURL} />
          </motion.div>
        )}

        {/* Projects Table */}
        {activeTab === 'projects' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800"
          >
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Projects Management</h3>
                <button
                  onClick={clearAllProjects}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Clear All Projects
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-medium">Title</th>
                    <th className="px-6 py-4 text-left text-white font-medium">Category</th>
                    <th className="px-6 py-4 text-left text-white font-medium">Client</th>
                    <th className="px-6 py-4 text-left text-white font-medium">Status</th>
                    <th className="px-6 py-4 text-left text-white font-medium">Featured</th>
                    <th className="px-6 py-4 text-left text-white font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project._id} className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-white font-medium">{project.title}</td>
                      <td className="px-6 py-4 text-white/70">{project.category}</td>
                      <td className="px-6 py-4 text-white/70">{project.client || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === 'published'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.isFeatured
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {project.isFeatured ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => window.open('/#work', '_blank')}
                            className="p-2 text-white/70 hover:text-white transition-colors"
                            title="View Project"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => editProject(project)}
                            className="p-2 text-white/70 hover:text-white transition-colors"
                            title="Edit Project"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteProject(project._id)}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {projects.length === 0 && (
              <div className="p-12 text-center text-white/50">
                <p>No projects available yet.</p>
                <p className="text-sm mt-2">Click "New Project" to create your first project.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* New Project Form */}
        {activeTab === 'new-project' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 p-8 rounded-xl border border-gray-800"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Create New Project</h2>
            <ProjectForm onSuccess={fetchProjects} showToast={showToast} baseImgURL={baseImgURL} />
          </motion.div>
        )}

        {/* Edit Post Form */}
        {activeTab === 'edit-post' && editingPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 p-8 rounded-xl border border-gray-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Edit Post: {editingPost.title}</h2>
              <button
                onClick={() => {
                  setEditingPost(null);
                  setActiveTab('posts');
                }}
                className="text-white/70 hover:text-white transition-colors"
                title="Cancel Edit"
              >
                <X size={20} />
              </button>
            </div>
            <PostForm
              isEditing={true}
              editingPost={editingPost}
              onSuccess={() => {
                setEditingPost(null);
                setActiveTab('posts');
                fetchPosts();
              }}
              showToast={showToast}
              baseImgURL={baseImgURL}
            />
          </motion.div>
        )}

        {/* Edit Project Form */}
        {activeTab === 'edit-project' && editingProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 p-8 rounded-xl border border-gray-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Edit Project: {editingProject.title}</h2>
              <button
                onClick={() => {
                  setEditingProject(null);
                  setActiveTab('projects');
                }}
                className="text-white/70 hover:text-white transition-colors"
                title="Cancel Edit"
              >
                <X size={20} />
              </button>
            </div>

            <ProjectForm
              isEditing={true}
              editingProject={editingProject}
              onSuccess={() => {
                setEditingProject(null);
                setActiveTab('projects');
                fetchProjects();
              }}
              baseImgURL={baseImgURL}
            />
          </motion.div>
        )}

        {/* Toast Notifications */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.visible}
          onClose={() => setToast({ message: '', type: 'info', visible: false })}
        />

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={handleConfirmModalClose}
          onConfirm={confirmationModal.onConfirm}
          title={confirmationModal.title}
          message={confirmationModal.message}
          confirmText={confirmationModal.confirmText}
        />
      </div>
    </div>
  );
};

export default AdminPage;
