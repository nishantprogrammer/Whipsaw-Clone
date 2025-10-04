import { motion } from 'framer-motion';

const Partners = () => {
  const partners = [
    {
      name: 'Google',
      logo: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=200',
      industry: 'Technology'
    },
    {
      name: 'Microsoft',
      logo: 'https://images.unsplash.com/photo-1583321403636-61128e88f82d?w=200',
      industry: 'Technology'
    },
    {
      name: 'Apple',
      logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200',
      industry: 'Technology'
    },
    {
      name: 'Samsung',
      logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200',
      industry: 'Electronics'
    },
    {
      name: 'Sony',
      logo: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=200',
      industry: 'Electronics'
    },
    {
      name: 'Nike',
      logo: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200',
      industry: 'Sportswear'
    },
    {
      name: 'Tesla',
      logo: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=200',
      industry: 'Automotive'
    },
    {
      name: 'Philips',
      logo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200',
      industry: 'Healthcare'
    }
  ];

  const stats = [
    { number: '200+', label: 'Projects Completed' },
    { number: '50+', label: 'Partner Companies' },
    { number: '15+', label: 'Years Experience' },
    { number: '25+', label: 'Countries Served' }
  ];

  return (
    <section className="section-padding bg-black">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-widest text-white/60 mb-4">
            Our Partners
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            We collaborate with forward-thinking companies to create products
            that define the future of their industries.
          </p>
        </motion.div>

        {/* Partner Logos Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 items-center">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center justify-center p-6 bg-black rounded-xl hover:bg-gray-900 transition-all duration-300 border border-gray-700"
              >
                <img
                  src={`data:image/svg+xml;base64,${btoa(`
                    <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                      <rect width="64" height="64" fill="#374151" rx="8"/>
                      <text x="32" y="35" text-anchor="middle" dy="0.35em" fill="#d1d5db" font-family="Arial, sans-serif" font-size="20" font-weight="bold">${partner.name.charAt(0).toUpperCase()}</text>
                    </svg>
                  `)}`}
                  alt={partner.name}
                  className="w-16 h-16 object-contain mb-3 grayscale hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml;base64,${btoa(`
                      <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                        <rect width="64" height="64" fill="#6b7280" rx="8"/>
                        <text x="32" y="35" text-anchor="middle" dy="0.35em" fill="#d1d5db" font-family="Arial, sans-serif" font-size="18" font-weight="bold">🏢</text>
                      </svg>
                    `)}`;
                  }}
                />
                <span className="text-sm font-medium text-white text-center">
                  {partner.name}
                </span>
                <span className="text-xs text-white/70 mt-1">
                  {partner.industry}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-primary text-white p-16 rounded-2xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="text-4xl md:text-5xl font-bold text-accent mb-2">
                  {stat.number}
                </h3>
                <p className="text-white/80 text-sm uppercase tracking-wide">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            Join Our Partner Network
          </h3>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Be part of the companies shaping tomorrow's products.
            Let's explore how we can work together.
          </p>
          <button className="px-8 py-4 bg-accent text-white rounded-full font-medium hover:bg-accent/90 transition-all duration-300">
            Become a Partner
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
