import React from "react";
import { Link } from "react-router-dom";
import "../../style/ReservationsList.css";

function ReservationsList({ reservations, showViewAll = true }) {
  const getStatusClass = (status) => {
    switch(status) {
      case "confirmed": return "status status-ready";
      case "seated": return "status status-preparing";
      case "completed": return "status status-completed";
      default: return "status";
    }
  };

  return (
    <div className="card">
      <h3>Today's Reservations</h3>
      {reservations.length === 0 ? (
        <p className="no-reservations">No reservations today</p>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Customer</th>
                <th>Guests</th>
                <th>Table</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(reservation => (
                <tr key={reservation.id}>
                  <td>{reservation.time}</td>
                  <td>{reservation.customer}</td>
                  <td>{reservation.guests}</td>
                  <td>{reservation.table}</td>
                  <td>
                    <span className={getStatusClass(reservation.status)}>
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showViewAll && (
            <Link to="/staff/bookings" className="btn view-all-btn">
              Manage Bookings
            </Link>
          )}
        </>
      )}
    </div>
  );
}

export default ReservationsList;