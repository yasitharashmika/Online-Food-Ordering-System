import React, { useState } from "react";
import "../style/Login.css";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");
  const role = localStorage.getItem("resetRole");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const endpoint =
      role === "staff"
        ? `${API_BASE_URL}/api/v1/staff/reset-password`
        : `${API_BASE_URL}/api/v1/user/reset-password`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password changed successfully!");
        setIsError(false);
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetRole");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.message || "Failed to reset password.");
        setIsError(true);
      }
    } catch (err) {
      setMessage("Something went wrong. Try again.");
      setIsError(true);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Reset Password</h2>
        <p className="login-subtitle">Enter your new password</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group input-with-icon">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {message && (
            <p className={isError ? "error-message" : "success-message"}>
              {message}
            </p>
          )}

          <button type="submit" className="btn login-btn">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
