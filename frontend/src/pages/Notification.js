import React, { useState } from "react";
import "../style/Notification.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "order",
      title: "Order is out for delivery",
      message: "Your order #ORD-7842 from Tony's Pizzeria is on its way",
      time: "2 minutes ago",
      read: false,
      action: "Track Order",
      link: "/track-order",
      icon: "🚚"
    },
    {
      id: 2,
      type: "reservation",
      title: "Reservation Confirmed",
      message: "Your table at Fine Dining Restaurant for 4 people at 8:00 PM is confirmed",
      time: "1 hour ago",
      read: false,
      action: "View Details",
      link: "/reservations",
      icon: "✅"
    },
    {
      id: 3,
      type: "promotion",
      title: "Special Offer!",
      message: "Get 20% off your next order. Limited time offer valid until Friday",
      time: "3 hours ago",
      read: true,
      action: "View Offer",
      link: "/offers",
      icon: "🎁"
    },
    {
      id: 4,
      type: "order",
      title: "Order Prepared",
      message: "Your order #ORD-7841 from Sushi Palace is ready for pickup",
      time: "5 hours ago",
      read: true,
      action: "View Order",
      link: "/orders",
      icon: "👨‍🍳"
    },
    {
      id: 5,
      type: "reservation",
      title: "Reservation Reminder",
      message: "Don't forget your reservation at Seafood Grill tomorrow at 7:30 PM",
      time: "1 day ago",
      read: true,
      action: "View Reservation",
      link: "/reservations",
      icon: "⏰"
    },
    {
      id: 6,
      type: "system",
      title: "Profile Updated",
      message: "Your phone number has been successfully updated",
      time: "2 days ago",
      read: true,
      action: "View Profile",
      link: "/profile",
      icon: "👤"
    },
    {
      id: 7,
      type: "promotion",
      title: "Weekend Special",
      message: "Enjoy free delivery on all orders this weekend. Use code: WEEKEND25",
      time: "3 days ago",
      read: true,
      action: "Order Now",
      link: "/menu",
      icon: "🎉"
    },
    {
      id: 8,
      type: "order",
      title: "Order Delivered",
      message: "Your order #ORD-7840 has been successfully delivered",
      time: "1 week ago",
      read: true,
      action: "Rate Order",
      link: "/rate-order",
      icon: "📦"
    }
  ]);

  const [filter, setFilter] = useState("all"); // all, unread, order, reservation, promotion

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case "unread":
        return notifications.filter(notification => !notification.read);
      case "order":
        return notifications.filter(notification => notification.type === "order");
      case "reservation":
        return notifications.filter(notification => notification.type === "reservation");
      case "promotion":
        return notifications.filter(notification => notification.type === "promotion");
      default:
        return notifications;
    }
  };

  const getNotificationTypeLabel = (type) => {
    const labels = {
      order: "Order Update",
      reservation: "Reservation",
      promotion: "Promotion",
      system: "System"
    };
    return labels[type] || "Notification";
  };

  const getNotificationTypeColor = (type) => {
    const colors = {
      order: "#3B82F6",
      reservation: "#10B981",
      promotion: "#F59E0B",
      system: "#6B7280"
    };
    return colors[type] || "#6B7280";
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;
  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        {/* Header */}
        <div className="notifications-header">
          <div className="header-content">
            <h1>Notifications</h1>
            <p className="subtitle">Stay updated with your orders and reservations</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{unreadCount}</span>
              <span className="stat-label">Unread</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{notifications.length}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="notifications-actions">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </button>
            <button 
              className={`filter-btn ${filter === 'order' ? 'active' : ''}`}
              onClick={() => setFilter('order')}
            >
              Orders
            </button>
            <button 
              className={`filter-btn ${filter === 'reservation' ? 'active' : ''}`}
              onClick={() => setFilter('reservation')}
            >
              Reservations
            </button>
            <button 
              className={`filter-btn ${filter === 'promotion' ? 'active' : ''}`}
              onClick={() => setFilter('promotion')}
            >
              Promotions
            </button>
          </div>

          <div className="action-buttons">
            <button 
              className="action-btn mark-read-btn"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark All as Read
            </button>
            <button 
              className="action-btn clear-btn"
              onClick={clearAll}
              disabled={notifications.length === 0}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔔</div>
              <h3>No notifications</h3>
              <p>
                {filter === 'all' 
                  ? "You're all caught up! No notifications at the moment."
                  : `No ${filter} notifications found.`
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-card ${notification.read ? 'read' : 'unread'}`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="notification-icon">
                  <span className="icon">{notification.icon}</span>
                  {!notification.read && <div className="unread-dot"></div>}
                </div>

                <div className="notification-content">
                  <div className="notification-header">
                    <h4 className="notification-title">{notification.title}</h4>
                    <span 
                      className="notification-type"
                      style={{ backgroundColor: getNotificationTypeColor(notification.type) }}
                    >
                      {getNotificationTypeLabel(notification.type)}
                    </span>
                  </div>
                  
                  <p className="notification-message">{notification.message}</p>
                  
                  <div className="notification-footer">
                    <span className="notification-time">{notification.time}</span>
                    <div className="notification-actions">
                      <button 
                        className="action-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          // In a real app, this would navigate to the link
                          alert(`Navigating to: ${notification.link}`);
                        }}
                      >
                        {notification.action}
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Settings</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <label className="setting-label">
                <input type="checkbox" defaultChecked />
                <span className="checkmark"></span>
                Order Updates
              </label>
              <p>Get notified about order status changes</p>
            </div>
            <div className="setting-item">
              <label className="setting-label">
                <input type="checkbox" defaultChecked />
                <span className="checkmark"></span>
                Reservation Reminders
              </label>
              <p>Reminders for upcoming reservations</p>
            </div>
            <div className="setting-item">
              <label className="setting-label">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Promotional Offers
              </label>
              <p>Special deals and promotions</p>
            </div>
            <div className="setting-item">
              <label className="setting-label">
                <input type="checkbox" defaultChecked />
                <span className="checkmark"></span>
                System Notifications
              </label>
              <p>Important account updates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;