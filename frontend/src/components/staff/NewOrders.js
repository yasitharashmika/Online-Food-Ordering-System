import React from "react";

function NewOrders({ orders, startPreparingOrder }) {
  return (
    <div className="card">
      <h3 className="status-header received">New Orders Received</h3>
      <div className="kitchen-orders">
        {orders.map(order => (
          <div key={order.id} className="kitchen-order-item received">
            <div className="order-main-info">
              <div className="order-header">
                <h4>{order.orderId} <span className="order-type-badge">{order.type}</span></h4>
              </div>
              <p className="customer-name">Customer: {order.customer}</p>
              <div className="order-details">
                <h5>Order Details:</h5>
                {order.details.map((detail, index) => (
                  <div key={index} className="order-detail-item">
                    <span className="item-quantity">{detail.quantity}x</span>
                    <span className="item-name">{detail.item}</span>
                    <span className="item-station">{detail.station}</span>
                    <span className="item-time">{detail.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="kitchen-actions">
              <button className="btn btn-start-cooking" onClick={() => startPreparingOrder(order.id)}>Start Cooking</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewOrders;
