import React from "react";
import "../../style/OrderQueue.css";
import { Link } from "react-router-dom";

function OrderQueue({ orders, onUpdateOrderStatus, showViewAll = true }) {
  const getStatusClass = (status) => {
    switch(status) {
      case "received": return "status status-received";
      case "preparing": return "status status-preparing";
      case "ready": return "status status-ready";
      case "completed": return "status status-completed";
      default: return "status";
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
    <div className="card">
      <h3>Order Queue</h3>
      <div className="order-list">
        {displayedOrders.length === 0 ? (
          <p className="no-orders">No orders in queue</p>
        ) : (
          displayedOrders.map(order => (
            <div key={order.id} className="order-item">
              <div className="order-header">
                <h4>{order.orderId}</h4>
                <span className={getStatusClass(order.status)}>
                  {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                </span>
              </div>
              <p>{order.items}</p>
              <p>Customer: {order.customer}</p>
              <div className="order-actions">
                {order.status === "ready" && (
                  <button 
                    className="btn btn-success"
                    onClick={() => handleStatusUpdate(order.id, "completed")}
                  >
                    Mark Collected
                  </button>
                )}
                {order.status === "preparing" && (
                  <button 
                    className="btn btn-success"
                    onClick={() => handleStatusUpdate(order.id, "ready")}
                  >
                    Mark Ready
                  </button>
                )}
                {order.status === "received" && (
                  <button 
                    className="btn"
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
        <Link to="/staff/orders" className="btn view-all-btn">
          View All Orders
        </Link>
      )}
    </div>
  );
}

export default OrderQueue;
