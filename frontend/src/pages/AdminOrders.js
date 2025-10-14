import React, { useState, useEffect } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import API_BASE_URL from "../config";
import "../style/AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/order/all`);
      const data = await response.json();
      setOrders(data.data || data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setMessage("❌ Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Delete order (optional)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/order/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage("🗑️ Order deleted successfully.");
        setOrders(orders.filter((o) => o.id !== id));
      } else {
        setMessage("❌ Failed to delete order.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      setMessage("❌ Something went wrong.");
    }
  };

  // Filter logic
  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter(
          (order) =>
            order.orderStatus &&
            order.orderStatus.toLowerCase() === filter.toLowerCase()
        );

  const getStatusClass = (status) => {
    if (!status) return "status";
    switch (status.toLowerCase()) {
      case "ready to prepare":
        return "status status-received";
      case "preparing":
        return "status status-preparing";
      case "ready":
        return "status status-ready";
      case "completed":
        return "status status-completed";
      default:
        return "status";
    }
  };

  return (
    <AdminLayout title="Orders" subtitle="Manage and monitor all customer orders">
      <div className="admin-orders-container">
        <div className="filter-buttons">
          <button
            className={`btn ${filter === "all" ? "" : "btn-secondary"}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`btn ${filter === "ready to prepare" ? "" : "btn-secondary"}`}
            onClick={() => setFilter("ready to prepare")}
          >
            Received
          </button>
          <button
            className={`btn ${filter === "preparing" ? "" : "btn-secondary"}`}
            onClick={() => setFilter("preparing")}
          >
            Preparing
          </button>
          <button
            className={`btn ${filter === "ready" ? "" : "btn-secondary"}`}
            onClick={() => setFilter("ready")}
          >
            Ready
          </button>
          <button
            className={`btn ${filter === "completed" ? "" : "btn-secondary"}`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>

        {message && <p className="message">{message}</p>}
        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <div className="card">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={order.id}>
                    <td>{index + 1}</td>
                    <td>{order.customerName || "N/A"}</td>
                    <td>
                      <span className={getStatusClass(order.orderStatus)}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>${order.totalAmount || 0}</td>
                    <td>
                      {order.orderDateTime
                        ? new Date(order.orderDateTime).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(order.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && <p>No orders found.</p>}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminOrders;
