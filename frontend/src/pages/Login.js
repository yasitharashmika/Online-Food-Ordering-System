import React, { useState } from "react";
import "../style/Login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:8080/api/v1/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Backend sends ResponseDTO: { data, message, responseCode }
        setMessage(data.message || "Login successful!");
        setIsError(false);

        // Save logged-in user (instead of token for now)
        localStorage.setItem("user", JSON.stringify(data.data));

        // Redirect after 2 sec
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(data.message || "Login failed. Please try again.");
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
            <Link to="#" className="forgot-password">
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
