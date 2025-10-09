import React from "react";
import "../../style/CashierDashboard.css";

function ReadyOrders({ orders, markOrderCompleted }) {
  // Only show orders with status "ready"
  const readyOrders = orders.filter(
    order => order.orderStatus.toLowerCase() === "ready"
  );

  return (
    <div className="card">
      <h3>Ready Orders</h3>
      <div className="cashier-orders">
        {readyOrders.length === 0 ? (
          <p className="no-orders">No ready orders available.</p>
        ) : (
          readyOrders.map(order => (
            <div key={order.id} className="cashier-order-item">
              <div className="order-info">
                <div className="order-header">
                  <h4>{order.orderId}</h4>
                  <span className={`order-type ${order.type}`}>
                    {order.type?.toUpperCase() || "DINE-IN"}
                  </span>
                </div>
                <div className="order-details">
                  <p><strong>Items:</strong> {order.items.join(", ")}</p>
                  <p><strong>Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
                  {order.tableNumber && <p><strong>Table:</strong> {order.tableNumber}</p>}
                </div>
              </div>
              <div className="cashier-actions">
                <button
                  className="btn btn-complete"
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
  );
}

export default ReadyOrders;
