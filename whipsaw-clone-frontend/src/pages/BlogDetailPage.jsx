import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { postAPI } from '../utils/api';
import OptimizedImage from '../components/common/OptimizedImage';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postAPI.getPostBySlug(slug);
      setPost(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Post not found or failed to load.');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20">
        <div className="container-custom max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-8"></div>
            <div className="h-16 bg-gray-800 rounded w-full mb-6"></div>
            <div className="h-6 bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-800 rounded w-5/6"></div>
              <div className="h-4 bg-gray-800 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20">
        <div className="container-custom max-w-4xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
            <p className="text-white/70 mb-8">{error || 'The requested blog post could not be found.'}</p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <article className="container-custom max-w-4xl">
        {/* Back to Blog Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="mb-6">
            <OptimizedImage
              src={post.featuredImage || `data:image/svg+xml;base64,${btoa(`
                <svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600">
                  <rect width="1200" height="600" fill="#1f2937"/>
                  <circle cx="600" cy="300" r="80" fill="#374151"/>
                  <circle cx="570" cy="270" r="12" fill="#9ca3af"/>
                  <circle cx="630" cy="270" r="12" fill="#9ca3af"/>
                  <rect x="540" y="340" width="120" height="12" rx="6" fill="#9ca3af"/>
                  <text x="600" y="420" text-anchor="middle" fill="#d1d5db" font-family="Arial, sans-serif" font-size="36" font-weight="bold">${post.title.slice(0, 30)}${post.title.length > 30 ? '...' : ''}</text>
                  <text x="600" y="460" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="24">${post.author}</text>
                </svg>
              `)}`}
              alt={post.title}
              className="w-full h-64 md:h-96 rounded-xl mb-8"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              loading="eager"
              placeholder={true}
            />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-white/60 mb-8">
            <span className="flex items-center gap-2">
              <User size={16} />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {formatDate(post.createdAt)}
            </span>
          </div>

          {post.excerpt && (
            <p className="text-xl text-white/80 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </motion.header>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg prose-invert max-w-none"
        >
          <div
            className="text-white/90 leading-relaxed text-lg space-y-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>

        {/* Article Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-8 border-t border-gray-800"
        >
          <div className="flex items-center justify-between">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
            <div className="text-white/50 text-sm">
              Published {formatDate(post.createdAt)}
            </div>
          </div>
        </motion.footer>
      </article>
    </div>
  );
};

export default BlogDetailPage;
