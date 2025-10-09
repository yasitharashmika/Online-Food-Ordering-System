import React from "react";

function PreparingOrders({ orders, markOrderAsReady }) {
  return (
    <div className="card">
      <h3 className="status-header preparing">Currently Preparing</h3>
      <div className="kitchen-orders">
        {orders.map(order => (
          <div key={order.id} className="kitchen-order-item preparing">
            <div className="order-main-info">
              <div className="order-header">
                <h4>{order.orderId} <span className="order-type-badge">{order.type}</span></h4>
              </div>
              <p className="customer-name">Customer: {order.customer}</p>
              <div className="order-details">
                <h5>Cooking in Progress:</h5>
                {order.details.map((detail, index) => (
                  <div key={index} className="order-detail-item">
                    <span className="item-quantity">{detail.quantity}x</span>
                    <span className="item-name">{detail.item}</span>
                    <span className="item-station">{detail.station}</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '60%'}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="kitchen-actions">
              <button className="btn btn-complete-cooking" onClick={() => markOrderAsReady(order.id)}>Mark as Ready</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PreparingOrders;
