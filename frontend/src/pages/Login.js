import React, { useState } from "react";
import "../style/Login.css";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const userEndpoint = `${API_BASE_URL}/api/v1/user/login`;
    const staffEndpoint = `${API_BASE_URL}/api/v1/staff/login`;

    try {
      // Send both requests in parallel
      const [userResponse, staffResponse] = await Promise.allSettled([
        fetch(userEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }),
        fetch(staffEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }),
      ]);

      // Parse JSON if responses are ok
      let userData = null;
      let staffData = null;

      if (userResponse.status === "fulfilled" && userResponse.value.ok) {
        userData = await userResponse.value.json();
      }

      if (staffResponse.status === "fulfilled" && staffResponse.value.ok) {
        staffData = await staffResponse.value.json();
      }

      // Check outcomes
      if (userData && staffData) {
        // Both succeeded - unlikely, but handle (e.g., conflict)
        setMessage("Account conflict: Credentials match both user and staff. Contact support.");
        setIsError(true);
        return;
      } else if (userData) {
        // User login success
        setMessage(userData.message || "Login successful!");
        setIsError(false);
        localStorage.setItem("user", JSON.stringify(userData.data));
        // Assume no role or "user" role -> redirect to home
        setTimeout(() => navigate("/"), 1500);
      } else if (staffData) {
        // Staff login success
        setMessage(staffData.message || "Login successful!");
        setIsError(false);
        localStorage.setItem("user", JSON.stringify(staffData.data));
        // Role-based navigation
        const role = staffData.data?.role?.toLowerCase();
        if (role === "admin") {
          setTimeout(() => navigate("/admin/dashboard"), 1500);
        } else if (role === "staff") {
          setTimeout(() => navigate("/staff/dashboard"), 1500);
        } else {
          // Fallback if role invalid
          setTimeout(() => navigate("/"), 1500);
        }
      } else {
        // Both failed
        // Get error messages if available
        let errorMsg = "Login failed. Invalid email or password.";
        if (userResponse.status === "fulfilled" && !userResponse.value.ok) {
          const userErr = await userResponse.value.json();
          errorMsg = userErr.message || errorMsg;
        } else if (staffResponse.status === "fulfilled" && !staffResponse.value.ok) {
          const staffErr = await staffResponse.value.json();
          errorMsg = staffErr.message || errorMsg;
        }
        setMessage(errorMsg);
        setIsError(true);
      }
    } catch (err) {
      setMessage("An error occurred. Please check your network.");
      setIsError(true);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Sign In</h2>
        <p className="login-subtitle">We Are Happy To See You Again</p>

        <div className="toggle-btns">
          <button className="btn active">Sign In</button>
          <button className="btn" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group input-with-icon">
            <i className="fas fa-envelope"></i>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group input-with-icon">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i className="fas fa-eye toggle-password"></i>
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          {message && (
            <p className={isError ? "error-message" : "success-message"}>
              {message}
            </p>
          )}

          <button type="submit" className="btn login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;