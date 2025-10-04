import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container-custom py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-bold mb-4">WHIPSAW</div>
            <p className="text-white/60 text-sm mb-6">
              Designing tomorrow's products with innovation and creativity.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Dribbble
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/#about" className="text-white/60 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/#services" className="text-white/60 hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/#work" className="text-white/60 hover:text-white transition-colors">Work</Link></li>
              <li><Link to="/blog" className="text-white/60 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/#contact" className="text-white/60 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-white/60">Product Design</li>
              <li className="text-white/60">UX/UI Design</li>
              <li className="text-white/60">Branding</li>
              <li className="text-white/60">Strategy</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-white/60">hello@whipsaw.com</li>
              <li className="text-white/60">+1 (555) 123-4567</li>
              <li className="text-white/60">123 Design Street<br />San Francisco, CA 94105</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container-custom py-8">
          <p className="text-center text-white/50 text-sm">
            © 2025 Whipsaw Clone. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
