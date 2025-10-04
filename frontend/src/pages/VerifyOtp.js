import React, { useState } from "react";
import "../style/Login.css";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("OTP sent to your email.");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("OTP verified successfully!");
        setIsError(false);
        setTimeout(() => navigate("/reset-password"), 1500);
      } else {
        setMessage(data.message || "Invalid or expired OTP.");
        setIsError(true);
      }
    } catch (err) {
      setMessage("Verification failed. Try again.");
      setIsError(true);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Verify OTP</h2>
        <p className="login-subtitle">Enter the code sent to your email</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group input-with-icon">
            <i className="fas fa-key"></i>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          {message && (
            <p className={isError ? "error-message" : "success-message"}>
              {message}
            </p>
          )}

          <button type="submit" className="btn login-btn">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;
