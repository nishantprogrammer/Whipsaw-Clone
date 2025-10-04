import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Work', path: '/#work' },
    { name: 'Expertise', path: '/#expertise' },
    { name: 'About', path: '/#about' },
    { name: 'Latest', path: '/blog' },
    { name: 'Admin', path: '/admin' },
  ];

  const handleNavClick = (e, path) => {
    if (path.startsWith('/#')) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      const targetId = path.substring(2);

      if (window.location.pathname === '/') {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.location.href = path;
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-primary/80 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white">
            WHIPSAW
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={(e) => handleNavClick(e, item.path)}
                className="text-white/80 hover:text-white transition-colors relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}

            {/* Get in touch button */}
            <button
              onClick={() => handleNavClick(null, '/#contact')}
              className="px-4 py-2 border border-white/30 text-white rounded-full text-sm font-medium hover:bg-white hover:text-primary transition-all duration-300"
            >
              Get in touch
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white z-50"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { x: 0 } : { x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed top-0 right-0 w-full h-screen bg-primary md:hidden"
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isMobileMenuOpen ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleNavClick(e, item.path);
                }}
                className="text-4xl font-bold text-white hover:text-accent transition-colors"
              >
                {item.name}
              </Link>
            </motion.div>
          ))}

          {/* Mobile Get in touch button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isMobileMenuOpen ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: navItems.length * 0.1 }}
          >
            <button
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleNavClick(e, '/#contact');
              }}
              className="px-6 py-3 border border-white/30 text-white rounded-full font-medium hover:bg-white hover:text-primary transition-all duration-300"
            >
              Get in touch
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
