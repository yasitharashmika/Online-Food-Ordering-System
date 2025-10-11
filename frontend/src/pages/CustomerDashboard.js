



import React from "react";
import "../style/CustomerDashboard.css";

const CustomerDashboard = () => {
  const activeOrders = [
    {
      id: "#12345",
      items: "2 items • $24.99",
      status: "Preparing",
      time: "7:15 PM",
    },
    {
      id: "#12346",
      items: "3 items • $32.50",
      status: "Order Received",
      time: "7:45 PM",
    },
  ];

  const upcomingReservations = [
    {
      table: "#5",
      date: "Today, 8:00 PM",
      details: "4 people • Window seating requested",
      status: "Confirmed",
    },
    {
      table: "#2",
      date: "Tomorrow, 7:30 PM",
      details: "2 people • Anniversary celebration",
      status: "Confirmed",
    },
  ];

  const orderHistory = [
    { id: "#12344", date: "2023-10-20", items: "2 items", total: "$18.99", status: "Delivered" },
    { id: "#12343", date: "2023-10-18", items: "3 items", total: "$27.50", status: "Delivered" },
    { id: "#12342", date: "2023-10-15", items: "1 item", total: "$12.99", status: "Delivered" },
  ];

  return (
    <div className="customer-dashboard">
      <h2>Customer Dashboard</h2>
      <p className="customer-welcome-text">Welcome back, Anupa!</p>

      {/* Summary Cards */}
      <div className="customer-summary-cards">
        <div className="customer-card">
          <h3>3</h3>
          <p>Active Orders</p>
        </div>
        <div className="customer-card">
          <h3>12</h3>
          <p>Total Orders</p>
        </div>
        <div className="customer-card">
          <h3>2</h3>
          <p>Upcoming Reservations</p>
        </div>
      </div>

      {/* Active Orders & Reservations */}
      <div className="customer-sections">
        <div className="customer-section-box">
          <h3>Active Orders</h3>
          {activeOrders.map((order) => (
            <div className="customer-order-card" key={order.id}>
              <div>
                <h4>Order {order.id}</h4>
                <p>{order.items}</p>
                <p>Estimated delivery: {order.time}</p>
              </div>
              <span className={`customer-status ${order.status.toLowerCase().replace(" ", "-")}`}>
                {order.status}
              </span>
              <button className="customer-track-btn">Track Order</button>
            </div>
          ))}
        </div>

        <div className="customer-section-box">
          <h3>Upcoming Reservations</h3>
          {upcomingReservations.map((res) => (
            <div className="customer-reservation-card" key={res.table}>
              <div>
                <h4>Table {res.table}</h4>
                <p>{res.date}</p>
                <p>{res.details}</p>
              </div>
              <span className={`customer-status ${res.status.toLowerCase()}`}>{res.status}</span>
              <button className="customer-view-btn">View Details</button>
            </div>
          ))}
        </div>
      </div>

      {/* Order History */}
      <div className="customer-order-history">
        <h3>Order History</h3>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.date}</td>
                <td>{order.items}</td>
                <td>{order.total}</td>
                <td>
                  <span className="customer-status delivered">{order.status}</span>
                </td>
                <td>
                  <button className="customer-reorder-btn">Reorder</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerDashboard;