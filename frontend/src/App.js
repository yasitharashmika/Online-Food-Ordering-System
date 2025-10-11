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

import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import MenuManagement from './pages/MenuManagement';

// ⭐ 1. IMPORT the CustomerDashboard
import CustomerDashboard from './pages/CustomerDashboard';


// ProtectedRoute component to restrict access
function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // If not logged in at all, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, but their role is not allowed, redirect to the homepage.
  // This is better than sending a logged-in admin back to the login page.
  const role = user.role?.toLowerCase();
  if (!allowedRoles.includes(role)) {
    // ⭐ MODIFIED: Redirect unauthorized users to home instead of login
    return <Navigate to="/" replace />;
  }

  // If authorized, show the component
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
  const isAdminPage = location.pathname.startsWith('/admin/');
  // ⭐ ADDED: A check for the user dashboard page to hide the main navbar if needed
  const isUserDashboard = location.pathname.startsWith('/user/');

  return (
    <>
      {/* Hide Navbar on staff, admin, and user dashboard pages */}
      {!isStaffPage && !isAdminPage &&  <Navbar />}

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

        {/* ⭐ 2. ADDED: User Routes (user role only) */}
        <Route
          path="/user/dashboard"
          element={
            
              <CustomerDashboard />
            
          }
        />

        {/* Staff Routes (staff + admin allowed) */}
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

        {/* Admin Routes (admin only) */}
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
        <Route
          path="/admin/MenuManagement"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MenuManagement />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Hide Footer on staff, admin, and user dashboard pages */}
      {!isStaffPage && !isAdminPage &&  <Footer />}
    </>
  );
}

export default App;