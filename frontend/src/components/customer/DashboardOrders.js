import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection
import API_BASE_URL from '../../config'; // Import your API base URL

const DashboardOrders = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return '#8B5CF6'; // Purple
            case 'completed': return '#10B981'; // Green
            case 'cancelled': return '#EF4444'; // Red
            case 'picked up': return '#F59E0B'; // Amber
            default: return '#6B7280'; // Gray for other statuses
        }
    };

    // --- FETCH ORDER HISTORY FROM BACKEND ---
    useEffect(() => {
        const fetchOrderHistory = async () => {
            // Retrieve the logged-in user from localStorage
            const user = JSON.parse(localStorage.getItem('user'));

            if (!user || !user.email) {
                setError("Could not find user email. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/v1/order/history/${user.email}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch order history.');
                }
                const data = await response.json();
                setOrderHistory(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, []); // Empty dependency array means this runs once when the component mounts

    // --- HANDLE REORDER CLICK ---
    const handleReorder = () => {
        // Navigate to the menu page
        navigate('/menu');
    };

    // --- RENDER LOGIC ---
    if (loading) {
        return <div className="tab-content"><p>Loading order history...</p></div>;
    }

    if (error) {
        return <div className="tab-content"><p>Error: {error}</p></div>;
    }

    return (
        <div className="tab-content">
            <div className="content-section">
                <h2>Order History</h2>
                <div className="table-container">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderHistory.length > 0 ? (
                                orderHistory.map(order => (
                                    <tr key={order.id}>
                                        <td>{order.orderId}</td>
                                        <td>{new Date(order.orderDateTime).toLocaleDateString()}</td>
                                        <td>
                                            {Array.isArray(order.items)
                                                ? order.items.join(', ')
                                                : 'N/A'}
                                        </td>
                                        <td>$. {order.totalAmount.toFixed(2)}</td>
                                        <td>
                                            <span className="status-badge" style={{ backgroundColor: getStatusColor(order.orderStatus) }}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="reorder-btn" onClick={handleReorder}>
                                                Reorder
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No past orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardOrders;