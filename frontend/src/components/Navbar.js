import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../style/Navbar.css";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // safe parse (prevents crashes when localStorage has invalid data)
  const getUserFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  };
  const user = getUserFromStorage();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsDropdownOpen(false);
    navigate("/login");
  };

  const handleProfileClick = (e) => {
    // toggle only when logged in; otherwise redirect to login
    if (user) {
      setIsDropdownOpen((prev) => !prev);
    } else {
      navigate("/login");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setIsDropdownOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // ⭐ UPDATED: Helper function to determine the correct dashboard path
  const getDashboardPath = () => {
    // If no user is logged in, they shouldn't see the link, but this is a safe fallback
    if (!user) return "/login";

    // Treat a missing or null role as a 'customer' for path generation
    const role = user.role ? user.role.toLowerCase() : 'customer';

    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "staff":
      case "rider":
      case "kitchen":
      case "cashier":
        return "/staff/dashboard";
      case "customer":
      default:
        // Ensures the path is correct for customers
        return "/user/dashboard";
    }
  };

  return (
    <nav className="cr-navbar">
      <div className="cr-nav-container">
        {/* Logo + Brand */}
        <div className="cr-logo">
          <img src={logo} alt="CraveCorner Logo" />
          <span className="cr-brand-name">CraveCorner</span>
        </div>

        {/* Nav Links */}
        <div className={`cr-nav-links ${isMenuOpen ? "cr-nav-active" : ""}`}>
          <ul>
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link to="/menu" onClick={() => setIsMenuOpen(false)}>Menu</Link></li>
            <li><Link to="/book-table" onClick={() => setIsMenuOpen(false)}>Book Table</Link></li>
            <li><Link to="/track-order" onClick={() => setIsMenuOpen(false)}>Track Order</Link></li>
            <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
            <li><Link to="/staff/dashboard" onClick={() => setIsMenuOpen(false)}>Staff Dashboard</Link></li>
            <li><Link to="/staff/orders" onClick={() => setIsMenuOpen(false)}>Orders</Link></li>
            <li><Link to="/staff/bookings" onClick={() => setIsMenuOpen(false)}>Bookings</Link></li>
          </ul>
        </div>

        {/* Right Side */}
        <div className="cr-nav-right">
          {user && <NotificationBell />}

          <div
            className={`cr-dropdown ${isDropdownOpen ? "cr-open" : ""}`}
            ref={dropdownRef}
          >
            <button
              className="cr-profile-btn"
              onClick={handleProfileClick}
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
              title={user ? "Open account menu" : "Login"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>

            {user && (
              <div className="cr-dropdown-menu" role="menu">
                <div className="cr-dropdown-header">
                  <div className="cr-user-name">{user.name}</div>
                  <div className="cr-user-email">{user.email}</div>
                </div>

                {/* ⭐ UPDATED: Simplified condition to check for a specific role */}
                <ul className="cr-dropdown-list">
                  {user.role === 'admin' || user.role === 'staff' ? (
                    <>
                      {/* Links for Admin and Staff */}
                      <li><Link to={getDashboardPath()} onClick={() => setIsDropdownOpen(false)}>Dashboard</Link></li>
                      <li><button className="cr-logout-btn" onClick={handleLogout}>Logout</button></li>
                    </>
                  ) : (
                    <>
                      {/* Links for Customers (users with no specific role) */}
                      <li><Link to={getDashboardPath()} onClick={() => setIsDropdownOpen(false)}>Dashboard</Link></li>
                      <li><Link to="/orders" onClick={() => setIsDropdownOpen(false)}>My Orders</Link></li>
                      <li><Link to="/profile" onClick={() => setIsDropdownOpen(false)}>Profile</Link></li>
                      <li><button className="cr-logout-btn" onClick={handleLogout}>Logout</button></li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="cr-hamburger"
            onClick={() => setIsMenuOpen((p) => !p)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className="cr-bar"></span>
            <span className="cr-bar"></span>
            <span className="cr-bar"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}