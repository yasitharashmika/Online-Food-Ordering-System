import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import BookTable from './pages/BookTable';
import TrackOrder from './pages/TrackOrder';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';




function App() {
  return (
    <Router>
      <div className="app" style={{ backgroundColor: '#fff9f0', minHeight: '100vh' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home /> } />
          <Route path="/menu" element={<Menu />} />
          <Route path="/book-table" element={<BookTable />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
