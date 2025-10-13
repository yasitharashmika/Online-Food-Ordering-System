import React, { useState, useEffect } from 'react';

const DashboardOverview = () => {
    const [stats, setStats] = useState(null);
    const [activeOrders, setActiveOrders] = useState([]);
    const [upcomingReservations, setUpcomingReservations] = useState([]);

    // This helper function can be shared or kept in components that need it
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'preparing': return '#F59E0B';
            case 'out for delivery': return '#3B82F6';
            case 'confirmed': return '#10B981';
            default: return '#6B7280';
        }
    };

    useEffect(() => {
        // Load sample data for this specific page
        const sampleStats = { totalOrders: 15, activeOrders: 2, upcomingReservations: 1, loyaltyPoints: 320 };
        const sampleActiveOrders = [
            { id: "#ORD-987", restaurant: "Pizza Amore", items: "1x Pepperoni Pizza, 1x Coke", time: "12 mins", status: "Preparing" },
            { id: "#ORD-986", restaurant: "Curry Leaf", items: "2x Chicken Kottu", time: "5 mins", status: "Out for Delivery" },
        ];
        const sampleUpcomingReservations = [
            { id: "RES-003", restaurant: "The Lagoon", date: "2025-10-15 at 7:30 PM", table: "Table for 2", guests: 2, status: "Confirmed" },
        ];

        setStats(sampleStats);
        setActiveOrders(sampleActiveOrders);
        setUpcomingReservations(sampleUpcomingReservations);
    }, []);

    return (
        <div className="tab-content">
            <div className="stats-grid">
                <div className="stat-card"><div className="stat-icon">📦</div><div className="stat-info"><h3>{stats?.totalOrders || 0}</h3><p>Total Orders</p></div></div>
                <div className="stat-card"><div className="stat-icon">⏳</div><div className="stat-info"><h3>{stats?.activeOrders || 0}</h3><p>Active Orders</p></div></div>
                <div className="stat-card"><div className="stat-icon">🗓️</div><div className="stat-info"><h3>{stats?.upcomingReservations || 0}</h3><p>Upcoming Reservations</p></div></div>
                <div className="stat-card"><div className="stat-icon">⭐</div><div className="stat-info"><h3>{stats?.loyaltyPoints || 0}</h3><p>Loyalty Points</p></div></div>
            </div>
            <div className="content-section">
                <h2>Active Orders</h2>
                {activeOrders.length > 0 ? (
                    <div className="orders-grid">
                        {activeOrders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header"><h4>Order {order.id}</h4><span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>{order.status}</span></div>
                                <p className="order-restaurant">{order.restaurant}</p><p className="order-items">{order.items}</p><p className="order-time">Estimated: {order.time}</p><button className="track-btn">Track Order</button>
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
                                <p className="reservation-date">{res.date}</p><p className="reservation-details">{res.table} • {res.guests} guests</p><button className="view-btn">View Details</button>
                            </div>
                        ))}
                    </div>
                ) : <p>You have no upcoming reservations.</p>}
            </div>
        </div>
    );
};

export default DashboardOverview;