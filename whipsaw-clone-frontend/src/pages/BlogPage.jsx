import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { postAPI } from '../utils/api';
import OptimizedImage from '../components/common/OptimizedImage';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postAPI.getAllPosts();
      // Filter only published posts
      const publishedPosts = response.data.filter(post => post.status === 'published');
      setPosts(publishedPosts);
      setError(null);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Our Blog
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Insights, stories, and perspectives on design, innovation, and creativity.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-900 rounded-xl overflow-hidden shadow-lg animate-pulse">
                <div className="aspect-video bg-gray-800" />
                <div className="p-6 space-y-4">
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-800 rounded w-20" />
                    <div className="h-4 bg-gray-800 rounded w-24" />
                  </div>
                  <div className="h-6 bg-gray-800 rounded w-3/4" />
                  <div className="h-4 bg-gray-800 rounded" />
                  <div className="h-4 bg-gray-800 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-xl text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchPosts}
              className="px-6 py-3 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="aspect-video overflow-hidden bg-gray-800">
                  <OptimizedImage
                    src={post.featuredImage || `data:image/svg+xml;base64,${btoa(`
                      <svg width="800" height="450" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
                        <rect width="800" height="450" fill="#1f2937"/>
                        <circle cx="400" cy="225" r="60" fill="#374151"/>
                        <circle cx="380" cy="210" r="8" fill="#9ca3af"/>
                        <circle cx="420" cy="210" r="8" fill="#9ca3af"/>
                        <rect x="370" y="250" width="60" height="8" rx="4" fill="#9ca3af"/>
                        <text x="400" y="320" text-anchor="middle" fill="#d1d5db" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${post.title.slice(0, 20)}${post.title.length > 20 ? '...' : ''}</text>
                        <text x="400" y="460" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="16">${post.author}</text>
                      </svg>
                    `)}`}
                    alt={post.title}
                    className="w-full h-full hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading={index < 3 ? "eager" : "lazy"}  // First 3 posts load immediately
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
                    <span>{post.author}</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-white/70 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
                  >
                    Read More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-white/70 mb-4">No blog posts available yet.</p>
            <p className="text-white/50">Check back soon for our latest insights on design and innovation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
