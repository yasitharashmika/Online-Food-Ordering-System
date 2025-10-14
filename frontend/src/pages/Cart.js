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

    // --- UPDATE 1: Create a reusable function to fetch cart items ---
    // We use useCallback to prevent this function from being recreated on every render
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
            // Fetch both cart and profile in parallel
            try {
                await fetchCartItems(loggedInUser.email); // Use the new function

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
    }, [navigate, fetchCartItems]); // Add fetchCartItems to the dependency array

    // --- UPDATE 2: Fix the decrement bug and refetch data after update ---
    const handleQuantityChange = async (itemId, newQuantity) => {
        // If quantity is 0 or less, treat it as a removal
        if (newQuantity < 1) {
            handleRemoveItem(itemId);
            return;
        }
        try {
            await axios.put(`${API_BASE_URL}/api/v1/cart/update/${itemId}`, { quantity: newQuantity });
            // Instead of manually updating state, refetch the cart for reliability
            if (user) {
                fetchCartItems(user.email);
            }
        } catch (err) {
            console.error('Failed to update quantity:', err);
            setError('Could not update item quantity.');
        }
    };
    
    // --- UPDATE 3: Refetch data after removing an item ---
    const handleRemoveItem = async (itemId) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/v1/cart/remove/${itemId}`);
            // Refetch the cart to ensure the UI is in sync with the database
            if (user) {
                fetchCartItems(user.email);
            }
        } catch (err) {
            console.error('Failed to remove item:', err);
            setError('Could not remove item from cart.');
        }
    };
    
    // This function doesn't need changes
    const handleDetailChange = (e) => {
        const { name, value } = e.target;
        setDeliveryDetails(prev => ({ ...prev, [name]: value }));
    };

    // This function doesn't need changes
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

    if (loading) return <p className="cart-loading">Loading your cart...</p>;
    if (error) return <p className="cart-error">{error}</p>;

    return (
        <div className="cart-page">
            <div className="cart-container">
                <h1 className="cart-title">Your Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty. Go to the <a href="/menu">menu</a> to add items.</p>
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
                                        <div className="quantity-control">
                                            <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <p className="item-total">${(item.price * item.quantity).toFixed(2)}</p>
                                        <button className="remove-btn" onClick={() => handleRemoveItem(item.id)}>Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="cart-summary">
                            <h2>Order Summary</h2>
                            <p>Subtotal: <span>${subtotal.toFixed(2)}</span></p>
                            
                            <div className="checkout-options">
                                <h3>Checkout Options</h3>
                                <div className="payment-methods">
                                    <label><input type="radio" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} /> Cash on Delivery (COD)</label>
                                    <label><input type="radio" value="Pickup" checked={paymentMethod === 'Pickup'} onChange={(e) => setPaymentMethod(e.target.value)} /> Pickup</label>
                                    <label><input type="radio" value="Table" checked={paymentMethod === 'Table'} onChange={(e) => setPaymentMethod(e.target.value)} /> For Table</label>
                                </div>

                                {paymentMethod === 'COD' && (
                                    <div className="delivery-details-form">
                                        <h4>Delivery Details</h4>
                                        <input type="tel" name="phone" value={deliveryDetails.phone} onChange={handleDetailChange} placeholder="Phone Number" required />
                                        <input type="text" name="street" value={deliveryDetails.street} onChange={handleDetailChange} placeholder="Street Address" required />
                                        <input type="text" name="city" value={deliveryDetails.city} onChange={handleDetailChange} placeholder="City" required />
                                        <input type="text" name="postalCode" value={deliveryDetails.postalCode} onChange={handleDetailChange} placeholder="Postal Code" />
                                    </div>
                                )}

                                {paymentMethod === 'Table' && (
                                    <div className="table-number-form">
                                        <h4>Table Information</h4>
                                        <input type="text" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder="Enter Your Table Number" />
                                    </div>
                                )}
                            </div>
                            
                            <button className="place-order-btn" onClick={handlePlaceOrder}>Place Order</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;