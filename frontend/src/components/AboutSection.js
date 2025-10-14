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
              <p>236 Food Street, Colombo, Sri Lanka</p>
            </div>
          </div>
          <div className="crave-about-map">
  <iframe
    title="Crave & Rave Location"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7921.646474735136!2d79.85778353315509!3d6.911727548360513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2597d178754a1%3A0xbb18fe3e7567329b!2sCrave%20%26%20Rave!5e0!3m2!1sen!2slk!4v1760477211977!5m2!1sen!2slk"
    width="100%"
    height="350"
    style={{
      border: 0,
      borderRadius: "12px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.15)"
    }}
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
