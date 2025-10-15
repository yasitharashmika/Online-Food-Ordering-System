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
      if (!res.ok) throw new Error("Failed to fetch orders");
      
      const data = await res.json();
      const riderOrders = data || [];
      setOrders(riderOrders);
      updateMetrics(riderOrders);
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
      const response = await fetch(url, { method: "PUT" });
      if (!response.ok) throw new Error("Failed to update order status");
      
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

  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case "ready": return "rider-dashboard-status rider-dashboard-status-ready";
      case "picked up": return "rider-dashboard-status rider-dashboard-status-picked-up";
      case "delivered": return "rider-dashboard-status rider-dashboard-status-delivered";
      default: return "rider-dashboard-status";
    }
  };

  if (loading) {
    return (
      <StaffLayout title="Rider Dashboard" subtitle="Manage your assigned deliveries">
        <div className="rider-dashboard-wrapper">
          <div className="rider-dashboard-loading">
            Loading rider data...
          </div>
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout title="Rider Dashboard" subtitle="Manage your assigned deliveries">
      <div className="rider-dashboard-wrapper">
        {/* Toast Message */}
        {message && (
          <div className={`rider-dashboard-toast ${
            message.includes("✅") ? "rider-dashboard-toast-success" : "rider-dashboard-toast-error"
          }`}>
            {message}
          </div>
        )}

        {/* --- METRICS SECTION --- */}
        <div className="rider-dashboard-metrics">
          <div className="rider-dashboard-metric-card">
            <div className="rider-dashboard-metric-content">
              <div className="rider-dashboard-metric-info">
                <div className="rider-dashboard-metric-title">Available for Pickup</div>
                <div className="rider-dashboard-metric-value">{metrics.assigned}</div>
              </div>
              <div className="rider-dashboard-metric-icon">📦</div>
            </div>
          </div>
          <div className="rider-dashboard-metric-card">
            <div className="rider-dashboard-metric-content">
              <div className="rider-dashboard-metric-info">
                <div className="rider-dashboard-metric-title">My Deliveries</div>
                <div className="rider-dashboard-metric-value">{metrics.pickedUp}</div>
              </div>
              <div className="rider-dashboard-metric-icon">🚴</div>
            </div>
          </div>
          <div className="rider-dashboard-metric-card">
            <div className="rider-dashboard-metric-content">
              <div className="rider-dashboard-metric-info">
                <div className="rider-dashboard-metric-title">Delivered Today</div>
                <div className="rider-dashboard-metric-value">{metrics.delivered}</div>
              </div>
              <div className="rider-dashboard-metric-icon">✅</div>
            </div>
          </div>
        </div>

        {/* --- AVAILABLE JOBS --- */}
        <div className="rider-dashboard-orders-container">
          <div className="rider-dashboard-orders-section">
            <h2>Available Jobs</h2>
            <div className="rider-dashboard-orders">
              {availableOrders.length === 0 ? (
                <div className="rider-dashboard-empty">
                  No new COD orders are ready for pickup at the moment.
                </div>
              ) : (
                availableOrders.map((order) => (
                  <div key={order.id} className="rider-dashboard-order-card">
                    <div className="rider-dashboard-order-header">
                      <h4>{order.orderId}</h4>
                      <span className={getStatusClass(order.orderStatus)}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="rider-dashboard-customer-details">
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
                    <div className="rider-dashboard-order-actions">
                      <button
                        className="rider-dashboard-btn rider-dashboard-btn-primary"
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
          <div className="rider-dashboard-orders-section">
            <h2>My Deliveries (In Progress)</h2>
            <div className="rider-dashboard-orders">
              {myDeliveries.length === 0 ? (
                <div className="rider-dashboard-empty">
                  You have no orders currently in transit.
                </div>
              ) : (
                myDeliveries.map((order) => (
                  <div key={order.id} className="rider-dashboard-order-card">
                    <div className="rider-dashboard-order-header">
                      <h4>{order.orderId}</h4>
                      <span className={getStatusClass(order.orderStatus)}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="rider-dashboard-customer-details">
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
                    <div className="rider-dashboard-order-actions">
                      <button
                        className="rider-dashboard-btn rider-dashboard-btn-success"
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
        </div>
      </div>
    </StaffLayout>
  );
}

export default RiderDashboard;