import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes,  } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import BookTable from './pages/BookTable';
import TrackOrder from './pages/TrackOrder';
import Login from './pages/Login';
import Footer from './components/Footer';
import About from './pages/About';
import Signup from './pages/SignUp';
import Notification from './pages/Notification';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CustomerDashboard from './pages/CustomerDashboard';






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
          <Route path="/about-us" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />




        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
