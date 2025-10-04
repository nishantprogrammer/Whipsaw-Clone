import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { contactAPI } from '../../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await contactAPI.sendContactEmail(formData);
      if (response.data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Contact form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-96 h-96 bg-accent rounded-full blur-3xl top-0 right-0" />
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl bottom-0 left-0" />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-white/60 mb-4">
            Get In Touch
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Let's Create Something Amazing
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Have a project in mind? We'd love to hear about it. Send us a message
            and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name *"
                  className={`w-full px-6 py-4 bg-white/5 border ${
                    errors.name ? 'border-red-500' : 'border-white/10'
                  } rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all`}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-2">{errors.name}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email *"
                  className={`w-full px-6 py-4 bg-white/5 border ${
                    errors.email ? 'border-red-500' : 'border-white/10'
                  } rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all`}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-2">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>

            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message *"
                rows="6"
                className={`w-full px-6 py-4 bg-white/5 border ${
                  errors.message ? 'border-red-500' : 'border-white/10'
                } rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none`}
              />
              {errors.message && (
                <p className="text-red-400 text-sm mt-2">{errors.message}</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-accent text-white rounded-lg font-medium text-lg hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message <Send size={20} />
                </>
              )}
            </motion.button>

            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-green-400 bg-green-400/10 p-4 rounded-lg"
              >
                <CheckCircle size={20} />
                Message sent successfully! We'll get back to you soon.
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 bg-red-400/10 p-4 rounded-lg"
              >
                Failed to send message. Please try again.
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
