import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import '../style/Notification.css';

const NotificationItem = ({ notification, onMarkAsRead }) => (
    <li className={`notification-item ${notification.read ? 'is-read' : 'is-unread'}`}>
      <div className="notification-item__content">
        <h4 className="notification-item__title">{notification.title}</h4>
        {notification.message && <p className="notification-item__message">{notification.message}</p>}
        <span className="notification-item__timestamp">
          {new Date(notification.createdAt).toLocaleString()}
        </span>
      </div>
      {!notification.read && (
        <button
          className="notification-item__read-btn"
          onClick={() => onMarkAsRead(notification.id)}
          title="Mark as read"
        >
          <span className="dot"></span>
        </button>
      )}
    </li>
);

export default function NotificationBell({ theme = 'dark', showFilters = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get(`${API_BASE_URL}/api/v1/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) { console.error("Failed to fetch notifications:", err); }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/api/v1/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) { console.error("Failed to mark notification as read:", err); }
  };
  
  const handleMarkAllRead = async () => {
    try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_BASE_URL}/api/v1/notifications/mark-all-read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) { console.error("Failed to mark all as read:", err); }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // ⭐ FIXED: Changed dropdown_ref to dropdownRef
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const filteredNotifications = notifications.filter(n => filter === 'unread' ? !n.read : true);

  const themeClass = `notification-bell--${theme}-theme`;

  return (
    <div className={`notification-bell ${themeClass}`} ref={dropdownRef}>
      <button className="notification-bell__btn" onClick={() => setIsOpen(prev => !prev)} title="Notifications">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && <span className="notification-bell__badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-panel">
            <div className="notification-panel__header">
                <h3>Notifications</h3>
                {unreadCount > 0 && <button className="mark-all-btn" onClick={handleMarkAllRead}>Mark all as read</button>}
            </div>
            
            {showFilters && (
                <div className="notification-panel__filters">
                <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
                <button onClick={() => setFilter('unread')} className={filter === 'unread' ? 'active' : ''}>Unread</button>
                </div>
            )}

            <ul className="notification-panel__list">
                {filteredNotifications.length > 0 ? (
                filteredNotifications.map(notification => (
                    <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    />
                ))
                ) : (
                <li className="notification-panel__empty">You're all caught up!</li>
                )}
            </ul>
        </div>
      )}
    </div>
  );
}