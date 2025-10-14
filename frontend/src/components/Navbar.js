import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../style/Navbar.css";


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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
    if (user) {
      setIsDropdownOpen((prev) => !prev);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setIsDropdownOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const getDashboardPath = () => {
    if (!user) return "/login";
    const role = user.role ? user.role.toLowerCase() : 'user';

    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "staff":
      case "rider":
      case "kitchen":
      case "cashier":
        return "/staff/dashboard";
      case "user":
      default:
        return "/user/dashboard";
    }
  };

  const userRole = user?.role?.toLowerCase();

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
            
            {userRole === 'admin' || userRole === 'staff' ? (
                <>
                  <li><Link to="/staff/dashboard" onClick={() => setIsMenuOpen(false)}>Staff Dashboard</Link></li>
                  <li><Link to="/staff/orders" onClick={() => setIsMenuOpen(false)}>Orders</Link></li>
                  <li><Link to="/staff/bookings" onClick={() => setIsMenuOpen(false)}>Bookings</Link></li>
                </>
            ) : null}
          </ul>
        </div>

        {/* Right Side */}
        <div className="cr-nav-right">
          
          {/* --- UPDATE START: Add the Cart Icon for regular users --- */}
          {user && userRole === 'user' && (
            <Link to="/cart" className="cr-cart-btn" title="View your cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </Link>
          )}
          {/* --- UPDATE END --- */}

         

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
                
                <ul className="cr-dropdown-list">
                  {userRole === 'admin' || userRole === 'staff' ? (
                    <>
                      {/* Links for Admin and Staff */}
                      <li><Link to={getDashboardPath()} onClick={() => setIsDropdownOpen(false)}>Dashboard</Link></li>
                      <li><button className="cr-logout-btn" onClick={handleLogout}>Logout</button></li>
                    </>
                  ) : (
                    <>
                      {/* Links for Customers (role is 'user') */}
                      <li><Link to={getDashboardPath()} onClick={() => setIsDropdownOpen(false)}>Dashboard</Link></li>
                      <li><Link to="/user/dashboard/orders" onClick={() => setIsDropdownOpen(false)}>My Orders</Link></li>
                      <li><Link to="/user/dashboard/profile" onClick={() => setIsDropdownOpen(false)}>Profile</Link></li>
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
            aria-expanded={isDropdownOpen}
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