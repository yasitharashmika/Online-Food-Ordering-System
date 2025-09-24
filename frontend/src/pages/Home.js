import React from 'react';
import HeroSection from '../components/HeroSection';
import HotDeals from '../components/HotDeals';
import '../style/Home.css'; 
import AboutSection from '../components/AboutSection';
import CustomerReviews from '../components/CustomerReviews';

export default function Home() {
  return (
    <div className="home-wrapper">
      <div className="container">
        <HeroSection />
        <HotDeals />
        <AboutSection/>
        <CustomerReviews/>
      </div>
    </div>
  );
}