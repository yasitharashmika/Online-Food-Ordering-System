import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure to install axios: npm install axios

const DashboardOverview = () => {
    const [stats, setStats] = useState(null);
    const [activeOrders, setActiveOrders] = useState([]);
    const [upcomingReservations, setUpcomingReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // This helper function can be shared or kept in components that need it
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'preparing': return '#F59E0B'; // Amber
            case 'ready to prepare': return '#F59E0B'; // Also Amber for this status
            case 'out for delivery': return '#3B82F6'; // Blue
            case 'picked up': return '#3B82F6'; // Blue
            case 'confirmed': return '#10B981'; // Green
            case 'ready': return '#8B5CF6'; // Violet
            default: return '#6B7280'; // Gray
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            const storedUser = localStorage.getItem('user');

            if (!storedUser) {
                setError('You must be logged in to view the dashboard.');
                setLoading(false);
                return;
            }

            try {
                const userData = JSON.parse(storedUser);
                const userEmail = userData.email;

                if (!userEmail) {
                    setError('Could not find user email. Please log in again.');
                    setLoading(false);
                    return;
                }
                
                setLoading(true);
                setError('');

                const response = await axios.get(`http://localhost:8080/api/v1/dashboard/overview/${userEmail}`);
                
                if (response.data) {
                    setStats(response.data.stats);
                    setActiveOrders(response.data.activeOrders);
                    setUpcomingReservations(response.data.upcomingReservations);
                }
            } catch (err) {
                setError('Failed to load dashboard data. Please try again later.');
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="tab-content"><p>Loading dashboard...</p></div>;
    }

    if (error) {
        return <div className="tab-content"><p style={{ color: 'red' }}>{error}</p></div>;
    }

    return (
        <div className="tab-content">
            <div className="stats-grid">
                <div className="stat-card"><div className="stat-icon">📦</div><div className="stat-info"><h3>{stats?.totalOrders || 0}</h3><p>Total Orders</p></div></div>
                <div className="stat-card"><div className="stat-icon">⏳</div><div className="stat-info"><h3>{stats?.activeOrders || 0}</h3><p>Active Orders</p></div></div>
                <div className="stat-card"><div className="stat-icon">🗓️</div><div className="stat-info"><h3>{stats?.upcomingReservations || 0}</h3><p>Upcoming Reservations</p></div></div>
            </div>
            
            <div className="content-section">
                <h2>Active Orders</h2>
                {activeOrders.length > 0 ? (
                    <div className="orders-grid">
                        {activeOrders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header"><h4>Order {order.id}</h4><span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>{order.status}</span></div>
                                <p className="order-restaurant">{order.restaurant}</p>
                                <p className="order-items">{order.items}</p>
                                <p className="order-time">Placed: {order.time}</p>
                                {/* ✅ REMOVED BUTTON FROM HERE */}
                            </div>
                        ))}
                    </div>
                ) : <p>No active orders.</p>}
            </div>

            <div className="content-section">
                <h2>Upcoming Reservations</h2>
                {upcomingReservations.length > 0 ? (
                    <div className="reservations-grid">
                        {upcomingReservations.map(res => (
                            <div key={res.id} className="reservation-card">
                                <div className="reservation-header"><h4>{res.restaurant}</h4><span className="status-badge" style={{ backgroundColor: getStatusColor(res.status) }}>{res.status}</span></div>
                                <p className="reservation-date">{res.date}</p>
                                <p className="reservation-details">{res.table} • {res.guests} guests</p>
                                {/* ✅ REMOVED BUTTON FROM HERE */}
                            </div>
                        ))}
                    </div>
                ) : <p>You have no upcoming reservations.</p>}
            </div>
        </div>
    );
};

export default DashboardOverview;