import React, { useState } from "react";
import "../style/Login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please check your network.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Sign In</h2>
        <p className="login-subtitle">We Are Happy To See You Again</p>

        <div className="toggle-btns">
          <button className="btn active">Sign In</button>
          <button className="btn">Sign Up</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group input-with-icon">
            <i className="fas fa-envelope"></i>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group input-with-icon">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i className="fas fa-eye toggle-password"></i>
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="#" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
