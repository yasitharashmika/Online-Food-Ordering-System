import React, { useState } from "react";
import '../style/Notification.css';

const Notification = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Order #12345 is out for delivery",
      message: "Your order will arrive in approximately 15 minutes",
      time: "10 minutes ago",
      type: "success",
      read: false,
    },
    {
      id: 2,
      title: "Table booking confirmed",
      message: "Your table for 4 at 8:00 PM today has been confirmed",
      time: "1 hour ago",
      type: "info",
      read: false,
    },
    {
      id: 3,
      title: "Use code TREAT20 for 20% off your next order",
      message: "",
      time: "3 hours ago",
      type: "warning",
      read: false,
    },
  ]);

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
  };

  return (
    <div className="notification-page">
      <h2>Notifications</h2>
      <p className="subtitle">Your recent alerts and updates</p>

      <div className="notification-box">
        <div className="notification-header">
          <h3>All Notifications</h3>
          <button className="mark-all-btn" onClick={markAllRead}>
            Mark All as Read
          </button>
        </div>

        {notifications.map((note) => (
          <div key={note.id} className={`notification-card ${note.type}`}>
            <div className="notification-content">
              <h4>{note.title}</h4>
              <p>{note.message}</p>
              <span className="time">{note.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="settings-box">
        <h3>Notification Settings</h3>
        <div className="setting-item">
          <span>
            <strong>Order Updates</strong>
            <p>Get notified about your order status</p>
          </span>
          <input type="checkbox" defaultChecked />
        </div>

        <div className="setting-item">
          <span>
            <strong>Booking Reminders</strong>
            <p>Get reminders about your table bookings</p>
          </span>
          <input type="checkbox" defaultChecked />
        </div>

        <div className="setting-item">
          <span>
            <strong>Promotions & Offers</strong>
            <p>Get notified about special offers</p>
          </span>
          <input type="checkbox" />
        </div>
      </div>
    </div>
  );
};

export default Notification;
