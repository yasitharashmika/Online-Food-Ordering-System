import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../style/Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo + Brand */}
        <div className="logo">
          <img src={logo} alt="CraveCorner Logo" />
          <span className="brand-name">CraveCorner</span>
        </div>

        {/* Nav Links */}
        <div className={`nav-links ${isMenuOpen ? 'nav-active' : ''}`}>
          <ul>
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link to="/menu" onClick={() => setIsMenuOpen(false)}>Menu</Link></li>
            <li><Link to="/book-table" onClick={() => setIsMenuOpen(false)}>Book Table</Link></li>
            <li><Link to="/track-order" onClick={() => setIsMenuOpen(false)}>Track Order</Link></li>
            <li><Link to="/notification" onClick={() => setIsMenuOpen(false)}>Notifications</Link></li>
            <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link></li> {/* ✅ Added */}
          </ul>
        </div>

        {/* Right side */}
        <div className="nav-right">
          <Link to="/login" className="user-profile">
            <svg xmlns="http://www.w3.org/2000/svg" 
              width="24" height="24" viewBox="0 0 24 24" 
              fill="none" stroke="currentColor" strokeWidth="2" 
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>

          {/* Hamburger Menu */}
          <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </div>
    </nav>
  );
}
