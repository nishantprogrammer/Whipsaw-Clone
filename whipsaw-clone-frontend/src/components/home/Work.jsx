import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { projectAPI } from '../../utils/api';
import OptimizedImage from '../common/OptimizedImage';

const Work = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAllProjects({ limit: 6 });
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Fall back to showing a message if no projects
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="work" className="section-padding bg-black">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-widest text-white/60 mb-4">
            Selected Work
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Award-Winning Projects
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Discover our portfolio of innovative products that push the boundaries
            of design and technology.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-black rounded-2xl overflow-hidden shadow-lg border border-gray-800 animate-pulse">
                <div className="aspect-[4/3] bg-gray-800" />
                <div className="p-8 space-y-4">
                  <div className="h-6 bg-gray-800 rounded w-32" />
                  <div className="h-8 bg-gray-700 rounded" />
                  <div className="h-4 bg-gray-800 rounded" />
                  <div className="flex flex-wrap gap-2">
                    <div className="h-6 bg-gray-800 rounded-full w-16" />
                    <div className="h-6 bg-gray-800 rounded-full w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group relative bg-black rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-800"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <OptimizedImage
                    src={project.featuredImage || `data:image/svg+xml;base64,${btoa(`
                      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
                        <rect width="800" height="600" fill="#1f2937"/>
                        <circle cx="400" cy="300" r="60" fill="#374151"/>
                        <circle cx="380" cy="285" r="8" fill="#9ca3af"/>
                        <circle cx="420" cy="285" r="8" fill="#9ca3af"/>
                        <text x="400" y="380" text-anchor="middle" fill="#d1d5db" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${project.title.slice(0, 15)}${project.title.length > 15 ? '...' : ''}</text>
                        <text x="400" y="420" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="16">${project.category}</text>
                      </svg>
                    `)}`}
                    alt={project.title}
                    className="w-full h-full hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                    loading={index < 3 ? "eager" : "lazy"}  // First 3 projects load immediately
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>

                <div className="p-8">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-medium text-accent bg-accent/10 rounded-full mb-3">
                      {project.category}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {project.title}
                    </h3>
                    <p className="text-white/70 mb-4">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags?.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-center">
                    <button className="flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all">
                      View Project <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 mb-16">
            <p className="text-xl text-white/70 mb-4">No projects available yet.</p>
            <p className="text-white/50">Check back soon for our latest innovations.</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <button className="flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-all duration-300">
            View All Projects
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Work;
