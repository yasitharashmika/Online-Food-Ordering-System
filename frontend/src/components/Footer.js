import React from 'react';
import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>CraveCorner</h3>
          <p>Delivering delicious meals straight to your doorstep. Order now for a delightful dining experience at home.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/book-table">Book Table</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul>
            <li><span role="img" aria-label="location">📍</span> 123 Food Street, Colombo</li>
            <li><span role="img" aria-label="phone">📞</span> +94 77 123 4567</li>
            <li><span role="img" aria-label="email">📧</span> info@foodexpress.lk</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 CraveCorner. All Rights Reserved. Developed by Group 05</p>
      </div>
    </footer>
  )
}
