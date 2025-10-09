import React from 'react';
import '../style/AboutSection.css';

function AboutSection() {
  return (
    <div className="crave-about-section">
      <div className="card crave-about-card">
        <h3>About Our Restaurant</h3>
        <div className="crave-about-grid">
          <div className="crave-about-text">
            <p>
              We serve delicious meals made from fresh ingredients. Our chefs are passionate about creating memorable dining experiences for our customers.
            </p>
            <div className="crave-about-details">
              <h4>Opening Hours</h4>
              <p>Monday-Friday: 9am - 10pm</p>
              <p>Saturday-Sunday: 10am - 11pm</p>
            </div>
            <div className="crave-about-details">
              <h4>Address</h4>
              <p>123 Food Street, Colombo, Sri Lanka</p>
            </div>
          </div>
          <div className="crave-about-map">
            <iframe
              title="Test Map Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.014165407399!2d-122.41941528468298!3d37.774929779759955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c2f8b0b9f%3A0x19f1b8b2a0a5c6f9!2sTest%20Map%20Location!5e0!3m2!1sen!2sus!4v1709876543210!5m2!1sen!2sus"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: '10px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
