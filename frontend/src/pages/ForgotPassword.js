import React, { useState } from "react";
import "../style/Login.css";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("OTP sent to your email!");
        setIsError(false);
        localStorage.setItem("resetEmail", email);
        setTimeout(() => navigate("/verify-otp"), 1500);
      } else {
        setMessage(data.message || "Email not found.");
        setIsError(true);
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
      setIsError(true);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Forgot Password</h2>
        <p className="login-subtitle">Enter your registered email to reset</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group input-with-icon">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {message && (
            <p className={isError ? "error-message" : "success-message"}>
              {message}
            </p>
          )}

          <button type="submit" className="btn login-btn">
            Check
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
