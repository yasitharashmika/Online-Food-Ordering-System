import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../style/StaffSidebar.css";

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="staff-sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>

      <div className="staff-profile">
        <div className="staff-avatar">
          <i className="fas fa-user-shield"></i>
        </div>
        <div className="staff-info">
          <h4 className="staff-name">Admin User</h4>
          <p className="staff-email">admin@system.com</p>
        </div>
      </div>

      <nav className="sidebar-menu">
        <Link
          to="/admin/dashboard"
          className={`menu-item ${location.pathname === "/admin/dashboard" ? "active" : ""}`}
        >
          <div className="menu-icon"><i className="fas fa-tachometer-alt"></i></div>
          <span className="menu-label">Dashboard</span>
        </Link>

        <Link
          to="/admin/users"
          className={`menu-item ${location.pathname === "/admin/users" ? "active" : ""}`}
        >
          <div className="menu-icon"><i className="fas fa-users"></i></div>
          <span className="menu-label">Users</span>
        </Link>

        <Link
          to="/admin/orders"
          className={`menu-item ${location.pathname === "/admin/orders" ? "active" : ""}`}
        >
          <div className="menu-icon"><i className="fas fa-receipt"></i></div>
          <span className="menu-label">Orders</span>
        </Link>

        <Link
          to="/admin/menu"
          className={`menu-item ${location.pathname === "/admin/menu" ? "active" : ""}`}
        >
          <div className="menu-icon"><i className="fas fa-utensils"></i></div>
          <span className="menu-label">Menu Items</span>
        </Link>

        <Link
          to="/admin/reports"
          className={`menu-item ${location.pathname === "/admin/reports" ? "active" : ""}`}
        >
          <div className="menu-icon"><i className="fas fa-chart-line"></i></div>
          <span className="menu-label">Reports</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          <i className="fas fa-sign-out-alt logout-icon"></i> Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
