import { memo } from 'react';
import { motion } from 'framer-motion';
import { FaCheckDouble, FaSun, FaMoon, FaUserCircle } from 'react-icons/fa';
import '../styles/Navbar.css';

const Navbar = ({ isDarkMode, onToggleTheme, addToast, user, onLogout }) => {
  const handleComingSoon = (e, featureName) => {
    e.preventDefault();
    if (addToast) {
      addToast(`${featureName} feature is coming soon!`, 'error');
    }
  };

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="navbar-container">
        <div className="navbar-brand">
          <FaCheckDouble className="navbar-logo-icon" />
          <span className="navbar-logo-text">TaskFlow</span>
        </div>
        <div className="navbar-right">
          {user && (
            <>
              <ul className="navbar-links">
                <li><a href="/" className="navbar-link active">Tasks</a></li>
                <li>
                  <a 
                    href="#analytics" 
                    className="navbar-link"
                    onClick={(e) => handleComingSoon(e, 'Analytics')}
                  >
                    Analytics
                  </a>
                </li>
              </ul>
              <span className="navbar-user">
                <FaUserCircle aria-hidden="true" /> {user.username}
              </span>
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </>
          )}
          <button 
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default memo(Navbar);
