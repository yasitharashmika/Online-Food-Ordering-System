import React, { useState, useEffect } from "react";
import StaffLayout from "../components/staff/StaffLayout";
import StaffMetrics from "../components/staff/StaffMetrics";
import OrderQueue from "../components/staff/OrderQueue";
import ReservationsList from "../components/staff/ReservationsList";
import API_BASE_URL from "../config";
import "../style/StaffDashboard.css";

function StaffDashboard() {
  const [activeOrders, setActiveOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [metrics, setMetrics] = useState({
    ordersInQueue: 0,
    preparing: 0,
    readyForPickup: 0,
    completed: 0
  });

  const mockReservations = [
    { id: 1, time: "7:00 PM", customer: "Kumar", guests: 4, table: "Table 5", status: "confirmed" },
    { id: 2, time: "7:30 PM", customer: "Nisha", guests: 2, table: "Table 2", status: "confirmed" },
    { id: 3, time: "8:00 PM", customer: "Yasitha", guests: 4, table: "Table 5", status: "confirmed" }
  ];

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/order/all`);
      const data = await res.json();
      const orders = data.data || data;

      // Sort by most recent first
      const sortedOrders = orders.sort((a, b) => new Date(b.orderDateTime) - new Date(a.orderDateTime));

      setActiveOrders(sortedOrders);
      updateMetrics(sortedOrders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    setReservations(mockReservations);
  }, []);

  const updateMetrics = (orders) => {
    setMetrics({
      ordersInQueue: orders.filter(order => order.orderStatus === "Ready To Prepare").length,
      preparing: orders.filter(order => order.orderStatus === "preparing").length,
      readyForPickup: orders.filter(order => order.orderStatus === "ready").length,
      completed: orders.filter(order => order.orderStatus === "completed").length
    });
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      // Call backend to update status
      await fetch(`${API_BASE_URL}/api/v1/order/${orderId}/status?status=${newStatus}`, {
        method: "PUT"
      });

      // Update frontend state
      const updatedOrders = activeOrders.map(order => 
        order.id === orderId ? { ...order, orderStatus: newStatus } : order
      );
      setActiveOrders(updatedOrders);
      updateMetrics(updatedOrders);
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  return (
    <StaffLayout 
      title="Staff Dashboard" 
      subtitle="Manage all restaurant operations"
    >
      <StaffMetrics metrics={metrics} />

      <div className="staff-grid">
        <OrderQueue 
          orders={activeOrders.filter(order => order.orderStatus !== "completed")} 
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
        <ReservationsList reservations={reservations} />
      </div>
    </StaffLayout>
  );
}

export default StaffDashboard;
