import React, { useState, useEffect } from "react";
import StaffLayout from "../components/staff/StaffLayout";
import API_BASE_URL from "../config";
import "../style/OrderProcessing.css";

function OrderProcessing() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/order/all`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, []);

  // Update order status in backend
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/order/${orderId}/status?status=${newStatus}`,
        { method: "PUT" }
      );
      if (!response.ok) throw new Error("Failed to update order status");

      setOrders((orders) =>
        orders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter(
          (order) => order.orderStatus.toLowerCase() === filter
        );

  // Sort so newly received orders appear first, then by time
  const sortedOrders = filteredOrders.sort((a, b) => {
    if (
      a.orderStatus === "Ready To Prepare" &&
      b.orderStatus !== "Ready To Prepare"
    )
      return -1;
    if (
      a.orderStatus !== "Ready To Prepare" &&
      b.orderStatus === "Ready To Prepare"
    )
      return 1;
    return new Date(b.orderDateTime) - new Date(a.orderDateTime);
  });

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "ready to prepare":
        return "order-processing-status order-processing-status-received";
      case "preparing":
        return "order-processing-status order-processing-status-preparing";
      case "ready":
        return "order-processing-status order-processing-status-ready";
      case "completed":
        return "order-processing-status order-processing-status-completed";
      default:
        return "order-processing-status";
    }
  };

  const getStatusOptions = (currentStatus) => {
    const statusFlow = {
      "ready to prepare": ["preparing"],
      preparing: ["ready"],
      ready: ["completed"],
      completed: [],
    };
    return statusFlow[currentStatus.toLowerCase()] || [];
  };

  return (
    <StaffLayout
      title="Order Processing"
      subtitle="Update kitchen order statuses"
    >
      <div className="order-processing-wrapper">
        <div className="order-processing-card">
          <div className="order-processing-filter-buttons">
            <button
              className={`order-processing-btn ${
                filter === "all" ? "" : "order-processing-btn-secondary"
              }`}
              onClick={() => setFilter("all")}
            >
              All Orders
            </button>
            <button
              className={`order-processing-btn ${
                filter === "ready to prepare" ? "" : "order-processing-btn-secondary"
              }`}
              onClick={() => setFilter("ready to prepare")}
            >
              Received
            </button>
            <button
              className={`order-processing-btn ${
                filter === "preparing" ? "" : "order-processing-btn-secondary"
              }`}
              onClick={() => setFilter("preparing")}
            >
              Preparing
            </button>
            <button
              className={`order-processing-btn ${
                filter === "ready" ? "" : "order-processing-btn-secondary"
              }`}
              onClick={() => setFilter("ready")}
            >
              Ready
            </button>
          </div>

          <div className="order-processing-orders-grid">
            {sortedOrders.map((order) => (
              <div key={order.id} className="order-processing-order-card">
                <div className="order-processing-order-card-content">
                  <div className="order-processing-order-info">
                    <h3>
                      {order.orderId}
                      <span className="order-processing-order-type-badge">
                        {order.tableNumber
                          ? `Table ${order.tableNumber}`
                          : "Takeaway"}
                      </span>
                    </h3>
                    <p>
                      <strong>Placed By:</strong> {order.placedBy}
                    </p>
                    <p>
                      <strong>Time:</strong>{" "}
                      {new Date(order.orderDateTime).toLocaleTimeString()}
                    </p>
                    <p>
                      <strong>Items:</strong>
                    </p>
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                    <p>
                      <strong>Total:</strong> ${order.totalAmount}
                    </p>
                  </div>
                  <div className="order-processing-order-controls">
                    <span className={getStatusClass(order.orderStatus)}>
                      {order.orderStatus}
                    </span>
                    <div className="order-processing-action-buttons">
                      {getStatusOptions(order.orderStatus).map((status) => (
                        <button
                          key={status}
                          className="order-processing-btn order-processing-btn-success"
                          onClick={() =>
                            updateOrderStatus(order.id, status)
                          }
                        >
                          Mark as{" "}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}

export default OrderProcessing;
