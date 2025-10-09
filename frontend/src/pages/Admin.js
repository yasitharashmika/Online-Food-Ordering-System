import React from "react";
import "./Admin.css";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Admin() {
  // 📊 Chart Data
  const salesData = [
    { day: "Mon", sales: 1200 },
    { day: "Tue", sales: 2100 },
    { day: "Wed", sales: 800 },
    { day: "Thu", sales: 1600 },
    { day: "Fri", sales: 2600 },
    { day: "Sat", sales: 3200 },
    { day: "Sun", sales: 1800 },
  ];

  const orderData = [
    { day: "Mon", orders: 15 },
    { day: "Tue", orders: 22 },
    { day: "Wed", orders: 10 },
    { day: "Thu", orders: 18 },
    { day: "Fri", orders: 25 },
    { day: "Sat", orders: 30 },
    { day: "Sun", orders: 20 },
  ];

  // 🧾 Recent Orders
  const recentOrders = [
    { id: "OD001", customer: "Dinindu Bimsara", time: "10:15 AM", status: "Delivered" },
    { id: "OD002", customer: "Anupa Randika", time: "11:45 AM", status: "Pending" },
    { id: "OD003", customer: "Randunu Rathnayake", time: "12:30 PM", status: "Preparing" },
    { id: "OD004", customer: "Yasith", time: "1:00 PM", status: "Delivered" },
  ];

  // 📅 Today's Reservations
  const todaysReservations = [
    { time: "6:00 PM", customer: "Danuka", guests: 2, table: "5" },
    { time: "7:30 PM", customer: "Dinindu", guests: 4, table: "3" },
    { time: "8:00 PM", customer: "Anupa", guests: 3, table: "1" },
  ];

  return (
    <div className="admin-container">
      {/* ---- Header ---- */}
      <header className="admin-header">
        <h1>🍽️ Admin Dashboard</h1>
        <button className="logout-btn" onClick={() => alert("Logged out!")}>
          Logout
        </button>
      </header>

      {/* ---- Summary Cards ---- */}
      <div className="summary-grid">
        <div className="card">
          <h3>💰 Daily Sales</h3>
          <p>$2,500</p>
        </div>
        <div className="card">
          <h3>🕒 Pending Orders</h3>
          <p>15</p>
        </div>
        <div className="card">
          <h3>📅 Reservations</h3>
          <p>8</p>
        </div>
        <div className="card">
          <h3>👨‍🍳 Staff Performance</h3>
          <p>Excellent</p>
        </div>
      </div>

      {/* ---- Charts ---- */}
      <div className="chart-grid">
        <div className="chart-card">
          <h3>📈 Sales Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#00C49F" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>📦 Orders Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
              <Legend />
              <Bar dataKey="orders" fill="#8884d8" barSize={40} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---- Recent Orders Table ---- */}
      <div className="table-card">
        <h3>🧾 Recent Orders</h3>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.time}</td>
                <td className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---- Today's Reservations Table ---- */}
      <div className="table-card">
        <h3>📅 Today's Reservations</h3>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Customer</th>
              <th>Guests</th>
              <th>Table</th>
            </tr>
          </thead>
          <tbody>
            {todaysReservations.map((res, index) => (
              <tr key={index}>
                <td>{res.time}</td>
                <td>{res.customer}</td>
                <td>{res.guests}</td>
                <td>{res.table}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
