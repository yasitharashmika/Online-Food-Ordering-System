import React, { useState, useEffect } from 'react';

const DashboardReservations = () => {
    const [reservations, setReservations] = useState([]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return '#10B981';
            case 'completed': return '#6B7280';
            case 'cancelled': return '#EF4444';
            default: return '#6B7280';
        }
    };
    
    useEffect(() => {
        const sampleReservations = [
            { id: "RES-003", restaurant: "The Lagoon", date: "2025-10-15 at 7:30 PM", table: "Table for 2", guests: 2, status: "Confirmed" },
            { id: "RES-002", restaurant: "Ministry of Crab", date: "2025-09-20 at 8:00 PM", table: "Table for 4", guests: 4, status: "Completed" },
            { id: "RES-001", restaurant: "Nara Thai", date: "2025-08-11 at 6:00 PM", table: "Table for 2", guests: 2, status: "Cancelled" },
        ];
        setReservations(sampleReservations);
    }, []);

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
                                    {res.status === 'Confirmed' && <button className="modify-btn">Modify</button>}
                                    {res.status === 'Confirmed' && <button className="cancel-btn">Cancel</button>}
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