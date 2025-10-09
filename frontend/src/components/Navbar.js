import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../style/Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user")); // check login

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    setIsDropdownOpen(false); // close dropdown on logout
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            <li>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            </li>
            <li>
              <Link to="/menu" onClick={() => setIsMenuOpen(false)}>Menu</Link>
            </li>
            <li>
              <Link to="/book-table" onClick={() => setIsMenuOpen(false)}>Book Table</Link>
            </li>
            <li>
              <Link to="/track-order" onClick={() => setIsMenuOpen(false)}>Track Order</Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            </li>
             <li>
              <Link to="/Rider-Dashboard" onClick={() => setIsMenuOpen(false)}>Rider Dashboard</Link>
            </li>
          </ul>
        </div>

        {/* Right side */}
        <div className="nav-right">
          <div className={`dropdown ${isDropdownOpen ? 'show' : ''}`} ref={dropdownRef}>
            <button
              className="profile-btn"
              onClick={() => {
                if (user) {
                  setIsDropdownOpen((prev) => !prev); // toggle dropdown ONLY on click
                } else {
                  navigate("/login");
                }
              }}
            >
              {/* Always show icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>

            {user && (
              <div className="dropdown-content">
                <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)}>Dashboard</Link>
                <Link to="/orders" onClick={() => setIsDropdownOpen(false)}>Orders</Link>
                <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>Profile</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>

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