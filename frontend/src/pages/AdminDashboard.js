import React, { useState, useEffect } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import AdminMetrics from "../components/admin/AdminMetrics";
import API_BASE_URL from "../config";
import "../style/AdminDashboard.css";

function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    users: 0,
    sales: 0,
    pending: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/order/all`);
      const data = await res.json();
      const orders = data.data || data;

      setMetrics({
        totalOrders: orders.length,
        users: 48, // example static data; replace with backend call
        sales: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
        pending: orders.filter((o) => o.orderStatus !== "completed").length,
      });

      setRecentOrders(orders.slice(0, 4)); // show only 4 recent orders
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    }
  };

  return (
    <AdminLayout title="Admin Dashboard" subtitle="Overview of business performance">
      <AdminMetrics metrics={metrics} />

      <div className="card">
        <h3>Recent Orders</h3>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customerName || "N/A"}</td>
                <td>{order.orderStatus}</td>
                <td>${order.totalAmount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
