import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { useNavigate } from 'react-router-dom';
import '../style/Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [tableNumber, setTableNumber] = useState('');
    const [deliveryDetails, setDeliveryDetails] = useState({ phone: '', street: '', city: '', postalCode: '' });
    const navigate = useNavigate();

    const fetchCartItems = useCallback(async (email) => {
        try {
            const cartRes = await axios.get(`${API_BASE_URL}/api/v1/cart/${email}`);
            setCartItems(cartRes.data);
        } catch (err) {
            setError('Failed to load cart items.');
            console.error(err);
        }
    }, []);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedInUser) {
            navigate('/login');
            return;
        }
        setUser(loggedInUser);

        const fetchInitialData = async () => {
            setLoading(true);
            try {
                await fetchCartItems(loggedInUser.email);

                const profileRes = await axios.get(`${API_BASE_URL}/api/v1/user/profile/${loggedInUser.email}`);
                const profile = profileRes.data.data;
                setDeliveryDetails({
                    phone: profile.phone || '',
                    street: profile.address?.street || '',
                    city: profile.address?.city || '',
                    postalCode: profile.address?.postalCode || '',
                });
            } catch (err) {
                setError('Failed to load initial page data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [navigate, fetchCartItems]);

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) {
            handleRemoveItem(itemId);
            return;
        }
        try {
            await axios.put(`${API_BASE_URL}/api/v1/cart/update/${itemId}`, { quantity: newQuantity });
            if (user) {
                fetchCartItems(user.email);
            }
        } catch (err) {
            console.error('Failed to update quantity:', err);
            setError('Could not update item quantity.');
        }
    };
    
    const handleRemoveItem = async (itemId) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/v1/cart/remove/${itemId}`);
            if (user) {
                fetchCartItems(user.email);
            }
        } catch (err) {
            console.error('Failed to remove item:', err);
            setError('Could not remove item from cart.');
        }
    };
    
    const handleDetailChange = (e) => {
        const { name, value } = e.target;
        setDeliveryDetails(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async () => {
        if (paymentMethod === 'COD' && (!deliveryDetails.phone || !deliveryDetails.street || !deliveryDetails.city)) {
            alert('Please fill in your phone and address for delivery.');
            return;
        }
        if (paymentMethod === 'Table' && !tableNumber) {
            alert('Please enter your table number.');
            return;
        }

        try {
            if (paymentMethod === 'COD') {
                const profileDTO = {
                    name: user.name,
                    phone: deliveryDetails.phone,
                    address: {
                        street: deliveryDetails.street,
                        city: deliveryDetails.city,
                        postalCode: deliveryDetails.postalCode,
                    },
                };
                await axios.put(`${API_BASE_URL}/api/v1/user/profile/${user.email}`, profileDTO);
            }

            const payload = {
                userEmail: user.email,
                paymentMethod: paymentMethod,
                tableNumber: paymentMethod === 'Table' ? tableNumber : null
            };
            const response = await axios.post(`${API_BASE_URL}/api/v1/order/place-from-cart`, payload);

            alert(response.data.message);
            navigate('/user/dashboard/orders');
        } catch (err) {
            console.error('Failed to place order:', err);
            alert('There was an error placing your order. Please try again.');
        }
    };

    const subtotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cartItems]);

    if (loading) return (
        <div className="cart-wrapper">
            <div className="cart-container">
                <p className="cart-loading">Loading your cart...</p>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="cart-wrapper">
            <div className="cart-container">
                <p className="cart-error">{error}</p>
            </div>
        </div>
    );

    return (
        <div className="cart-wrapper">
            <div className="cart-container">
                <h1 className="cart-title">Your Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <p className="cart-empty-message">
                        Your cart is empty. Go to the <a href="/menu">menu</a> to add items.
                    </p>
                ) : (
                    <>
                        <div className="cart-items-list">
                            {cartItems.map(item => (
                                <div className="cart-item" key={item.id}>
                                    <div className="cart-item-details">
                                        <h3>{item.name}</h3>
                                        <p>${item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="cart-item-actions">
                                        <div className="cart-quantity-control">
                                            <button 
                                                className="cart-quantity-btn"
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <span className="cart-quantity-display">{item.quantity}</span>
                                            <button 
                                                className="cart-quantity-btn"
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</p>
                                        <button 
                                            className="cart-remove-btn" 
                                            onClick={() => handleRemoveItem(item.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="cart-summary">
                            <h2>Order Summary</h2>
                            <div className="cart-subtotal">
                                <span>Subtotal:</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            
                            <div className="cart-checkout-options">
                                <h3>Checkout Options</h3>
                                <div className="cart-payment-methods">
                                    <label>
                                        <input 
                                            type="radio" 
                                            value="COD" 
                                            checked={paymentMethod === 'COD'} 
                                            onChange={(e) => setPaymentMethod(e.target.value)} 
                                        /> 
                                        Cash on Delivery (COD)
                                    </label>
                                    <label>
                                        <input 
                                            type="radio" 
                                            value="Pickup" 
                                            checked={paymentMethod === 'Pickup'} 
                                            onChange={(e) => setPaymentMethod(e.target.value)} 
                                        /> 
                                        Pickup
                                    </label>
                                    <label>
                                        <input 
                                            type="radio" 
                                            value="Table" 
                                            checked={paymentMethod === 'Table'} 
                                            onChange={(e) => setPaymentMethod(e.target.value)} 
                                        /> 
                                        For Table
                                    </label>
                                </div>

                                {paymentMethod === 'COD' && (
                                    <div className="cart-delivery-form">
                                        <h4>Delivery Details</h4>
                                        <input 
                                            type="tel" 
                                            name="phone" 
                                            value={deliveryDetails.phone} 
                                            onChange={handleDetailChange} 
                                            placeholder="Phone Number" 
                                            required 
                                            className="cart-form-input"
                                        />
                                        <input 
                                            type="text" 
                                            name="street" 
                                            value={deliveryDetails.street} 
                                            onChange={handleDetailChange} 
                                            placeholder="Street Address" 
                                            required 
                                            className="cart-form-input"
                                        />
                                        <input 
                                            type="text" 
                                            name="city" 
                                            value={deliveryDetails.city} 
                                            onChange={handleDetailChange} 
                                            placeholder="City" 
                                            required 
                                            className="cart-form-input"
                                        />
                                        <input 
                                            type="text" 
                                            name="postalCode" 
                                            value={deliveryDetails.postalCode} 
                                            onChange={handleDetailChange} 
                                            placeholder="Postal Code" 
                                            className="cart-form-input"
                                        />
                                    </div>
                                )}

                                {paymentMethod === 'Table' && (
                                    <div className="cart-table-form">
                                        <h4>Table Information</h4>
                                        <input 
                                            type="text" 
                                            value={tableNumber} 
                                            onChange={(e) => setTableNumber(e.target.value)} 
                                            placeholder="Enter Your Table Number" 
                                            className="cart-form-input"
                                        />
                                    </div>
                                )}
                            </div>
                            
                            <button className="cart-place-order-btn" onClick={handlePlaceOrder}>
                                Place Order
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;