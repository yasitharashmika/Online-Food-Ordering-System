import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../style/ReservationsList.css";

function ReservationsList({ showViewAll = true }) {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to format time from "HH:mm:ss" to "hh:mm AM/PM"
    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hours, minutes, 0);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    useEffect(() => {
        const fetchTodaysReservations = async () => {
            try {
                setLoading(true);
                setError(null);
                // --- UPDATE: Pointing to your new endpoint ---
                const response = await axios.get("http://localhost:8080/api/v1/booking/today");
                setReservations(response.data);
            } catch (err) {
                setError("Could not load today's reservations.");
                console.error("Error fetching reservations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTodaysReservations();
    }, []);

    const getStatusClass = (status) => {
        // --- UPDATE: Changed status values to match your backend logic ---
        switch (status?.toLowerCase()) {
            case "confirmed": return "status status-ready";
            case "seated": return "status status-preparing";
            case "completed": return "status status-completed";
            default: return "status";
        }
    };

    if (loading) {
        return (
            <div className="card">
                <h3>Today's Reservations</h3>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card">
                <h3>Today's Reservations</h3>
                <p className="no-reservations error">{error}</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h3>Today's Reservations</h3>
            {reservations.length === 0 ? (
                <p className="no-reservations">No reservations for today</p>
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
                            {/* --- UPDATE: Using fields from your ReservationDetailsDTO --- */}
                            {reservations.map(reservation => (
                                <tr key={reservation.id}>
                                    <td>{formatTime(reservation.startTime)}</td>
                                    <td>{reservation.customerName}</td>
                                    <td>{reservation.numberOfGuests}</td>
                                    <td>{reservation.tableName}</td>
                                    <td>
                                        <span className={getStatusClass(reservation.status)}>
                                            {reservation.status}
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