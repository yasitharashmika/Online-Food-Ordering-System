import React from "react";
import AdminSidebar from "./AdminSidebar";
import "../../style/StaffLayout.css";

function AdminLayout({ title, subtitle, children }) {
  return (
    <div className="staff-layout">
      <AdminSidebar />

      <main className="staff-main-content">
        <div className="staff-content-header">
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>

        <div className="staff-content">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout;
