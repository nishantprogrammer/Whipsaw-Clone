import { motion } from 'framer-motion';
import { Award, Users, Trophy, Target, Lightbulb, Zap } from 'lucide-react';

const About = () => {
  const stats = [
    {
      number: '200+',
      label: 'Projects Completed',
      icon: Target,
      color: 'text-blue-400'
    },
    {
      number: '15',
      label: 'Years Experience',
      icon: Award,
      color: 'text-green-400'
    },
    {
      number: '50+',
      label: 'Global Awards',
      icon: Trophy,
      color: 'text-yellow-400'
    }
  ];

  const coreValues = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Pushing boundaries with cutting-edge design solutions'
    },
    {
      icon: Zap,
      title: 'Excellence',
      description: 'Delivering unmatched quality in every project'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Building partnerships that drive extraordinary results'
    }
  ];

  return (
    <section id="about" className="section-padding bg-black">
      <div className="container-custom">
        {/* Main About Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <p className="text-sm uppercase tracking-widest text-white/60 mb-4">
            About Whipsaw
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            We Transform Ideas Into Reality
          </h2>

          <p className="text-lg text-white/70 mb-8 leading-relaxed">
            For over 15 years, Whipsaw has been at the forefront of product design,
            creating innovative solutions that blend form and function seamlessly.
            Our multidisciplinary team brings together industrial designers, engineers,
            and strategists to deliver exceptional results.
          </p>

          <p className="text-lg text-white/70 mb-12 leading-relaxed">
            We believe that great design is not just about aesthetics—it's about
            solving real problems and creating meaningful experiences that resonate
            with people on a human level.
          </p>
        </motion.div>

        {/* Enhanced Stats with Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className={`${stat.color} w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center border border-gray-700 group-hover:border-gray-600 transition-colors`}>
                <stat.icon size={28} className="opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-accent mb-2">
                {stat.number}
              </h3>
              <p className="text-sm text-white/80 uppercase tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Core Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Our Core Values
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:transform hover:translate-y-[-4px]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <value.icon size={24} className="text-accent" />
                  </div>
                  <h4 className="text-xl font-bold text-white">
                    {value.title}
                  </h4>
                </div>
                <p className="text-white/70 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
