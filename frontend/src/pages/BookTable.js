import React, { useState } from "react";
import "../style/BookTable.css";

const TableBooking = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [selectedTable, setSelectedTable] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [customerDetails, setCustomerDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: ""
  });

  // Available time slots
  const timeSlots = [
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", 
    "1:00 PM", "1:30 PM", "5:00 PM", "5:30 PM", 
    "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", 
    "8:00 PM", "8:30 PM", "9:00 PM"
  ];

  // Sample table data
  const tables = [
    { id: 1, number: "1", capacity: 2, type: "standard", location: "Window", available: true },
    { id: 2, number: "2", capacity: 4, type: "standard", location: "Center", available: true },
    { id: 3, number: "3", capacity: 6, type: "booth", location: "Corner", available: false },
    { id: 4, number: "4", capacity: 2, type: "standard", location: "Window", available: true },
    { id: 5, number: "5", capacity: 8, type: "family", location: "Private", available: true },
  ];

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTable(null);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    setSelectedTable(null);
  };

  const handlePartySizeChange = (e) => {
    setPartySize(parseInt(e.target.value));
    setSelectedTable(null);
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (bookingStep === 1 && selectedDate && selectedTime) {
      setBookingStep(2);
    } else if (bookingStep === 2 && selectedTable) {
      setBookingStep(3);
    } else if (bookingStep === 3) {
      if (customerDetails.firstName && customerDetails.lastName && 
          customerDetails.email && customerDetails.phone) {
        setBookingStep(4);
      } else {
        alert("Please fill in all required fields");
      }
    }
  };

  const handlePreviousStep = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1);
    }
  };

  const handleConfirmBooking = () => {
    const bookingData = {
      date: selectedDate,
      time: selectedTime,
      partySize,
      table: selectedTable,
      customer: customerDetails,
      bookingId: `#BK-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    };
    
    console.log("Booking confirmed:", bookingData);
    alert(`Booking confirmed! Your booking ID is ${bookingData.bookingId}`);
  };

  const getStepTitle = () => {
    switch (bookingStep) {
      case 1: return "Table Reservation";
      case 2: return "Choose Your Table";
      case 3: return "Your Details";
      case 4: return "Confirmation";
      default: return "Book a Table";
    }
  };

  // Filter available tables based on party size and availability
  const availableTables = tables.filter(table => 
    table.capacity >= partySize && table.available
  );

  return (
    <div className="table-booking-page">
      <div className="booking-container">
        {/* Header */}
        <div className="booking-header">
          <h1>Table Reservation</h1>
        </div>

        {/* Progress Steps */}
        <div className="booking-progress">
          {[1, 2, 3, 4].map(step => (
            <div key={step} className={`progress-step ${bookingStep >= step ? 'active' : ''}`}>
              <div className="step-number">{step}</div>
              <span className="step-label">
                {step === 1 && 'Details'}
                {step === 2 && 'Table'}
                {step === 3 && 'Info'}
                {step === 4 && 'Confirm'}
              </span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="booking-content">
          <div className="booking-left">
            <h2>{getStepTitle()}</h2>

            {/* Step 1: Date & Time Selection */}
            {bookingStep === 1 && (
              <div className="booking-step">
                {/* Date Section */}
                <div className="form-section">
                  <h3>Date</h3>
                  <div className="input-group">
                    <div className="checkbox-group">
                      <input 
                        type="date" 
                        className="date-input"
                        value={selectedDate}
                        onChange={handleDateChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Time Section */}
                <div className="form-section">
                  <h3>Time</h3>
                  <div className="input-group">
                    <select 
                      className="time-select"
                      value={selectedTime}
                      onChange={handleTimeChange}
                    >
                      <option value="">--:--</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Party Size Section */}
                <div className="form-section">
                  <h3>Number of Guests</h3>
                  <div className="input-group">
                    <select 
                      className="party-size-select"
                      value={partySize}
                      onChange={handlePartySizeChange}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                        <option key={size} value={size}>
                          {size} {size === 1 ? 'Person' : 'People'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Table Selection */}
            {bookingStep === 2 && (
              <div className="booking-step">
                <div className="table-selection-header">
                  <h3>Available Tables for {partySize} {partySize === 1 ? 'Person' : 'People'}</h3>
                  <p>Select your preferred table</p>
                </div>

                <div className="tables-grid">
                  {availableTables.map(table => (
                    <div
                      key={table.id}
                      className={`table-card ${selectedTable?.id === table.id ? 'selected' : ''}`}
                      onClick={() => handleTableSelect(table)}
                    >
                      <div className="table-header">
                        <span className="table-number">Table {table.number}</span>
                        <span className="table-capacity">👥 {table.capacity}</span>
                      </div>
                      <div className="table-details">
                        <span className={`table-type ${table.type}`}>
                          {table.type.charAt(0).toUpperCase() + table.type.slice(1)}
                        </span>
                        <span className="table-location">📍 {table.location}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {availableTables.length === 0 && (
                  <div className="no-tables">
                    <div className="no-tables-icon">😔</div>
                    <h4>No tables available</h4>
                    <p>No tables are available for {partySize} people at {selectedTime}.</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Customer Details */}
            {bookingStep === 3 && (
              <div className="booking-step">
                <div className="details-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={customerDetails.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={customerDetails.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={customerDetails.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={customerDetails.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Special Requests (Optional)</label>
                    <textarea
                      name="specialRequests"
                      value={customerDetails.specialRequests}
                      onChange={handleInputChange}
                      placeholder="Any special occasion or dietary requirements..."
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {bookingStep === 4 && (
              <div className="booking-step">
                <div className="confirmation">
                  <div className="confirmation-icon">✅</div>
                  <h3>Booking Confirmed!</h3>
                  
                  <div className="booking-summary">
                    <div className="summary-section">
                      <h4>Reservation Details</h4>
                      <div className="summary-row">
                        <span>Date:</span>
                        <strong>{selectedDate}</strong>
                      </div>
                      <div className="summary-row">
                        <span>Time:</span>
                        <strong>{selectedTime}</strong>
                      </div>
                      <div className="summary-row">
                        <span>Guests:</span>
                        <strong>{partySize} {partySize === 1 ? 'Person' : 'People'}</strong>
                      </div>
                      <div className="summary-row">
                        <span>Table:</span>
                        <strong>Table {selectedTable?.number}</strong>
                      </div>
                    </div>

                    <div className="summary-section">
                      <h4>Your Information</h4>
                      <div className="summary-row">
                        <span>Name:</span>
                        <strong>{customerDetails.firstName} {customerDetails.lastName}</strong>
                      </div>
                      <div className="summary-row">
                        <span>Email:</span>
                        <strong>{customerDetails.email}</strong>
                      </div>
                      <div className="summary-row">
                        <span>Phone:</span>
                        <strong>{customerDetails.phone}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="booking-navigation">
              {bookingStep > 1 && (
                <button 
                  className="prev-btn"
                  onClick={handlePreviousStep}
                >
                  ← Back
                </button>
              )}
              
              {bookingStep < 4 ? (
                <button 
                  className="next-btn"
                  onClick={handleNextStep}
                  disabled={
                    (bookingStep === 1 && (!selectedDate || !selectedTime)) ||
                    (bookingStep === 2 && !selectedTable) ||
                    (bookingStep === 3 && (!customerDetails.firstName || !customerDetails.lastName || !customerDetails.email || !customerDetails.phone))
                  }
                >
                  Continue →
                </button>
              ) : (
                <button 
                  className="confirm-btn"
                  onClick={() => alert("Thank you for your reservation!")}
                >
                  Complete Reservation
                </button>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="booking-right">
            <div className="summary-card">
              <h3>Reservation Summary</h3>
              
              {selectedDate && (
                <div className="summary-item">
                  <span>📅 Date</span>
                  <strong>{selectedDate}</strong>
                </div>
              )}

              {selectedTime && (
                <div className="summary-item">
                  <span>⏰ Time</span>
                  <strong>{selectedTime}</strong>
                </div>
              )}

              <div className="summary-item">
                <span>👥 Guests</span>
                <strong>{partySize} {partySize === 1 ? 'Person' : 'People'}</strong>
              </div>

              {selectedTable && (
                <div className="summary-item">
                  <span>🪑 Table</span>
                  <strong>Table {selectedTable.number}</strong>
                </div>
              )}

              <div className="restaurant-info">
                <h4>🍽️ Restaurant Info</h4>
                <p><strong>CraveCorner</strong></p>
                <p>123 Food Street, Colombo</p>
                <p>📞 +94 77 123 4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableBooking;