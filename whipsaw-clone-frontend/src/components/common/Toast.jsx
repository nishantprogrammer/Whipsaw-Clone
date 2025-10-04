import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, AlertTriangle, Info, XCircle } from 'lucide-react';

const Toast = ({
  message,
  type = 'info',
  isVisible = false,
  onClose,
  duration = 5000
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose && onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500',
          text: 'text-white',
          icon: <CheckCircle size={20} />,
        };
      case 'error':
        return {
          bg: 'bg-red-500',
          text: 'text-white',
          icon: <XCircle size={20} />,
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          text: 'text-white',
          icon: <AlertTriangle size={20} />,
        };
      default:
        return {
          bg: 'bg-accent',
          text: 'text-white',
          icon: <Info size={20} />,
        };
    }
  };

  const styles = getToastStyles();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
            duration: 0.2
          }}
          className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${styles.bg} ${styles.text} min-w-72`}
        >
          {styles.icon}
          <p className="flex-1 text-sm font-medium">{message}</p>
          <button
            onClick={() => {
              setShow(false);
              onClose && onClose();
            }}
            className="hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
