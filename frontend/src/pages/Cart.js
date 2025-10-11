import React, { useState } from "react";
import "../style/Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
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
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.08; // 8% tax
  };

  const getTotal = () => {
    return getSubtotal() + getTax();
  };

  const deliveryFee = cartItems.length > 0 ? 2.99 : 0;

  return (
    <div className="customer-cart-page">
      <div className="customer-cart-container">
        <div className="customer-cart-header">
          <h2>Your Cart</h2>
          <p className="customer-cart-subtitle">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="customer-cart-content">
          {/* Cart Items */}
          <div className="customer-cart-items">
            {cartItems.length === 0 ? (
              <div className="customer-empty-cart">
                <div className="customer-empty-cart-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some delicious items to get started!</p>
                <button className="customer-browse-btn">Browse Menu</button>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="customer-cart-item">
                  <div className="customer-cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  
                  <div className="customer-cart-item-details">
                    <h4>{item.name}</h4>
                    <p className="customer-item-description">{item.description}</p>
                    <p className="customer-item-price">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="customer-cart-item-controls">
                    <div className="customer-quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="customer-quantity-btn"
                      >
                        -
                      </button>
                      <span className="customer-quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="customer-quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="customer-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="customer-remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="customer-order-summary">
              <h3>Order Summary</h3>
              
              <div className="customer-summary-row">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                <span>${getSubtotal().toFixed(2)}</span>
              </div>
              
              <div className="customer-summary-row">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              
              <div className="customer-summary-row">
                <span>Tax (8%)</span>
                <span>${getTax().toFixed(2)}</span>
              </div>
              
              <div className="customer-summary-divider"></div>
              
              <div className="customer-summary-total">
                <span>Total</span>
                <span>${(getTotal() + deliveryFee).toFixed(2)}</span>
              </div>

              <div className="customer-cart-actions">
                <button className="customer-checkout-btn">
                  Proceed to Checkout
                </button>
                <button className="customer-continue-shopping-btn">
                  Continue Shopping
                </button>
              </div>

              <div className="customer-delivery-info">
                <div className="customer-delivery-estimate">
                  <span>🚚 Estimated delivery</span>
                  <span>25-35 min</span>
                </div>
                <div className="customer-minimum-order">
                  <span>📦 Minimum order: $15.00</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recently Viewed Items */}
        {cartItems.length > 0 && (
          <div className="customer-recently-viewed">
            <h3>You might also like</h3>
            <div className="customer-suggested-items">
              <div className="customer-suggested-item">
                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&h=150&fit=crop" alt="Garlic Bread" />
                <h4>Garlic Bread</h4>
                <p>$4.99</p>
                <button className="customer-add-suggested-btn">Add to Cart</button>
              </div>
              <div className="customer-suggested-item">
                <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&h=150&fit=crop" alt="Pepperoni Pizza" />
                <h4>Pepperoni Pizza</h4>
                <p>$14.99</p>
                <button className="customer-add-suggested-btn">Add to Cart</button>
              </div>
              <div className="customer-suggested-item">
                <img src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=150&h=150&fit=crop" alt="French Fries" />
                <h4>French Fries</h4>
                <p>$3.99</p>
                <button className="customer-add-suggested-btn">Add to Cart</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;