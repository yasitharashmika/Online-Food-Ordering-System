import React, { useState, useEffect, useCallback } from "react";
import StaffLayout from "../components/staff/StaffLayout";
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
  const [loading, setLoading] = useState(true);
  const [rider, setRider] = useState(null);

  // --- FETCH ORDERS ---
  const fetchOrders = useCallback(async () => {
    const loggedInRider = JSON.parse(localStorage.getItem("user"));
    if (!loggedInRider || !loggedInRider.email) {
      setMessage("❌ Could not identify the current rider. Please log in again.");
      setLoading(false);
      return;
    }
    setRider(loggedInRider);

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/order/rider/${loggedInRider.email}`);
      const data = await res.json();
      const riderOrders = data || [];
      setOrders(riderOrders);
      updateMetrics(riderOrders); // This function will now correctly count everything
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setMessage("❌ Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 30000); // refresh every 30s
    return () => clearInterval(intervalId);
  }, [fetchOrders]);

  // --- UPDATE: Simplified and corrected metrics calculation ---
  const updateMetrics = (currentOrders) => {
    setMetrics({
      assigned: currentOrders.filter(
        (o) => o.orderStatus?.toLowerCase() === "ready"
      ).length,
      pickedUp: currentOrders.filter(
        (o) => o.orderStatus?.toLowerCase() === "picked up"
      ).length,
      // The backend now only sends orders delivered today, so we just count them.
      // No more date checking is needed here!
      delivered: currentOrders.filter(
        (o) => o.orderStatus?.toLowerCase() === "delivered"
      ).length,
    });
  };

  // --- UPDATE ORDER STATUS ---
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!rider) return;

    let url = `${API_BASE_URL}/api/v1/order/${orderId}/status?status=${newStatus}`;
    // Assign the rider upon pickup
    if (newStatus === "Picked Up") {
      url += `&riderEmail=${rider.email}`;
    }

    try {
      await fetch(url, { method: "PUT" });
      setMessage(`✅ Order ${orderId} status updated to ${newStatus}`);
      fetchOrders(); // Refresh all data to get updated counts
    } catch (err) {
      console.error("Failed to update order status", err);
      setMessage(`❌ Failed to update order ${orderId}`);
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // --- FILTERS ---
  const availableOrders = orders.filter(
    (order) => order.orderStatus?.toLowerCase() === "ready"
  );
  const myDeliveries = orders.filter(
    (order) => order.orderStatus?.toLowerCase() === "picked up"
  );

  return (
    <StaffLayout title="Rider Dashboard" subtitle="Manage your assigned deliveries">
      {message && <div className="toast-message">{message}</div>}

      {/* --- METRICS SECTION --- */}
      <div className="metrics-container">
        <div className="metric-card">
          <h4>Available for Pickup</h4>
          <p>{metrics.assigned}</p>
        </div>
        <div className="metric-card">
          <h4>My Deliveries</h4>
          <p>{metrics.pickedUp}</p>
        </div>
        <div className="metric-card">
          <h4>Delivered Today</h4>
          <p>{metrics.delivered}</p>
        </div>
      </div>

      {/* --- AVAILABLE JOBS --- */}
      <div className="rider-orders-section">
        <h2>Available Jobs</h2>
        <div className="rider-orders">
          {loading ? (
            <p>Loading orders...</p>
          ) : availableOrders.length === 0 ? (
            <p>No new COD orders are ready for pickup at the moment.</p>
          ) : (
            availableOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h4>{order.orderId}</h4>
                  <span
                    className={`status ${order.orderStatus.replace(/\s+/g, "-")}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <div className="customer-details">
                  <p>
                    <strong>Customer:</strong> {order.customerName || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.customerPhone || "N/A"}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {order.customerStreet
                      ? `${order.customerStreet}, ${order.customerCity || ""}`
                      : "Address not provided"}
                  </p>
                </div>
                <p>
                  <strong>Items:</strong>{" "}
                  {Array.isArray(order.items)
                    ? order.items.join(", ")
                    : order.items}
                </p>
                <p>
                  <strong>Amount to Collect:</strong> $
                  {order.totalAmount?.toFixed(2)}
                </p>
                <div className="order-actions">
                  <button
                    className="btn"
                    onClick={() => handleUpdateStatus(order.id, "Picked Up")}
                  >
                    Pick Up & Assign to Me
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- MY DELIVERIES --- */}
      <div className="rider-orders-section">
        <h2>My Deliveries (In Progress)</h2>
        <div className="rider-orders">
          {loading ? (
            <p>Loading deliveries...</p>
          ) : myDeliveries.length === 0 ? (
            <p>You have no orders currently in transit.</p>
          ) : (
            myDeliveries.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h4>{order.orderId}</h4>
                  <span
                    className={`status ${order.orderStatus.replace(/\s+/g, "-")}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <div className="customer-details">
                  <p>
                    <strong>Customer:</strong> {order.customerName || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.customerPhone || "N/A"}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {order.customerStreet
                      ? `${order.customerStreet}, ${order.customerCity || ""}`
                      : "Address not provided"}
                  </p>
                </div>
                <p>
                  <strong>Items:</strong>{" "}
                  {Array.isArray(order.items)
                    ? order.items.join(", ")
                    : order.items}
                </p>
                <p>
                  <strong>Amount to Collect:</strong> $
                  {order.totalAmount?.toFixed(2)}
                </p>
                <div className="order-actions">
                  <button
                    className="btn btn-success"
                    onClick={() => handleUpdateStatus(order.id, "Delivered")}
                  >
                    Mark as Delivered
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </StaffLayout>
  );
}

export default RiderDashboard;