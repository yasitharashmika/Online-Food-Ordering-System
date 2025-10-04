import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import BookTable from './pages/BookTable';
import TrackOrder from './pages/TrackOrder';
import Login from './pages/Login';
import Footer from './components/Footer';
import About from './pages/About';
import Signup from './pages/SignUp';

import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';

// jkgl qrpp xcgo rpdr gmail sender app password

function App() {
  return (
    <Router>
      <div className="app" style={{ backgroundColor: '#fff9f0', minHeight: '100vh' }}>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/book-table" element={<BookTable />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
