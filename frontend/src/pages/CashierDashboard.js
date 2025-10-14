import React, { useState, useEffect } from "react";
import StaffLayout from "../components/staff/StaffLayout";
import MetricCard from "../components/staff/MetricCard";
import NewOrder from "../components/staff/NewOrder";
import ReadyOrders from "../components/staff/ReadyOrders";
import API_BASE_URL from "../config";
import "../style/CashierDashboard.css";

function CashierDashboard() {
  const [cashierOrders, setCashierOrders] = useState([]);
  const [metrics, setMetrics] = useState({
    todayOrders: 0,
    todayEarnings: 0,
    readyOrders: 0,
  });
  const [message, setMessage] = useState("");

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/order/all`);
      const data = await res.json();
      const orders = data.data || data;
      setCashierOrders(orders);
      updateMetrics(orders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // auto refresh every 10s
    return () => clearInterval(interval);
  }, []);

  // Update metrics
  const updateMetrics = (orders) => {
    const todayStr = new Date().toISOString().slice(0, 10);

    const todaysOrders = orders.filter(order => {
      if (!order.orderDateTime) return false;
      const orderDate = new Date(order.orderDateTime);
      return orderDate.toISOString().slice(0, 10) === todayStr;
    });

    const readyOrders = orders.filter(order =>
      order.orderStatus.toLowerCase() === "ready"
    );

    setMetrics({
      todayOrders: todaysOrders.length,
      todayEarnings: todaysOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      readyOrders: readyOrders.length,
    });
  };

  // Mark order as completed
  const markOrderCompleted = async (orderId) => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/order/${orderId}/status?status=Completed`, {
        method: "PUT",
      });

      const updatedOrders = cashierOrders.map(order =>
        order.id === orderId ? { ...order, orderStatus: "Completed" } : order
      );
      setCashierOrders(updatedOrders);
      updateMetrics(updatedOrders);

      setMessage(`✅ Order ${orderId} marked as Completed`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Failed to mark order as completed", error);
      setMessage(`❌ Failed to update order ${orderId}`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Add new order
  const addNewOrder = (order) => {
    const updatedOrders = [...cashierOrders, order];
    setCashierOrders(updatedOrders);
    updateMetrics(updatedOrders);

    setMessage(`✅ Order ${order.orderId} placed successfully`);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <StaffLayout title="Cashier Dashboard" subtitle="Manage ready orders">
      {message && <div className="toast-message">{message}</div>}

      <div className="metrics-container">
        <MetricCard title="Today Orders" value={metrics.todayOrders} icon="📋" />
        <MetricCard title="Today Earnings" value={`$${metrics.todayEarnings.toFixed(2)}`} icon="💰" />
        <MetricCard title="Ready Orders" value={metrics.readyOrders} icon="✅" />
      </div>

      <NewOrder addOrder={addNewOrder} />

      <ReadyOrders orders={cashierOrders} markOrderCompleted={markOrderCompleted} />
    </StaffLayout>
  );
}

export default CashierDashboard;
