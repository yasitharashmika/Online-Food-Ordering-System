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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch all orders
      const orderRes = await fetch(`${API_BASE_URL}/api/v1/order/all`);
      const orderData = await orderRes.json();
      let orders = orderData.data || orderData;

      // Sort orders by orderDateTime descending (most recent first)
      orders = orders.sort((a, b) => new Date(b.orderDateTime) - new Date(a.orderDateTime));

      // Fetch all users
      const userRes = await fetch(`${API_BASE_URL}/api/v1/user/all`);
      const userData = await userRes.json();
      const users = userData.data || userData;

      // Calculate metrics dynamically
      setMetrics({
        totalOrders: orders.length,
        users: users.length,
        sales: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
        pending: orders.filter((o) => o.orderStatus.toLowerCase() !== "completed").length,
      });

      // Show **last 5–8 orders** (e.g., 5 most recent)
      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Admin Dashboard" subtitle="Overview of business performance">
        <p>Loading data...</p>
      </AdminLayout>
    );
  }

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
                <td>{order.customerName || order.placedBy || "N/A"}</td>
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
