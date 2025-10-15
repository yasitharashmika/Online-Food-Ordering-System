import React from "react";

function PreparingOrders({ orders, markOrderAsReady }) {
  return (
    <div className="kitchen-orders-wrapper">
      <div className="kitchen-orders-card">
        <h3 className="kitchen-orders-status-header-preparing">Currently Preparing</h3>
        <div className="kitchen-orders-list">
          {orders.map(order => (
            <div key={order.id} className="kitchen-orders-item kitchen-orders-item-preparing">
              <div className="kitchen-orders-main-info">
                <div className="kitchen-orders-header">
                  <h4>
                    {order.orderId} 
                    <span className="kitchen-orders-type-badge">{order.type}</span>
                  </h4>
                </div>
                <p className="kitchen-orders-customer-name">Customer: {order.customer}</p>
                <div className="kitchen-orders-details">
                  <h5>Cooking in Progress:</h5>
                  {order.details.map((detail, index) => (
                    <div key={index} className="kitchen-orders-detail-item">
                      <span className="kitchen-orders-item-quantity">{detail.quantity}x</span>
                      <span className="kitchen-orders-item-name">{detail.item}</span>
                      <span className="kitchen-orders-item-station">{detail.station}</span>
                      <div className="kitchen-orders-progress-bar">
                        <div className="kitchen-orders-progress-fill" style={{width: '60%'}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="kitchen-orders-actions">
                <button 
                  className="kitchen-orders-btn kitchen-orders-btn-complete-cooking" 
                  onClick={() => markOrderAsReady(order.id)}
                >
                  Mark as Ready
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PreparingOrders;