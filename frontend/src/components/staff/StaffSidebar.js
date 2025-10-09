import React from "react";
import "../../style/StaffSidebar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

function StaffSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const staffName = user.name || "Staff Member";
  const staffEmail = user.email || "staff@restaurant.com";

  const menuItems = [
    { path: "/staff/dashboard", icon: "fas fa-tachometer-alt", label: "Dashboard" },
    { path: "/staff/orders", icon: "fas fa-list-alt", label: "All Orders" },
    { path: "/staff/kitchen", icon: "fas fa-utensils", label: "Kitchen" },
    { path: "/staff/cashier", icon: "fas fa-cash-register", label: "Cashier" },
    { path: "/staff/bookings", icon: "fas fa-calendar-alt", label: "Table Booking" },
    { path: "/staff/rider", icon: "fas fa-motorcycle", label: "Rider" }, // ✅ Added Rider
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="staff-sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">Restaurant Staff</h3>
      </div>

      {/* Profile Section */}
      <div className="staff-profile">
        <div className="staff-avatar">
          <i className="fas fa-user-circle"></i>
        </div>
        <div className="staff-info">
          <h4 className="staff-name">{staffName}</h4>
          <p className="staff-email">{staffEmail}</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-item ${isActive(item.path) ? "active" : ""}`}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer with Logout */}
      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  );
}

export default StaffSidebar;
