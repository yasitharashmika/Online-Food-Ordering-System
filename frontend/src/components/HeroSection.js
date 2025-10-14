import React from 'react';
import { Link } from 'react-router-dom';
import '../style/HeroSection.css';

function HeroSection() {
  return (
    <section className="crave-hero-section">
      <div className="container">
        <div className="crave-section-title text-center mb-4">
          <h2 className="text-danger">Welcome to CraveCorner</h2>
          <p className="text-muted">Delicious food delivered to your door or enjoy at our restaurant</p>
        </div>
        <div className="crave-hero-card">
          <div
            id="craveHeroCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
            data-bs-interval="5000"
          >
            <div className="carousel-inner">
              <div className="carousel-item crave-carousel-item active">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1200&q=80"
                  className="d-block w-100"
                  alt="Food Background 1"
                />
                <div className="carousel-caption crave-carousel-caption d-flex flex-column align-items-center justify-content-center">
                  <h2 className="text-white">Food Delivered To Your Door</h2>
                  <div className="d-flex gap-3 crave-btn-group">
                    <Link to="/menu" className="btn crave-btn crave-btn-primary">Order Food Now</Link>
                    <Link to="/book-table" className="btn crave-btn crave-btn-outline">Book a Table</Link>
                  </div>
                </div>
              </div>
              <div className="carousel-item crave-carousel-item">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1200&q=80"
                  className="d-block w-100"
                  alt="Food Background 2"
                />
                <div className="carousel-caption crave-carousel-caption d-flex flex-column align-items-center justify-content-center">
                  <h2 className="text-white">Food Delivered To Your Door</h2>
                  <div className="d-flex gap-3 crave-btn-group">
                    <Link to="/menu" className="btn crave-btn crave-btn-primary">Order Food Now</Link>
                    <Link to="/book-table" className="btn crave-btn crave-btn-outline">Book a Table</Link>
                  </div>
                </div>
              </div>
              <div className="carousel-item crave-carousel-item">
                <img
                  src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZvb2QlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80"
                  className="d-block w-100"
                  alt="Food Background 3"
                />
                <div className="carousel-caption crave-carousel-caption d-flex flex-column align-items-center justify-content-center">
                  <h2 className="text-white">Food Delivered To Your Door</h2>
                  <div className="d-flex gap-3 crave-btn-group">
                    <Link to="/menu" className="btn crave-btn crave-btn-primary">Order Food Now</Link>
                    <Link to="/book-table" className="btn crave-btn crave-btn-outline">Book a Table</Link>
                  </div>
                </div>
              </div>
              <div className="carousel-item crave-carousel-item">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZvb2QlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80"
                  className="d-block w-100"
                  alt="Food Background 4"
                />
                <div className="carousel-caption crave-carousel-caption d-flex flex-column align-items-center justify-content-center">
                  <h2 className="text-white">Food Delivered To Your Door</h2>
                  <div className="d-flex gap-3 crave-btn-group">
                    <Link to="/menu" className="btn crave-btn crave-btn-primary">Order Food Now</Link>
                    <Link to="/book-table" className="btn crave-btn crave-btn-outline">Book a Table</Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Carousel Indicators */}
            <div className="carousel-indicators crave-carousel-indicators">
              <button 
                type="button" 
                data-bs-target="#craveHeroCarousel" 
                data-bs-slide-to="0" 
                className="active" 
                aria-current="true" 
                aria-label="Slide 1"
              ></button>
              <button 
                type="button" 
                data-bs-target="#craveHeroCarousel" 
                data-bs-slide-to="1" 
                aria-label="Slide 2"
              ></button>
              <button 
                type="button" 
                data-bs-target="#craveHeroCarousel" 
                data-bs-slide-to="2" 
                aria-label="Slide 3"
              ></button>
              <button 
                type="button" 
                data-bs-target="#craveHeroCarousel" 
                data-bs-slide-to="3" 
                aria-label="Slide 4"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;