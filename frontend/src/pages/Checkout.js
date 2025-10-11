import React, { useState } from "react";
import "../style/Checkout.css";

const Checkout = () => {
  const [orderType, setOrderType] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    specialInstructions: ""
  });

  const cartItems = [
    {
      id: 1,
      name: "Margherita Pizza",
      price: 12.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=150&h=150&fit=crop",
      description: "Classic tomato sauce and mozzarella"
    },
    {
      id: 2,
      name: "Caesar Salad",
      price: 8.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=150&h=150&fit=crop",
      description: "Fresh romaine with caesar dressing"
    },
    {
      id: 3,
      name: "Chocolate Brownie",
      price: 6.50,
      quantity: 3,
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=150&h=150&fit=crop",
      description: "Warm chocolate brownie with ice cream"
    }
  ];

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    // In a real app, this would update the global cart state
    console.log(`Update item ${id} quantity to ${newQuantity}`);
  };

  const removeItem = (id) => {
    // In a real app, this would remove from global cart state
    console.log(`Remove item ${id}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.08;
  };

  const getDeliveryFee = () => {
    return orderType === "delivery" ? 2.99 : 0;
  };

  const getTotal = () => {
    return getSubtotal() + getTax() + getDeliveryFee();
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // Handle order placement logic here
    console.log("Placing order with data:", { formData, orderType, paymentMethod, cartItems });
    alert("Order placed successfully!");
  };

  return (
    <div className="customer-checkout-page">
      <div className="customer-checkout-container">
        <div className="customer-checkout-header">
          <h2>Checkout</h2>
          <p className="customer-checkout-subtitle">
            Complete your order
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="customer-checkout-content">
          {/* Left Column - Order Details & Information */}
          <div className="customer-checkout-left">
            {/* Order Type Selection */}
            <div className="customer-checkout-section">
              <h3>Order Type</h3>
              <div className="customer-order-type-selector">
                <button
                  type="button"
                  className={`customer-order-type-btn ${orderType === "delivery" ? "active" : ""}`}
                  onClick={() => setOrderType("delivery")}
                >
                  <span className="customer-order-type-icon">🚚</span>
                  <span>Delivery</span>
                  <span className="customer-order-type-fee">+$2.99</span>
                </button>
                <button
                  type="button"
                  className={`customer-order-type-btn ${orderType === "pickup" ? "active" : ""}`}
                  onClick={() => setOrderType("pickup")}
                >
                  <span className="customer-order-type-icon">🏪</span>
                  <span>Pickup</span>
                  <span className="customer-order-type-fee">Free</span>
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="customer-checkout-section">
              <h3>Contact Information</h3>
              <div className="customer-form-grid">
                <div className="customer-form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="customer-form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="customer-form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="customer-form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {orderType === "delivery" && (
              <div className="customer-checkout-section">
                <h3>Delivery Address</h3>
                <div className="customer-form-group">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="customer-form-grid">
                  <div className="customer-form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="customer-form-group">
                    <label>ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="customer-checkout-section">
              <h3>Payment Method</h3>
              <div className="customer-payment-methods">
                <button
                  type="button"
                  className={`customer-payment-method ${paymentMethod === "card" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <span className="customer-payment-icon">💳</span>
                  Credit/Debit Card
                </button>
                <button
                  type="button"
                  className={`customer-payment-method ${paymentMethod === "cash" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("cash")}
                >
                  <span className="customer-payment-icon">💵</span>
                  Cash on Delivery
                </button>
                <button
                  type="button"
                  className={`customer-payment-method ${paymentMethod === "paypal" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("paypal")}
                >
                  <span className="customer-payment-icon">🔵</span>
                  PayPal
                </button>
              </div>

              {paymentMethod === "card" && (
                <div className="customer-card-form">
                  <div className="customer-form-group">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="customer-form-grid">
                    <div className="customer-form-group">
                      <label>Expiry Date *</label>
                      <input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="customer-form-group">
                      <label>CVV *</label>
                      <input
                        type="text"
                        name="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Special Instructions */}
            <div className="customer-checkout-section">
              <h3>Special Instructions</h3>
              <div className="customer-form-group">
                <textarea
                  name="specialInstructions"
                  placeholder="Any special requests or delivery instructions..."
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="customer-checkout-right">
            <div className="customer-order-summary-card">
              <h3>Order Summary</h3>
              
              {/* Order Items */}
              <div className="customer-order-items">
                {cartItems.map(item => (
                  <div key={item.id} className="customer-order-item">
                    <div className="customer-order-item-image">
                      <img src={item.image} alt={item.name} />
                      <span className="customer-item-quantity">{item.quantity}</span>
                    </div>
                    
                    <div className="customer-order-item-details">
                      <h4>{item.name}</h4>
                      <p>{item.description}</p>
                      <div className="customer-order-item-controls">
                        <div className="customer-quantity-controls">
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="customer-quantity-btn"
                          >
                            -
                          </button>
                          <span className="customer-quantity">{item.quantity}</span>
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="customer-quantity-btn"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="customer-remove-btn"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="customer-order-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="customer-price-breakdown">
                <div className="customer-price-row">
                  <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                
                {orderType === "delivery" && (
                  <div className="customer-price-row">
                    <span>Delivery Fee</span>
                    <span>${getDeliveryFee().toFixed(2)}</span>
                  </div>
                )}
                
                <div className="customer-price-row">
                  <span>Tax (8%)</span>
                  <span>${getTax().toFixed(2)}</span>
                </div>
                
                <div className="customer-price-divider"></div>
                
                <div className="customer-price-total">
                  <span>Total</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Estimated Time */}
              <div className="customer-estimated-time">
                <div className="customer-time-info">
                  <span className="customer-time-icon">⏱️</span>
                  <div>
                    <div className="customer-time-label">Estimated {orderType} time</div>
                    <div className="customer-time-value">
                      {orderType === "delivery" ? "25-35 minutes" : "15-20 minutes"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button type="submit" className="customer-place-order-btn">
                Place Order - ${getTotal().toFixed(2)}
              </button>

              <p className="customer-order-note">
                By placing your order, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;