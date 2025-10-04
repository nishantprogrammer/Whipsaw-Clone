import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Portfolio = () => {
  const projects = [
    {
      id: 1,
      title: 'Smart Home Hub',
      category: 'Consumer Tech',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800',
      description: 'Next-generation home automation interface'
    },
    {
      id: 2,
      title: 'Medical Device',
      category: 'Healthcare',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      description: 'Revolutionary patient monitoring system'
    },
    {
      id: 3,
      title: 'Electric Vehicle',
      category: 'Automotive',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
      description: 'Sustainable transportation solution'
    },
    {
      id: 4,
      title: 'Wearable Tech',
      category: 'Consumer Tech',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      description: 'Advanced fitness tracking device'
    },
    {
      id: 5,
      title: 'Industrial Robot',
      category: 'Industrial',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
      description: 'Precision manufacturing automation'
    },
    {
      id: 6,
      title: 'Audio System',
      category: 'Consumer Electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      description: 'Premium wireless speaker design'
    }
  ];

  return (
    <section id="work" className="section-padding bg-black">
      <div className="container-custom">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-white/60 mb-4">
            Our Work
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Featured Projects
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Explore our portfolio of award-winning designs that push the boundaries
            of innovation and creativity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -12 }}
              className="group relative overflow-hidden rounded-xl cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
              </div>

              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent flex flex-col justify-end p-6"
              >
                <span className="text-accent text-sm uppercase tracking-wide mb-2">
                  {project.category}
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-white/80 mb-4">
                  {project.description}
                </p>
                <button className="flex items-center gap-2 text-white hover:text-accent transition-colors">
                  View Project <ArrowRight size={16} />
                </button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
