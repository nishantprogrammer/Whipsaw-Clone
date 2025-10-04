import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import OptimizedImage from '../common/OptimizedImage';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <OptimizedImage
          src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1920&h=1080&fit=crop"
          alt="Whipsaw Design Studio"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Main Content Area - Title Section */}
      <div className="container-custom text-center py-32 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 leading-tight"
          >
            Design & build what
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500">
              others only imagine
            </span>
          </motion.h1>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-white text-white rounded-full text-lg font-medium hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2"
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Our Work
            <ArrowDown size={20} />
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
      >
        <ArrowDown className="text-white/70" size={32} />
      </motion.div>
    </section>
  );
};

export default Hero;
