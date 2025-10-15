import React from "react";
import "../../style/ReadyOrders.css";

function ReadyOrders({ orders, markOrderCompleted }) {
  // Only show orders with status "ready"
  const readyOrders = orders.filter(
    order => order.orderStatus.toLowerCase() === "ready"
  );

  return (
    <div className="ready-orders-wrapper">
      <div className="ready-orders-card">
        <h3>Ready Orders</h3>
        <div className="ready-orders-list">
          {readyOrders.length === 0 ? (
            <p className="ready-orders-no-orders">No ready orders available.</p>
          ) : (
            readyOrders.map(order => (
              <div key={order.id} className="ready-orders-item">
                <div className="ready-orders-info">
                  <div className="ready-orders-header">
                    <h4>{order.orderId}</h4>
                    <span className={`ready-orders-type ${order.type}`}>
                      {order.type?.toUpperCase() || "DINE-IN"}
                    </span>
                  </div>
                  <div className="ready-orders-details">
                    <p><strong>Items:</strong> {order.items.join(", ")}</p>
                    <p><strong>Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
                    {order.tableNumber && <p><strong>Table:</strong> {order.tableNumber}</p>}
                  </div>
                </div>
                <div className="ready-orders-actions">
                  <button
                    className="ready-orders-btn ready-orders-btn-complete"
                    onClick={() => markOrderCompleted(order.id)}
                  >
                    Mark as Completed
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ReadyOrders;