import React from "react";
import "../../style/OrderQueue.css";
import { Link } from "react-router-dom";

function OrderQueue({ orders, onUpdateOrderStatus, showViewAll = true }) {
  const getStatusClass = (status) => {
    switch(status) {
      case "received": return "order-queue-status order-queue-status-received";
      case "preparing": return "order-queue-status order-queue-status-preparing";
      case "ready": return "order-queue-status order-queue-status-ready";
      case "completed": return "order-queue-status order-queue-status-completed";
      default: return "order-queue-status";
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(orderId, newStatus);
    }
  };

  // ✅ Limit orders to first 4
  const displayedOrders = orders.slice(0, 4);

  return (
    <div className="order-queue-wrapper">
      <div className="order-queue-card">
        <h3>Order Queue</h3>
        <div className="order-queue-list">
          {displayedOrders.length === 0 ? (
            <p className="order-queue-no-orders">No orders in queue</p>
          ) : (
            displayedOrders.map(order => (
              <div key={order.id} className="order-queue-item">
                <div className="order-queue-header">
                  <h4>{order.orderId}</h4>
                  <span className={getStatusClass(order.status)}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </span>
                </div>
                <p>{order.items}</p>
                <p>Customer: {order.customer}</p>
                <div className="order-queue-actions">
                  {order.status === "ready" && (
                    <button 
                      className="order-queue-btn order-queue-btn-success"
                      onClick={() => handleStatusUpdate(order.id, "completed")}
                    >
                      Mark Collected
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button 
                      className="order-queue-btn order-queue-btn-success"
                      onClick={() => handleStatusUpdate(order.id, "ready")}
                    >
                      Mark Ready
                    </button>
                  )}
                  {order.status === "received" && (
                    <button 
                      className="order-queue-btn"
                      onClick={() => handleStatusUpdate(order.id, "preparing")}
                    >
                      Start Preparing
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        {showViewAll && (
          <Link to="/staff/orders" className="order-queue-btn order-queue-view-all-btn">
            View All Orders
          </Link>
        )}
      </div>
    </div>
  );
}

export default OrderQueue;