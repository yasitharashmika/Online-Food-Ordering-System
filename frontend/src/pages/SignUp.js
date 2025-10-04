import React, { useState } from "react";
import "../style/Login.css"; // reuse same styles
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // store success/error message
  const [isError, setIsError] = useState(false); // flag for error/success
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // Call Spring Boot API
      const response = await fetch(`${API_BASE_URL}/api/v1/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json(); // ResponseDTO

      if (response.ok) {
        setMessage(data.message || "Account created successfully!");
        setIsError(false);

        // optional: redirect after 2 seconds
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.message || "Signup failed. Try again.");
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
        <h2 className="login-title">Sign Up</h2>
        <p className="login-subtitle">Create your account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group input-with-icon">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div className="form-group input-with-icon">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Show success or error message here */}
          {message && (
            <p className={isError ? "error-message" : "success-message"}>
              {message}
            </p>
          )}

          <button type="submit" className="btn login-btn">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
