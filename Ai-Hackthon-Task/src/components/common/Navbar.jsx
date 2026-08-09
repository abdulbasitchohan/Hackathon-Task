import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  RiHomeLine,
  RiDashboardLine,
  RiUserLine,
  RiLogoutBoxLine,
  RiShieldStarLine,
  RiSettingsLine,
  RiChatAiLine,
  RiCalendarLine,
  RiRestaurantLine,
  RiRunLine,
  RiMenuLine,
  RiCloseLine
} from '@remixicon/react';

const Navbar = () => {
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Navigation links
  const navLinks = user ? [
    { to: '/', label: 'Home', icon: <RiHomeLine size={18} /> },
    { to: '/dashboard', label: 'Dashboard', icon: <RiDashboardLine size={18} /> },
    { to: '/diet-plan', label: 'Diet', icon: <RiRestaurantLine size={18} /> },
    { to: '/workout-plan', label: 'Workout', icon: <RiRunLine size={18} /> },
    { to: '/habits', label: 'Habits', icon: <RiCalendarLine size={18} /> },
    { to: '/chat', label: 'AI Chat', icon: <RiChatAiLine size={18} /> },
    { to: '/profile', label: 'Profile', icon: <RiUserLine size={18} /> },
  ] : [];

  if (isAdmin) {
    navLinks.push({ to: '/admin', label: 'Admin', icon: <RiSettingsLine size={18} /> });
  }

  if (!user) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            <RiShieldStarLine size={28} className="brand-icon" />
            <span className="brand-gold">AI</span>
            <span className="brand-text">Fitness</span>
          </Link>
          
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
          </button>

          <ul className={`nav-links ${isMenuOpen ? 'nav-links-open' : ''}`}>
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeMenu}>🏠 Home</Link></li>
            <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
            <li><Link to="/register" onClick={closeMenu}>Register</Link></li>
          </ul>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <RiShieldStarLine size={28} className="brand-icon" />
          <span className="brand-gold">AI</span>
          <span className="brand-text">Fitness</span>
        </Link>

        {/* Hamburger Menu Button - Hidden on desktop */}
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
        </button>

        {/* Navigation Links */}
        <ul className={`nav-links ${isMenuOpen ? 'nav-links-open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link 
                to={link.to} 
                className={location.pathname === link.to ? 'active' : ''}
                onClick={closeMenu}
              >
                {link.icon}
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <button onClick={() => { signOut(); closeMenu(); }} className="logout-btn">
              <RiLogoutBoxLine size={18} />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;