import React from "react";
import "../App.css";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
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

  // 🕒 Order History (Monthly Trend)
  const orderHistoryData = [
    { month: "Jan", totalOrders: 120 },
    { month: "Feb", totalOrders: 160 },
    { month: "Mar", totalOrders: 190 },
    { month: "Apr", totalOrders: 220 },
    { month: "May", totalOrders: 260 },
    { month: "Jun", totalOrders: 310 },
    { month: "Jul", totalOrders: 280 },
    { month: "Aug", totalOrders: 340 },
    { month: "Sep", totalOrders: 400 },
    { month: "Oct", totalOrders: 370 },
    { month: "Nov", totalOrders: 420 },
    { month: "Dec", totalOrders: 460 },
  ];

  return (
    <div
      style={{
        backgroundColor: "#121212",
        color: "#f0f0f0",
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* ---- Header ---- */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ fontSize: "28px", color: "#FFD700" }}>🍽️ Admin Dashboard</h1>
        <button
          style={{
            backgroundColor: "#ff4d4d",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => alert("Logged out!")}
        >
          Logout
        </button>
      </header>

      {/* ---- Summary Cards ---- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div style={cardStyle}>
          <h3 style={cardTitle}>💰 Daily Sales</h3>
          <p style={cardValue}>$2,500</p>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitle}>🕒 Pending Orders</h3>
          <p style={cardValue}>15</p>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitle}>📅 Reservations</h3>
          <p style={cardValue}>8</p>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitle}>👨‍🍳 Staff Performance</h3>
          <p style={cardValue}>Excellent</p>
        </div>
      </div>

      {/* ---- Charts ---- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Sales Line Chart */}
        <div style={chartContainer}>
          <h3 style={chartTitle}>📈 Sales Overview</h3>
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

        {/* Orders Bar Chart */}
        <div style={chartContainer}>
          <h3 style={chartTitle}>📦 Orders Overview</h3>
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

        {/* Order History Chart */}
        <div style={chartContainer}>
          <h3 style={chartTitle}>📊 Order History</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={orderHistoryData}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
              <Legend />
              <Area
                type="monotone"
                dataKey="totalOrders"
                stroke="#00C49F"
                fillOpacity={1}
                fill="url(#colorOrders)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// 🎨 Reusable Styles
const cardStyle = {
  backgroundColor: "#1E1E1E",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 0 10px rgba(255, 255, 255, 0.05)",
  textAlign: "center",
};

const cardTitle = {
  marginBottom: "10px",
  color: "#FFD700",
  fontSize: "16px",
};

const cardValue = {
  fontSize: "22px",
  fontWeight: "bold",
  color: "#00C49F",
};

const chartContainer = {
  backgroundColor: "#1E1E1E",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 0 10px rgba(255, 255, 255, 0.05)",
};

const chartTitle = {
  marginBottom: "10px",
  color: "#FFD700",
  fontSize: "18px",
};

export default Admin;
