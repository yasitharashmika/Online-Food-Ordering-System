import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
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

import StaffDashboard from './pages/StaffDashboard';
import KitchenDashboard from './pages/KitchenDashboard';
import CashierDashboard from './pages/CashierDashboard';
import OrderProcessing from './pages/OrderProcessing';
import TableBookingOverview from './pages/TableBookingOverview';
import RiderDashboard from './pages/RiderDashboard';

// ✅ Import Admin Dashboard
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';


// ✅ ProtectedRoute component to restrict access
function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user role not allowed, redirect to home
  const role = user.role?.toLowerCase();
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // Authorized
  return children;
}


function App() {
  return (
    <Router>
      <div className="app" style={{ backgroundColor: '#fff9f0', minHeight: '100vh' }}>
        <LayoutWrapper />
      </div>
    </Router>
  );
}


// Component to conditionally render navbar and footer
function LayoutWrapper() {
  const location = useLocation();
  const isStaffPage = location.pathname.startsWith('/staff/');
  const isAdminPage = location.pathname.startsWith('/admin/'); // ✅ added for admin pages

  return (
    <>
      {/* Hide Navbar on staff/admin pages */}
      {!isStaffPage && !isAdminPage && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/book-table" element={<BookTable />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />

        {/* Forgot Password Routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ✅ Staff Routes (staff + admin allowed) */}
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/kitchen"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <KitchenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/cashier"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <CashierDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/orders"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <OrderProcessing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/bookings"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <TableBookingOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/rider"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <RiderDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Admin Routes (admin only) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Hide Footer on staff/admin pages */}
      {!isStaffPage && !isAdminPage && <Footer />}
    </>
  );
}

export default App;
