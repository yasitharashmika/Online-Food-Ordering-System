import React, { useState, useEffect } from "react";
import StaffLayout from "../components/staff/StaffLayout"; // reuse layout
import API_BASE_URL from "../config";
import "../style/RiderDashboard.css";

function RiderDashboard() {
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState({
    assigned: 0,
    pickedUp: 0,
    delivered: 0,
  });
  const [message, setMessage] = useState("");

  // Fetch orders assigned to rider from backend
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/order/all`);
      const data = await res.json();
      const allOrders = data.data || data;

      // filter only orders assigned to rider (optional: you can have `assignedTo` field)
      const riderOrders = allOrders.filter(order => order.assignedTo === "rider@system.com");

      setOrders(riderOrders);
      updateMetrics(riderOrders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateMetrics = (orders) => {
    setMetrics({
      assigned: orders.filter(o => o.orderStatus === "ready").length,
      pickedUp: orders.filter(o => o.orderStatus === "pickedUp").length,
      delivered: orders.filter(o => o.orderStatus === "completed").length,
    });
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/order/${orderId}/status?status=${status}`, {
        method: "PUT",
      });

      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, orderStatus: status } : order
      );
      setOrders(updatedOrders);
      updateMetrics(updatedOrders);

      setMessage(`✅ Order ${orderId} marked as ${status}`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update order status", err);
      setMessage(`❌ Failed to update order ${orderId}`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <StaffLayout title="Rider Dashboard" subtitle="Manage your assigned deliveries">
      {message && <div className="toast-message">{message}</div>}

      <div className="metrics-container">
        <div className="metric-card">
          <h4>Assigned Orders</h4>
          <p>{metrics.assigned}</p>
        </div>
        <div className="metric-card">
          <h4>Picked Up</h4>
          <p>{metrics.pickedUp}</p>
        </div>
        <div className="metric-card">
          <h4>Delivered</h4>
          <p>{metrics.delivered}</p>
        </div>
      </div>

      <div className="rider-orders">
        {orders.length === 0 ? (
          <p>No orders assigned to you.</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h4>{order.orderId}</h4>
                <span className={`status ${order.orderStatus}`}>{order.orderStatus}</span>
              </div>
              <p><strong>Customer:</strong> {order.placedBy}</p>
              <p><strong>Items:</strong> {Array.isArray(order.items) ? order.items.join(", ") : order.items}</p>
              <p><strong>Amount:</strong> ${order.totalAmount?.toFixed(2)}</p>
              <div className="order-actions">
                {order.orderStatus === "ready" && (
                  <button className="btn" onClick={() => updateOrderStatus(order.id, "pickedUp")}>
                    Pick Up
                  </button>
                )}
                {order.orderStatus === "pickedUp" && (
                  <button className="btn btn-success" onClick={() => updateOrderStatus(order.id, "completed")}>
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </StaffLayout>
  );
}

export default RiderDashboard;
