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

    const userEndpoint = `${API_BASE_URL}/api/v1/user/forgot-password`;
    const staffEndpoint = `${API_BASE_URL}/api/v1/staff/forgot-password`;

    try {
      // Send both requests in parallel
      const [userResp, staffResp] = await Promise.allSettled([
        fetch(userEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }),
        fetch(staffEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }),
      ]);

      let successResponse = null;
      let role = "user";

      if (userResp.status === "fulfilled" && userResp.value.ok) {
        successResponse = await userResp.value.json();
        role = "user";
      } else if (staffResp.status === "fulfilled" && staffResp.value.ok) {
        successResponse = await staffResp.value.json();
        role = "staff"; // includes admin if staff endpoint handles admin
      }

      if (successResponse) {
        setMessage("OTP sent to your email!");
        setIsError(false);
        localStorage.setItem("resetEmail", email);
        localStorage.setItem("resetRole", role);
        setTimeout(() => navigate("/verify-otp"), 1500);
      } else {
        // Choose the error message from whichever failed
        let errorMsg = "Email not found.";
        if (userResp.status === "fulfilled" && !userResp.value.ok) {
          const data = await userResp.value.json();
          errorMsg = data.message || errorMsg;
        } else if (staffResp.status === "fulfilled" && !staffResp.value.ok) {
          const data = await staffResp.value.json();
          errorMsg = data.message || errorMsg;
        }
        setMessage(errorMsg);
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
