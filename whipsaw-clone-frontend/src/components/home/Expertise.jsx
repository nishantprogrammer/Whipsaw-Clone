import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

const Expertise = () => {
  const services = [
    {
      title: 'Product Design',
      description: 'End-to-end product development from concept to manufacturing',
      features: ['Concept Development', '3D Modeling', 'Prototyping', 'Testing & Validation']
    },
    {
      title: 'UX/UI Design',
      description: 'Human-centered design solutions for digital experiences',
      features: ['User Research', 'Interaction Design', 'Visual Design', 'Usability Testing']
    },
    {
      title: 'Brand Strategy',
      description: 'Strategic brand development and identity systems',
      features: ['Brand Positioning', 'Visual Identity', 'Brand Guidelines', 'Launch Strategy']
    },
    {
      title: 'Design Engineering',
      description: 'Technical design solutions for complex product challenges',
      features: ['Mechanical Engineering', 'Materials Science', 'Manufacturing', 'Quality Assurance']
    }
  ];

  return (
    <section id="expertise" className="section-padding bg-black">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-widest text-white/60 mb-4">
            Our Expertise
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Full-Service Design Solutions
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            From initial concept to final product, we offer comprehensive design services
            that transform ideas into market-ready solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-black p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-800"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                {service.title}
              </h3>
              <p className="text-white/70 mb-6">
                {service.description}
              </p>

              <ul className="space-y-3 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <CheckCircle className="text-accent" size={20} />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all">
                Learn More <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center bg-black p-12 rounded-2xl shadow-lg border border-gray-800"
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Project?
          </h3>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Let's discuss how our expertise can bring your vision to life.
            Every great product starts with a conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-accent text-white rounded-full font-medium hover:bg-accent/90 transition-all duration-300">
              Start a Project
            </button>
            <button className="px-8 py-4 border-2 border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-all duration-300">
              View Our Process
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Expertise;
