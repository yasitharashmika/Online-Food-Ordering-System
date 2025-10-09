import React, { useState } from "react";
import '../style/BookTable.css';

const BookTable = () => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: "1 Person",
    name: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`✅ Table booked successfully for ${formData.name}!`);
  };

  return (
    <div className="book-table-page">
      <h2>Book a Table</h2>
      <p className="subtitle">
        Reserve your table for a delightful dining experience
      </p>

      <div className="book-container">
        {/* Left Side - Reservation Form */}
        <div className="reservation-box">
          <h3>Table Reservation</h3>
          <form onSubmit={handleSubmit}>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <label>Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />

            <label>Number of Guests</label>
            <select
              name="guests"
              value={formData.guests}
              onChange={handleChange}
            >
              <option>1 Person</option>
              <option>2 People</option>
              <option>3 People</option>
              <option>4 People</option>
              <option>5+ People</option>
            </select>

            <label>Your Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn-submit">
              Reserve Table
            </button>
          </form>
        </div>

        {/* Right Side - Table Availability */}
        <div className="availability-box">
          <h3>Table Availability</h3>
          <div className="availability-info">
            <p>8 tables available at <strong>7:00 PM today</strong></p>
          </div>

          <div className="tables-grid">
            <div className="table-card available">Table 1<br />2 Seats</div>
            <div className="table-card available">Table 2<br />2 Seats</div>
            <div className="table-card available">Table 3<br />4 Seats</div>
            <div className="table-card booked">Table 4<br />4 Seats</div>
          </div>

          <div className="legend">
            <span className="dot available-dot"></span> Available
            <span className="dot booked-dot"></span> Booked
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTable;