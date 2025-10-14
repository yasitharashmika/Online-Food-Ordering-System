import React from "react";
import StaffSidebar from "./StaffSidebar";

import "../../style/StaffLayout.css";

function StaffLayout({ children, title, subtitle }) {
  return (
    <div className="staff-layout">
      <StaffSidebar />
      <div className="staff-main-content">
        <div className="staff-content-header">
          {/* Renamed div for CSS consistency */}
          <div className="header-text-group">
            <h1 className="page-title">{title}</h1>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>

          
        </div>

        <div className="staff-content">{children}</div>
      </div>
    </div>
  );
}

export default StaffLayout;