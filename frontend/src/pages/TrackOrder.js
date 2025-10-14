import React, { useState } from 'react';
import '../style/TrackOrder.css';
import axios from 'axios';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter an Order ID.');
      return;
    }

    setOrderDetails(null);
    setError('');
    setLoading(true);

    const searchId = orderId.startsWith('#') ? orderId.substring(1) : orderId;

    try {
      const response = await axios.get(`http://localhost:8080/api/v1/order/track/${searchId}`);
      setOrderDetails(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError(`Sorry, we couldn't find an order with the ID "${orderId}".`);
      } else {
        setError('An error occurred while fetching your order. Please try again later.');
      }
      setOrderDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => {
    const statuses = ['ready to prepare', 'preparing', 'ready', 'picked up', 'delivered'];
    return statuses.indexOf(status?.toLowerCase());
  };

  const currentStatusIndex = getStatusIndex(orderDetails?.orderStatus);

  const progressSteps = [
    { name: 'Order Received', icon: 'fa-receipt' },
    { name: 'Preparing', icon: 'fa-utensils' },
    { name: 'Ready', icon: 'fa-check-circle' },
    { name: 'Out for Delivery', icon: 'fa-truck' },
    { name: 'Delivered', icon: 'fa-home' }
  ];

  const formatDate = (datetime) => {
    if (!datetime) return { date: 'N/A', time: 'N/A' };
    const date = new Date(datetime);
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString('en-US', timeOptions)
    };
  };

  const { date: orderDate, time: orderTime } = formatDate(orderDetails?.orderDateTime);

  return (
    <div className="to-page">
      <h1 className="to-title">Track Your Order</h1>
      <div className="to-search-container">
        <form onSubmit={handleSearch} className="to-search-form">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter your Order ID (e.g., ORD59D9E07D)"
            className="to-search-input"
          />
          <button type="submit" className="to-search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && <p className="to-error">{error}</p>}

      {orderDetails && (
        <div className="to-details">
          <h2 className="to-header">Order {orderDetails.orderId}</h2>

          <div className="to-progress">
            {progressSteps.map((step, index) => (
              <div
                key={step.name}
                className={`to-step ${
                  index < currentStatusIndex ? 'to-completed' : ''
                } ${index === currentStatusIndex ? 'to-active' : ''}`}
              >
                <div className="to-icon">
                  <i className={`fas ${step.icon}`}></i>
                </div>
                <p className="to-step-name">{step.name}</p>
              </div>
            ))}
          </div>

          <div className="to-info-grid">
            <div className="to-info-box">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
              <p><strong>Order Time:</strong> {orderDate}, {orderTime}</p>
              <p><strong>Delivery Address:</strong> {orderDetails.customerStreet}, {orderDetails.customerCity}</p>
            </div>

            <div className="to-info-box">
              <h3>Order Items</h3>
              <ul>
                {orderDetails.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p style={{ marginTop: '10px' }}>
                <strong>Total:</strong> ${orderDetails.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          {orderDetails.assignedRider && (
            <div className="to-rider">
              <h3>Your rider is on the way!</h3>
              <p>{orderDetails.assignedRider} is assigned to your delivery.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
