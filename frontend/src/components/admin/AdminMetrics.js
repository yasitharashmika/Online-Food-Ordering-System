import React from "react";
import "../../style/AdminDashboard.css";

function AdminMetrics({ metrics }) {
  return (
    <div className="staff-grid">
      <div className="card">
        <h3>Total Orders</h3>
        <p>{metrics.totalOrders}</p>
      </div>
      <div className="card">
        <h3>Active Users</h3>
        <p>{metrics.users}</p>
      </div>
      <div className="card">
        <h3>Total Sales</h3>
        <p>${metrics.sales}</p>
      </div>
      <div className="card">
        <h3>Pending Deliveries</h3>
        <p>{metrics.pending}</p>
      </div>
    </div>
  );
}

export default AdminMetrics;
