import React from 'react';
import { Link } from 'react-router-dom';
import '../style/HeroSection.css';

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="section-title text-center mb-4">
          <h2 className="text-danger">Welcome to CraveCorner</h2>
          <p className="text-muted">Delicious food delivered to your door or enjoy at our restaurant</p>
        </div>
        <div className="card">
          <div
            id="heroCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1200&q=80"
                  className="d-block w-100"
                  alt="Food Background 1"
                  style={{ objectFit: 'cover', height: '400px' }}
                />
                <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                  <h2 className="text-white">Delicious Food Delivered To Your Door</h2>
                  <div className="d-flex gap-3">
                    <Link to="/menu" className="btn btn-primary">Order Food Now</Link>
                    <Link to="/book-table" className="btn btn-outline-light">Book a Table</Link>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1200&q=80"
                  className="d-block w-100"
                  alt="Food Background 2"
                  style={{ objectFit: 'cover', height: '400px' }}
                />
                <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                  <h2 className="text-white">Delicious Food Delivered To Your Door</h2>
                  <div className="d-flex gap-3">
                    <Link to="/menu" className="btn btn-primary">Order Food Now</Link>
                    <Link to="/book-table" className="btn btn-outline-light">Book a Table</Link>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZvb2QlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80"
                  className="d-block w-100"
                  alt="Food Background 3"
                  style={{ objectFit: 'cover', height: '400px' }}
                />
                <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                  <h2 className="text-white">Delicious Food Delivered To Your Door</h2>
                  <div className="d-flex gap-3">
                    <Link to="/menu" className="btn btn-primary">Order Food Now</Link>
                    <Link to="/book-table" className="btn btn-outline-light">Book a Table</Link>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZvb2QlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80"
                  className="d-block w-100"
                  alt="Food Background 4"
                  style={{ objectFit: 'cover', height: '400px' }}
                />
                <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                  <h2 className="text-white">Delicious Food Delivered To Your Door</h2>
                  <div className="d-flex gap-3">
                    <Link to="/menu" className="btn btn-primary">Order Food Now</Link>
                    <Link to="/book-table" className="btn btn-outline-light">Book a Table</Link>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;