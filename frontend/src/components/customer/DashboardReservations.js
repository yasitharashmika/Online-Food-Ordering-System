import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config'; // Assuming you have a config file for your base URL

// --- Helper function to format date and time nicely ---
const formatDateTime = (date, time) => {
    if (!date || !time) return "N/A";
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    
    // The time from backend might include seconds, so we split it
    const timePart = time.split(':');
    const eventDate = new Date(`${date}T${timePart[0]}:${timePart[1]}`);
    
    const formattedDate = eventDate.toLocaleDateString('en-US', dateOptions);
    const formattedTime = eventDate.toLocaleTimeString('en-US', timeOptions);
    
    return `${formattedDate} at ${formattedTime}`;
};

const DashboardReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return '#10B981';
            case 'completed': return '#6B7280';
            case 'cancelled': return '#EF4444';
            default: return '#6B7280';
        }
    };
    
    useEffect(() => {
        const fetchReservations = async () => {
            const userEmail = localStorage.getItem("userEmail");

            if (!userEmail) {
                setError("You must be logged in to view your reservations.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/booking/user/${userEmail}`);
                
                const formattedReservations = response.data.map(res => ({
                    id: `RES-${String(res.id).padStart(3, '0')}`,
                    restaurant: "CraveCorner Restaurant",
                    date: formatDateTime(res.reservationDate, res.startTime),
                    table: `Table ${res.tableId}`,
                    guests: res.numberOfGuests,
                    status: "Confirmed", 
                }));

                setReservations(formattedReservations);
            } catch (err) {
                console.error("Failed to fetch reservations:", err);
                setError("Could not load your reservation history. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    if (loading) {
        return <div className="tab-content"><p>Loading your reservations...</p></div>;
    }

    if (error) {
        return <div className="tab-content"><p style={{ color: '#EF4444' }}>{error}</p></div>;
    }

    return (
        <div className="tab-content">
            <div className="content-section">
                <h2>Reservation History</h2>
                {reservations.length > 0 ? (
                    <div className="reservations-list">
                        {reservations.map(res => (
                            <div key={res.id} className="reservation-item">
                                <div className="reservation-info"><h4>{res.restaurant}</h4><p>{res.date}</p><p>{res.table} • {res.guests} guests</p></div>
                                <div className="reservation-actions">
                                    <span className="status-badge" style={{ backgroundColor: getStatusColor(res.status) }}>{res.status}</span>
                                    {/* --- UPDATE: The Modify and Cancel buttons have been removed --- */}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : <p>You have no reservation history.</p>}
            </div>
        </div>
    );
};

export default DashboardReservations;

