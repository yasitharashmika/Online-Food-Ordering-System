import React, { useState, useEffect } from "react";
import "../style/TrackOrder.css";

const OrderTracking = () => {
  const [activeOrder, setActiveOrder] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Simulate real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate order progress
  useEffect(() => {
    if (activeOrder) {
      const progressTimer = setInterval(() => {
        setActiveOrder(prev => {
          if (!prev) return null;
          
          const currentStatus = prev.status;
          const statusOrder = ["confirmed", "preparing", "cooking", "ready", "out-for-delivery", "delivered"];
          const currentIndex = statusOrder.indexOf(currentStatus);
          
          // Simulate status progression based on time
          if (currentIndex < statusOrder.length - 1 && timeElapsed % 30 === 0) {
            return {
              ...prev,
              status: statusOrder[currentIndex + 1],
              statusHistory: [
                ...prev.statusHistory,
                {
                  status: statusOrder[currentIndex + 1],
                  timestamp: new Date().toLocaleTimeString(),
                  description: getStatusDescription(statusOrder[currentIndex + 1])
                }
              ]
            };
          }
          
          return prev;
        });
      }, 5000);

      return () => clearInterval(progressTimer);
    }
  }, [activeOrder, timeElapsed]);

  const sampleOrder = {
    id: "#ORD-7842",
    status: "preparing",
    orderType: "delivery",
    orderTime: "7:15 PM",
    estimatedDelivery: "7:45 PM",
    items: [
      {
        id: 1,
        name: "Margherita Pizza",
        quantity: 1,
        price: 12.99,
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=100&h=100&fit=crop"
      },
      {
        id: 2,
        name: "Garlic Bread",
        quantity: 2,
        price: 4.99,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop"
      },
      {
        id: 3,
        name: "Caesar Salad",
        quantity: 1,
        price: 8.99,
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=100&h=100&fit=crop"
      }
    ],
    total: 31.96,
    deliveryAddress: "123 Main Street, Apt 4B, New York, NY 10001",
    restaurant: "Tony's Pizzeria",
    rider: {
      name: "Michael Rodriguez",
      phone: "+1 (555) 123-4567",
      vehicle: "Motorcycle",
      plate: "ABC-123",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    statusHistory: [
      {
        status: "confirmed",
        timestamp: "7:15 PM",
        description: "Order confirmed and payment processed"
      },
      {
        status: "preparing",
        timestamp: "7:18 PM",
        description: "Kitchen started preparing your order"
      }
    ]
  };

  const getStatusDescription = (status) => {
    const descriptions = {
      "confirmed": "Order confirmed and payment processed",
      "preparing": "Kitchen started preparing your order",
      "cooking": "Your food is being cooked",
      "ready": "Order is ready for pickup/delivery",
      "out-for-delivery": "Rider is on the way with your order",
      "delivered": "Order has been delivered"
    };
    return descriptions[status] || "Status updated";
  };

  const getStatusPercentage = (status) => {
    const statusOrder = ["confirmed", "preparing", "cooking", "ready", "out-for-delivery", "delivered"];
    const currentIndex = statusOrder.indexOf(status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  const getEstimatedTime = () => {
    if (!activeOrder) return "Calculating...";
    
    const orderTime = new Date(`2024-01-01 ${activeOrder.orderTime}`);
    const estimatedTime = new Date(`2024-01-01 ${activeOrder.estimatedDelivery}`);
    const now = new Date(orderTime.getTime() + timeElapsed * 1000);
    
    const remainingMs = estimatedTime.getTime() - now.getTime();
    const remainingMinutes = Math.max(0, Math.ceil(remainingMs / 60000));
    
    return `${remainingMinutes} min`;
  };

  const handleTrackOrder = () => {
    setActiveOrder(sampleOrder);
    setTimeElapsed(0);
  };

  const statusConfig = {
    "confirmed": { icon: "📝", color: "#3B82F6", text: "Order Confirmed" },
    "preparing": { icon: "👨‍🍳", color: "#8B5CF6", text: "Preparing" },
    "cooking": { icon: "🍳", color: "#F59E0B", text: "Cooking" },
    "ready": { icon: "✅", color: "#10B981", text: "Ready" },
    "out-for-delivery": { icon: "🚚", color: "#EF4444", text: "Out for Delivery" },
    "delivered": { icon: "🎉", color: "#059669", text: "Delivered" }
  };

  if (!activeOrder) {
    return (
      <div className="customer-order-tracking-page">
        <div className="customer-order-tracking-container">
          <div className="customer-no-active-order">
            <div className="customer-track-icon">📱</div>
            <h2>Track Your Order</h2>
            <p>Enter your order details to track its progress in real-time</p>
            
            <div className="customer-track-order-form">
              <div className="customer-form-group">
                <label>Order ID</label>
                <input 
                  type="text" 
                  placeholder="Enter your order ID (e.g., #ORD-7842)"
                  defaultValue="#ORD-7842"
                />
              </div>
              <div className="customer-form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="Enter your phone number"
                  defaultValue="+1 (555) 123-4567"
                />
              </div>
              <button 
                className="customer-track-btn"
                onClick={handleTrackOrder}
              >
                Track Order
              </button>
            </div>

            <div className="customer-sample-orders">
              <h3>Recent Orders</h3>
              <div className="customer-recent-order-card">
                <div className="customer-recent-order-info">
                  <strong>#ORD-7842</strong>
                  <span>Tony's Pizzeria</span>
                  <span className="customer-order-status preparing">Preparing</span>
                </div>
                <button 
                  className="customer-track-this-btn"
                  onClick={handleTrackOrder}
                >
                  Track
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-order-tracking-page">
      <div className="customer-order-tracking-container">
        {/* Header */}
        <div className="customer-tracking-header">
          <h2>Order Tracking</h2>
          <p className="customer-order-id">Order {activeOrder.id}</p>
        </div>

        {/* Progress Bar */}
        <div className="customer-tracking-progress">
          <div className="customer-progress-bar">
            <div 
              className="customer-progress-fill"
              style={{ width: `${getStatusPercentage(activeOrder.status)}%` }}
            ></div>
          </div>
          
          <div className="customer-progress-steps">
            {Object.entries(statusConfig).map(([status, config]) => (
              <div 
                key={status}
                className={`customer-progress-step ${
                  Object.keys(statusConfig).indexOf(status) <= 
                  Object.keys(statusConfig).indexOf(activeOrder.status) ? 'active' : ''
                }`}
              >
                <div 
                  className="customer-step-icon"
                  style={{ 
                    backgroundColor: Object.keys(statusConfig).indexOf(status) <= 
                    Object.keys(statusConfig).indexOf(activeOrder.status) ? config.color : '#6B7280' 
                  }}
                >
                  {config.icon}
                </div>
                <span className="customer-step-text">{config.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="customer-tracking-sections">
          <div className="customer-tracking-left">
            {/* Current Status */}
            <div className="customer-status-card">
              <h3>Current Status</h3>
              <div className="customer-current-status">
                <div 
                  className="customer-status-badge"
                  style={{ backgroundColor: statusConfig[activeOrder.status].color }}
                >
                  {statusConfig[activeOrder.status].icon}
                  <span>{statusConfig[activeOrder.status].text}</span>
                </div>
                <p className="customer-status-description">
                  {getStatusDescription(activeOrder.status)}
                </p>
                
                <div className="customer-time-info">
                  <div className="customer-time-item">
                    <span>Order placed:</span>
                    <strong>{activeOrder.orderTime}</strong>
                  </div>
                  <div className="customer-time-item">
                    <span>Estimated {activeOrder.orderType}:</span>
                    <strong>{activeOrder.estimatedDelivery}</strong>
                  </div>
                  <div className="customer-time-item">
                    <span>Time remaining:</span>
                    <strong className="customer-time-remaining">{getEstimatedTime()}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="customer-order-items-card">
              <h3>Order Details</h3>
              <div className="customer-tracking-items">
                {activeOrder.items.map(item => (
                  <div key={item.id} className="customer-tracking-item">
                    <img src={item.image} alt={item.name} />
                    <div className="customer-tracking-item-info">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <span className="customer-item-price">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="customer-order-total">
                <span>Total:</span>
                <span>${activeOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Status History */}
            <div className="customer-status-history">
              <h3>Status History</h3>
              <div className="customer-timeline">
                {activeOrder.statusHistory.map((history, index) => (
                  <div key={index} className="customer-timeline-item">
                    <div className="customer-timeline-marker"></div>
                    <div className="customer-timeline-content">
                      <div className="customer-timeline-header">
                        <strong>{history.status.replace(/-/g, ' ').toUpperCase()}</strong>
                        <span>{history.timestamp}</span>
                      </div>
                      <p>{history.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="customer-tracking-right">
            {/* Restaurant Info */}
            <div className="customer-restaurant-card">
              <h3>Restaurant</h3>
              <div className="customer-restaurant-info">
                <div className="customer-restaurant-avatar">🍕</div>
                <div className="customer-restaurant-details">
                  <strong>{activeOrder.restaurant}</strong>
                  <span>Preparing your order</span>
                </div>
              </div>
              {activeOrder.orderType === "delivery" && (
                <div className="customer-delivery-address">
                  <h4>Delivery Address</h4>
                  <p>{activeOrder.deliveryAddress}</p>
                </div>
              )}
            </div>

            {/* Rider Info */}
            {activeOrder.orderType === "delivery" && activeOrder.status === "out-for-delivery" && (
              <div className="customer-rider-card">
                <h3>Your Rider</h3>
                <div className="customer-rider-info">
                  <img src={activeOrder.rider.image} alt={activeOrder.rider.name} />
                  <div className="customer-rider-details">
                    <strong>{activeOrder.rider.name}</strong>
                    <span>{activeOrder.rider.vehicle} • {activeOrder.rider.plate}</span>
                    <div className="customer-rider-rating">
                      ⭐ {activeOrder.rider.rating}
                    </div>
                  </div>
                </div>
                <div className="customer-rider-actions">
                  <button className="customer-call-rider">
                    📞 Call Rider
                  </button>
                  <button className="customer-message-rider">
                    💬 Message
                  </button>
                </div>
              </div>
            )}

            {/* Help Section */}
            <div className="customer-help-card">
              <h3>Need Help?</h3>
              <p>If you have any questions about your order, we're here to help.</p>
              <div className="customer-help-actions">
                <button className="customer-contact-support">
                  📞 Contact Support
                </button>
                <button className="customer-cancel-order">
                  ❌ Cancel Order
                </button>
              </div>
            </div>

            {/* Live Map (Placeholder) */}
            {activeOrder.orderType === "delivery" && activeOrder.status === "out-for-delivery" && (
              <div className="customer-live-map">
                <h3>Live Tracking</h3>
                <div className="customer-map-placeholder">
                  <div className="customer-map-marker">📍</div>
                  <p>Rider is on the way to your location</p>
                  <div className="customer-map-route">
                    <div className="customer-route-point start">Restaurant</div>
                    <div className="customer-route-line"></div>
                    <div className="customer-route-point end">Your Location</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;