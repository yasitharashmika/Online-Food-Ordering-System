import React, { useState } from "react";
import "../style/CustomerDashboard.css";

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [profileData, setProfileData] = useState({
    firstName: "Anupa",
    lastName: "Smith",
    email: "anupa.smith@email.com",
    phone: "+1 (555) 123-4567",
    notifications: {
      orderUpdates: true,
      reservationReminders: true,
      specialOffers: false,
      smsAlerts: true
    }
  });

  // Sample data
  const activeOrders = [
    {
      id: "#ORD-7842",
      items: "2 items • $24.99",
      status: "Preparing",
      time: "7:15 PM",
      restaurant: "Tony's Pizzeria"
    },
    {
      id: "#ORD-7843",
      items: "3 items • $32.50",
      status: "Out for Delivery",
      time: "7:45 PM",
      restaurant: "Sushi Palace"
    }
  ];

  const upcomingReservations = [
    {
      id: "#RES-4591",
      restaurant: "Fine Dining Restaurant",
      date: "Today, 8:00 PM",
      table: "Table #5",
      guests: 4,
      status: "Confirmed"
    },
    {
      id: "#RES-4592",
      restaurant: "Seafood Grill",
      date: "Tomorrow, 7:30 PM",
      table: "Table #2",
      guests: 2,
      status: "Confirmed"
    }
  ];

  const orderHistory = [
    { 
      id: "#ORD-7841", 
      date: "2024-01-20", 
      restaurant: "Burger House",
      items: "2 items", 
      total: "$18.99", 
      status: "Delivered" 
    },
    { 
      id: "#ORD-7840", 
      date: "2024-01-18", 
      restaurant: "Italian Bistro",
      items: "3 items", 
      total: "$27.50", 
      status: "Delivered" 
    },
    { 
      id: "#ORD-7839", 
      date: "2024-01-15", 
      restaurant: "Thai Kitchen",
      items: "1 item", 
      total: "$12.99", 
      status: "Delivered" 
    }
  ];

  const stats = {
    totalOrders: 12,
    activeOrders: 2,
    upcomingReservations: 2,
    loyaltyPoints: 450
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (setting) => {
    setProfileData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: !prev.notifications[setting]
      }
    }));
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'preparing': return '#F59E0B';
      case 'out for delivery': return '#3B82F6';
      case 'confirmed': return '#10B981';
      case 'delivered': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  return (
    <div className="customer-dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Customer Dashboard</h1>
          <p className="welcome-text">Welcome back, {profileData.firstName}!</p>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            🛒 Orders
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            🗓️ Reservations
          </button>
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
        </div>

        {/* Main Content */}
        <div className="dashboard-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content">
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <h3>{stats.totalOrders}</h3>
                    <p>Total Orders</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <h3>{stats.activeOrders}</h3>
                    <p>Active Orders</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🗓️</div>
                  <div className="stat-info">
                    <h3>{stats.upcomingReservations}</h3>
                    <p>Upcoming Reservations</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-info">
                    <h3>{stats.loyaltyPoints}</h3>
                    <p>Loyalty Points</p>
                  </div>
                </div>
              </div>

              {/* Active Orders */}
              <div className="content-section">
                <h2>Active Orders</h2>
                <div className="orders-grid">
                  {activeOrders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <h4>Order {order.id}</h4>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="order-restaurant">{order.restaurant}</p>
                      <p className="order-items">{order.items}</p>
                      <p className="order-time">Estimated: {order.time}</p>
                      <button className="track-btn">Track Order</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Reservations */}
              <div className="content-section">
                <h2>Upcoming Reservations</h2>
                <div className="reservations-grid">
                  {upcomingReservations.map(reservation => (
                    <div key={reservation.id} className="reservation-card">
                      <div className="reservation-header">
                        <h4>{reservation.restaurant}</h4>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(reservation.status) }}
                        >
                          {reservation.status}
                        </span>
                      </div>
                      <p className="reservation-date">{reservation.date}</p>
                      <p className="reservation-details">
                        {reservation.table} • {reservation.guests} guests
                      </p>
                      <button className="view-btn">View Details</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="tab-content">
              <div className="content-section">
                <h2>Order History</h2>
                <div className="table-container">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Restaurant</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderHistory.map(order => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.date}</td>
                          <td>{order.restaurant}</td>
                          <td>{order.items}</td>
                          <td>{order.total}</td>
                          <td>
                            <span 
                              className="status-badge"
                              style={{ backgroundColor: getStatusColor(order.status) }}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <button className="reorder-btn">Reorder</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Reservations Tab */}
          {activeTab === 'reservations' && (
            <div className="tab-content">
              <div className="content-section">
                <h2>Reservation History</h2>
                <div className="reservations-list">
                  {upcomingReservations.map(reservation => (
                    <div key={reservation.id} className="reservation-item">
                      <div className="reservation-info">
                        <h4>{reservation.restaurant}</h4>
                        <p>{reservation.date}</p>
                        <p>{reservation.table} • {reservation.guests} guests</p>
                      </div>
                      <div className="reservation-actions">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(reservation.status) }}
                        >
                          {reservation.status}
                        </span>
                        <button className="modify-btn">Modify</button>
                        <button className="cancel-btn">Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content">
              <div className="content-section">
                <h2>Profile Management</h2>
                <form className="profile-form" onSubmit={handleProfileUpdate}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <button type="submit" className="save-btn">
                    Update Profile
                  </button>
                </form>
              </div>

              {/* Notification Settings */}
              <div className="content-section">
                <h2>Notification Settings</h2>
                <div className="notification-settings">
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={profileData.notifications.orderUpdates}
                        onChange={() => handleNotificationChange('orderUpdates')}
                      />
                      Order Updates
                    </label>
                    <p>Get notified about your order status</p>
                  </div>
                  
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={profileData.notifications.reservationReminders}
                        onChange={() => handleNotificationChange('reservationReminders')}
                      />
                      Reservation Reminders
                    </label>
                    <p>Reminders for upcoming reservations</p>
                  </div>
                  
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={profileData.notifications.specialOffers}
                        onChange={() => handleNotificationChange('specialOffers')}
                      />
                      Special Offers
                    </label>
                    <p>Receive special offers and promotions</p>
                  </div>
                  
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={profileData.notifications.smsAlerts}
                        onChange={() => handleNotificationChange('smsAlerts')}
                      />
                      SMS Alerts
                    </label>
                    <p>Important updates via SMS</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;