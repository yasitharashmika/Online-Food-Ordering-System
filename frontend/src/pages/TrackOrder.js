
import React from 'react';
import '../style/TrackOrder.css';

const TrackOrder = () => {
  const order = {
    id: "12345",
    time: "Today, 6:30 PM",
    estimated: "7:15 PM",
    address: "123 Main St, Colombo",
    items: [
      { name: "Margherita Pizza", qty: 1 },
      { name: "Garlic Bread", qty: 1 },
      { name: "Coca Cola", qty: 2 },
    ],
    total: 24.99,
  };

  const steps = ["Order Received", "Preparing", "Ready", "Out for Delivery", "Delivered"];

  return (
    <div className="track-page">
      <h1>Track Your Order</h1>
      <p className="subtitle">Follow your order in real-time</p>

      <div className="order-card">
        <h2>Order #{order.id}</h2>

        {/* Progress Bar */}
        <div className="progress-bar">
          {steps.map((step, index) => (
            <div key={index} className="step">
              <div className={`circle ${index === 0 ? "active" : ""}`}></div>
              <p>{step}</p>
              {index < steps.length - 1 && <div className="line"></div>}
            </div>
          ))}
        </div>

        {/* Order Info */}
        <div className="order-details">
          <div>
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Order Time:</strong> {order.time}</p>
            <p><strong>Estimated Delivery:</strong> {order.estimated}</p>
            <p><strong>Delivery Address:</strong> {order.address}</p>
          </div>

          <div>
            <h3>Order Items</h3>
            <ul>
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.qty}x {item.name}
                </li>
              ))}
            </ul>
            <p className="total">Total: ${order.total.toFixed(2)}</p>
          </div>
        </div>

        {/* Status Message */}
        <div className="status-box">
          🚴 Your rider is on the way! Estimated arrival in 15 minutes.
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
