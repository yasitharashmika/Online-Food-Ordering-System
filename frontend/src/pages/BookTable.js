import React, { useState, useMemo, useEffect, useCallback } from "react";
import axios from "axios"; // Make sure to install axios: npm install axios
import "../style/BookTable.css";

// Helper function to get today's date in YYYY-MM-DD format
const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const BookTablePage = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        date: getTodayString(),
        fromTime: "19:00",
        toTime: "21:00",
        guests: "1",
        name: "",
        phone: "",
    });

    const [selectedTable, setSelectedTable] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const guestCount = useMemo(() => parseInt(formData.guests, 10), [formData.guests]);

    // --- NEW: Auto-fill user's name if they are logged in ---
    useEffect(() => {
        const loggedInUserName = localStorage.getItem("userName");
        if (loggedInUserName) {
            setFormData(prevData => ({ ...prevData, name: loggedInUserName }));
        }
    }, []);

    const fetchTableAvailability = useCallback(async () => {
        if (!formData.date || !formData.fromTime || !formData.toTime) {
            setError("Please select a valid date and time range.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const params = {
                date: formData.date,
                fromTime: formData.fromTime,
                toTime: formData.toTime,
            };
            const response = await axios.get("http://localhost:8080/api/v1/booking/availability", { params });
            setTables(response.data);
        } catch (err) {
            console.error("Error fetching table availability:", err);
            setError("Could not fetch table availability. Please try again later.");
            setTables([]);
        } finally {
            setLoading(false);
        }
    }, [formData.date, formData.fromTime, formData.toTime]);

    useEffect(() => {
        fetchTableAvailability();
    }, [fetchTableAvailability]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "guests") {
            setSelectedTable(null);
        }
    };

    const handleTableSelect = (table) => {
        if (table.status === "booked" || guestCount > table.seats) return;
        if (selectedTable && selectedTable.id === table.id) {
            setSelectedTable(null);
        } else {
            setSelectedTable(table);
        }
    };

    // --- UPDATE: Handle form submission to include user's email ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTable) {
            setModalMessage("⚠️ Please select an available table from the layout.");
            setShowModal(true);
            return;
        }

        // --- Step 1: Get user email from localStorage ---
        // Assumes you store the email after a successful login like this:
        // localStorage.setItem("userEmail", response.data.data.email);
        const userEmail = localStorage.getItem("userEmail");

        // --- Step 2: Validate that the user is logged in ---
        if (!userEmail) {
            setModalMessage("⚠️ You must be logged in to book a table. Please log in first.");
            setShowModal(true);
            return; // Stop the submission
        }

        // --- Step 3: Add the email to the request payload ---
        const reservationData = {
            tableId: selectedTable.id,
            date: formData.date,
            fromTime: formData.fromTime,
            toTime: formData.toTime,
            guests: guestCount,
            name: formData.name,
            phone: formData.phone,
            userEmail: userEmail, // Add the user's email here
        };

        try {
            const response = await axios.post("http://localhost:8080/api/v1/booking/reservations", reservationData);
            setModalMessage(`✅ ${response.data.message}`);
            setShowModal(true);

            // Reset form and selection
            setSelectedTable(null);
            setFormData({
                date: getTodayString(),
                fromTime: "19:00",
                toTime: "21:00",
                guests: "1",
                name: localStorage.getItem("userName") || "", // Keep name if user is logged in
                phone: "",
            });
            
            // Refresh table availability to show the new booking
            fetchTableAvailability();

        } catch (err) {
            const errorMessage = err.response?.data?.message || "An unexpected error occurred.";
            setModalMessage(`❌ Error: ${errorMessage}`);
            setShowModal(true);
            // Refresh tables in case someone else booked it in the meantime
            fetchTableAvailability();
        }
    };

    const mainDiningTables = tables.filter((t) => t.area === "main");
    const sideDiningTables = tables.filter((t) => t.area === "side");

    return (
        <>
            {showModal && (
                <div className="btp-modal-overlay">
                    <div className="btp-modal-content">
                        <p>{modalMessage}</p>
                        <button onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}

            <div className="btp-page">
                <h2>Book a Table</h2>
                <p className="btp-subtitle">
                    Reserve your table for a delightful dining experience
                </p>

                <div className="btp-container">
                    <div className="btp-reservation-box">
                        <h3 className="btp-box-title">Reservation Details</h3>
                        <form onSubmit={handleSubmit} className="btp-form">
                            <label htmlFor="date">Date</label>
                            <input id="date" type="date" name="date" value={formData.date} onChange={handleChange} required min={getTodayString()} />
                            <div className="btp-time-inputs">
                                <div>
                                    <label htmlFor="fromTime">From</label>
                                    <input id="fromTime" type="time" name="fromTime" value={formData.fromTime} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label htmlFor="toTime">To</label>
                                    <input id="toTime" type="time" name="toTime" value={formData.toTime} onChange={handleChange} required />
                                </div>
                            </div>
                            <label htmlFor="guests">Number of Guests</label>
                            <select id="guests" name="guests" value={formData.guests} onChange={handleChange}>
                                {[...Array(8).keys()].map((n) => (
                                    <option key={n + 1} value={n + 1}>
                                        {n + 1} {n === 0 ? "Person" : "People"}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor="name">Your Name</label>
                            <input id="name" type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required />
                            <label htmlFor="phone">Phone Number</label>
                            <input id="phone" type="tel" name="phone" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} required />
                            {selectedTable && (
                                <div className="btp-selected-table-info">
                                    Selected: Table {selectedTable.id} ({selectedTable.seats} Seats)
                                </div>
                            )}
                            <button type="submit" className="btp-btn-submit" disabled={loading}>
                                {loading ? "Checking..." : "Reserve Table"}
                            </button>
                        </form>
                    </div>

                    <div className="btp-availability-box">
                        <h3 className="btp-box-title">Select Your Table</h3>
                        {loading ? <div className="btp-loading-text">Loading Table Availability...</div> :
                         error ? <div className="btp-error-text">{error}</div> :
                        <div className="btp-floor-plan">
                            <div className="btp-main-layout">
                                <div className="btp-left-side">
                                    <div className="btp-main-dining">
                                        {mainDiningTables.map((t) => {
                                            const isBooked = t.status === "booked";
                                            const isDisabled = guestCount > t.seats;
                                            const isSelected = selectedTable?.id === t.id;
                                            return (
                                                <div
                                                    key={t.id}
                                                    className={`btp-table ${t.type ? `btp-${t.type}` : ""} ${ isBooked ? "btp-booked" : isDisabled ? "btp-disabled" : "btp-available" } ${isSelected ? "btp-selected" : ""}`}
                                                    onClick={() => handleTableSelect(t)}
                                                >
                                                    Table {t.id}
                                                    <br />
                                                    {t.seats} Seats
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="btp-music-area">
                                        <div className="btp-music-icon">🎵</div>
                                        <div className="btp-music-title">Live Music Area</div>
                                        <div className="btp-music-subtitle">Evening Performances</div>
                                    </div>
                                </div>
                                <div className="btp-side-dining">
                                    {sideDiningTables.map((t) => {
                                        const isBooked = t.status === "booked";
                                        const isDisabled = guestCount > t.seats;
                                        const isSelected = selectedTable?.id === t.id;
                                        return (
                                            <div
                                                key={t.id}
                                                className={`btp-table btp-small ${ isBooked ? "btp-booked" : isDisabled ? "btp-disabled" : "btp-available"} ${isSelected ? "btp-selected" : ""}`}
                                                onClick={() => handleTableSelect(t)}
                                            >
                                                T{t.id}
                                                <br />
                                                {t.seats} Seats
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>}
                        <div className="btp-legend">
                            <div className="btp-legend-item"><span className="btp-dot btp-available-dot"></span> Available</div>
                            <div className="btp-legend-item"><span className="btp-dot btp-booked-dot"></span> Booked</div>
                            <div className="btp-legend-item"><span className="btp-dot btp-disabled-dot"></span> Too Small</div>
                            <div className="btp-legend-item"><span className="btp-dot btp-selected-dot"></span> Selected</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookTablePage;
