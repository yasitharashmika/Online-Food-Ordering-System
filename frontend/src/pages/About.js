import React from 'react';
import '../style/About.css';


export default function About() {
  return (
    <section className="about-page">
      <div className="container">
        <h1 className="about-title">About CraveCorner</h1>
        <p className="about-intro">
          At <strong>CraveCorner</strong>, we believe food is more than just a meal — it's an experience.  
          From sizzling starters to indulgent desserts, our mission is to bring people together through flavors.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <h2>🍳 Our Story</h2>
            <p>
              Founded in 2020, CraveCorner started as a small family restaurant and has grown into a
              popular spot for food lovers. We combine traditional recipes with modern tastes to create unforgettable dishes.
            </p>
          </div>
          <div className="about-card">
            <h2>🥗 Fresh Ingredients</h2>
            <p>
              Every dish is prepared with fresh, locally sourced ingredients. Our chefs ensure each meal is
              both nutritious and delicious.
            </p>
          </div>
          <div className="about-card">
            <h2>👨‍🍳 Our Chefs</h2>
            <p>
              Our passionate chefs bring creativity and expertise to every plate. With years of experience, they
              craft meals that delight the senses.
            </p>
          </div>
        </div>

        <div className="about-extra">
          <h2>📍 Visit Us</h2>
          <p>123 Food Street, Colombo, Sri Lanka</p>
          <h2>⏰ Opening Hours</h2>
          <p>Mon-Fri: 9am - 10pm | Sat-Sun: 10am - 11pm</p>
        </div>
      </div>
    </section>
  );
}
