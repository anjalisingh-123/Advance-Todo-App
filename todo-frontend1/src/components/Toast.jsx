import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import '../styles/Toast.css';

const Toast = ({ toasts, onClose }) => {
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={`toast-item ${toast.type}`}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, y: -20, transition: { duration: 0.2 } }}
            layout
          >
            <div className="toast-icon">
              {toast.type === 'success' ? (
                <FaCheckCircle className="toast-icon-success" />
              ) : (
                <FaExclamationCircle className="toast-icon-error" />
              )}
            </div>
            <span className="toast-message">{toast.message}</span>
            <button
              className="toast-close-btn"
              onClick={() => onClose(toast.id)}
              aria-label="Close notification"
            >
              <FaTimes />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
