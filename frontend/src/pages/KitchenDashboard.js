import React, { useState, useEffect } from "react";
import StaffLayout from "../components/staff/StaffLayout";
import KitchenMetrics from "../components/staff/KitchenMetrics";
import NewOrders from "../components/staff/NewOrders";
import PreparingOrders from "../components/staff/PreparingOrders";
import API_BASE_URL from "../config";
import "../style/KitchenDashboard.css";

function KitchenDashboard() {
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [metrics, setMetrics] = useState({
    ordersInQueue: 0,
    preparing: 0,
    readyForPickup: 0,
    completed: 0
  });

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/order/all`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();

      // Map backend data to your frontend format
      const formattedOrders = data.map(order => ({
        id: order.id,
        orderId: order.orderId,
        customer: order.placedBy,
        status: order.orderStatus.toLowerCase(), // "Ready To Prepare" → "received"
        type: order.tableNumber ? "dine-in" : "takeaway",
        details: order.items.map(item => ({
          item: item,
          quantity: 1, // adjust if your backend sends quantity
          notes: "",
          station: "kitchen",
          time: "N/A"
        })),
        timestamp: order.orderDateTime
      }));

      setKitchenOrders(formattedOrders);
      updateMetrics(formattedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, []);

  const updateMetrics = (orders) => {
    setMetrics({
      ordersInQueue: orders.filter(order => order.status === "ready to prepare" || order.status === "received").length,
      preparing: orders.filter(order => order.status === "preparing").length,
      readyForPickup: orders.filter(order => order.status === "ready").length,
      completed: orders.filter(order => order.status === "completed").length
    });
  };

  const startPreparingOrder = async (orderId) => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/order/${orderId}/status?status=preparing`, { method: "PUT" });
      const updatedOrders = kitchenOrders.map(order => 
        order.id === orderId ? { ...order, status: "preparing", startedAt: new Date().toISOString() } : order
      );
      setKitchenOrders(updatedOrders);
      updateMetrics(updatedOrders);
    } catch (error) {
      console.error("Error starting order:", error);
    }
  };

  const markOrderAsReady = async (orderId) => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/order/${orderId}/status?status=ready`, { method: "PUT" });
      const updatedOrders = kitchenOrders.map(order => 
        order.id === orderId ? { ...order, status: "ready", completedAt: new Date().toISOString() } : order
      );
      setKitchenOrders(updatedOrders);
      updateMetrics(updatedOrders);
      alert(`Order ${orderId} is ready! Cashier and delivery team notified.`);
    } catch (error) {
      console.error("Error marking order ready:", error);
    }
  };

  // Sort received orders on top
  const receivedOrders = kitchenOrders
    .filter(order => order.status === "ready to prepare" || order.status === "received")
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const preparingOrders = kitchenOrders
    .filter(order => order.status === "preparing")
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <StaffLayout title="Kitchen Dashboard" subtitle="Manage food preparation and cooking timeline">
      <KitchenMetrics metrics={metrics} />

      <NewOrders orders={receivedOrders} startPreparingOrder={startPreparingOrder} />
      <PreparingOrders orders={preparingOrders} markOrderAsReady={markOrderAsReady} />
    </StaffLayout>
  );
}

export default KitchenDashboard;
