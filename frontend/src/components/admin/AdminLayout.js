import React from "react";
import AdminSidebar from "./AdminSidebar";
import NotificationBell from '../NotificationBell'; // ⭐ 1. Import the component
import "../../style/StaffLayout.css";

function AdminLayout({ title, subtitle, children }) {
  return (
    <div className="staff-layout">
      <AdminSidebar />

      <main className="staff-main-content">
        <div className="staff-content-header">
          {/* Group for title and subtitle */}
          <div className="header-text-group">
            <h1 className="page-title">{title}</h1>
            <p className="page-subtitle">{subtitle}</p>
          </div>

          {/* ⭐ 2. Add the notification bell on the right side */}
          <div className="header-actions">
            <NotificationBell showFilters={true} />
          </div>
        </div>

        <div className="staff-content">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout;