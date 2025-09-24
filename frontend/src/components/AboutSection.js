import React from 'react';
import '../style/AboutSection.css'; // Relative path to CSS

function AboutSection() {
  return (
    <div className="card">
      <h3>About Our Restaurant</h3>
      <div className="about-grid">
        <div className="about-text">
          <p>
            We serve delicious meals made from fresh ingredients. Our chefs are passionate about creating memorable dining experiences for our customers.
          </p>
          <div className="about-details">
            <h4>Opening Hours</h4>
            <p>Monday-Friday: 9am - 10pm</p>
            <p>Saturday-Sunday: 10am - 11pm</p>
          </div>
          <div className="about-details">
            <h4>Address</h4>
            <p>123 Food Street, Colombo, Sri Lanka</p>
          </div>
        </div>
        <div className="about-map">
          <div className="map-placeholder">
            <p>Map Embed Here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;