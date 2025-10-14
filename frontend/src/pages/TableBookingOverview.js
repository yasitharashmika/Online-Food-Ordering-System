import React, { useState, useEffect } from "react";
import StaffLayout from "../components/staff/StaffLayout";
import "../style/TableBookingOverview.css";

function TableBookingOverview() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const mockReservations = [
    { 
      id: 1, 
      reservationId: "#RES001", 
      customer: "Kumar", 
      phone: "+94 77 123 4567",
      date: new Date().toISOString().split('T')[0], 
      time: "19:00", 
      guests: 4, 
      table: "Table 5", 
      status: "confirmed",
      specialRequests: "Window seating preferred"
    }
  ];

  const mockTables = [
    { id: 1, number: "Table 1", seats: 2, status: "available" },
    { id: 2, number: "Table 2", seats: 2, status: "reserved" },
    { id: 3, number: "Table 3", seats: 4, status: "available" },
    { id: 4, number: "Table 4", seats: 4, status: "occupied" },
    { id: 5, number: "Table 5", seats: 4, status: "reserved" }
  ];

  useEffect(() => {
    setReservations(mockReservations);
    setTables(mockTables);
  }, []);

  const updateTableStatus = (tableId, newStatus) => {
    setTables(tables.map(table => 
      table.id === tableId ? { ...table, status: newStatus } : table
    ));
  };

  const notifyCustomer = (reservationId) => {
    alert(`Customer notified for reservation ${reservationId}`);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case "available": return "status status-ready";
      case "reserved": return "status status-preparing";
      case "occupied": return "status status-received";
      default: return "status";
    }
  };

  const getTableColor = (status) => {
    switch(status) {
      case "available": return "var(--success)";
      case "reserved": return "var(--warning)";
      case "occupied": return "var(--danger)";
      default: return "var(--gray)";
    }
  };

  const filteredReservations = reservations.filter(
    reservation => reservation.date === selectedDate
  );

  return (
    <StaffLayout 
      title="Table Booking Overview" 
      subtitle="Manage current and upcoming table reservations"
    >
      <div className="booking-grid">
        <div className="card">
          <h3>Reservations for {selectedDate}</h3>
          <div className="date-selector">
            <label htmlFor="date-select">Select Date:</label>
            <input type="date" id="date-select" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </div>

          <div className="reservations-list">
            {filteredReservations.map(reservation => (
              <div key={reservation.id} className="reservation-card">
                <div className="reservation-content">
                  <div className="reservation-info">
                    <h4>{reservation.reservationId}</h4>
                    <p><strong>Customer:</strong> {reservation.customer}</p>
                    <p><strong>Phone:</strong> {reservation.phone}</p>
                    <p><strong>Time:</strong> {reservation.time}</p>
                    <p><strong>Guests:</strong> {reservation.guests}</p>
                    <p><strong>Table:</strong> {reservation.table}</p>
                    {reservation.specialRequests && (
                      <p><strong>Special Requests:</strong> {reservation.specialRequests}</p>
                    )}
                  </div>
                  <div className="reservation-controls">
                    <span className={getStatusClass("reserved")}>Confirmed</span>
                    <button className="btn btn-success" onClick={() => notifyCustomer(reservation.id)}>Notify Customer</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Table Status</h3>
          <p className="table-subtitle">Current table availability and status</p>

          <div className="tables-grid">
            {tables.map(table => (
              <div key={table.id} className="table-item" style={{ backgroundColor: getTableColor(table.status) }} onClick={() => {
                const newStatus = table.status === "available" ? "occupied" : "available";
                updateTableStatus(table.id, newStatus);
              }}>
                <p className="table-number">{table.number}</p>
                <p className="table-seats">{table.seats} Seats</p>
                <p className="table-status">{table.status}</p>
              </div>
            ))}
          </div>

          <div className="table-legend">
            <div className="legend-item">
              <div className="legend-color available"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="legend-color reserved"></div>
              <span>Reserved</span>
            </div>
            <div className="legend-item">
              <div className="legend-color occupied"></div>
              <span>Occupied</span>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}

export default TableBookingOverview;