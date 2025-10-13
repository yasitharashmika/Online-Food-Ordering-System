import React, { useState, useEffect } from 'react';
// --- UPDATE: Import NavLink and Outlet for nested routing ---
import { NavLink, Outlet } from 'react-router-dom';
import "../style/CustomerDashboard.css";

const CustomerDashboard = () => {
    // --- UPDATE: The layout now only needs the user's name for the welcome message ---
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // We still load the user's name for the welcome message
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user && user.name) {
                setUserName(user.name);
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <div className="dashboard-loading">Loading your dashboard...</div>;
    }

    return (
        <div className="customer-dashboard-page">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Customer Dashboard</h1>
                    <p className="welcome-text">Welcome back, {userName || 'Customer'}!</p>
                </div>

                {/* --- UPDATE: These are now NavLinks instead of buttons --- */}
                {/* NavLink automatically adds an 'active' class to the selected link, which you can style in your CSS. */}
                <div className="dashboard-tabs">
                    {/* The 'end' prop on the first NavLink ensures it's only active for the exact path "/user/dashboard" */}
                    <NavLink to="/user/dashboard" end className="tab-btn">📊 Overview</NavLink>
                    <NavLink to="/user/dashboard/orders" className="tab-btn">🛒 Orders</NavLink>
                    <NavLink to="/user/dashboard/reservations" className="tab-btn">🗓️ Reservations</NavLink>
                    <NavLink to="/user/dashboard/profile" className="tab-btn">👤 Profile</NavLink>
                </div>

                <div className="dashboard-content">
                    {/* --- UPDATE: The active child page (Overview, Orders, etc.) will be rendered here automatically by the router --- */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;