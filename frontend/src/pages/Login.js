import React, { useState } from 'react';
import '../style/Login.css';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store token or user data (e.g., in localStorage or context)
        localStorage.setItem('token', data.token); // Adjust based on your backend response
        navigate('/'); // Redirect to home page on success
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please check your network.');
    }
  };

  return (
    <div className="page-content">
      <div className="container">
        <div className="section-title">
          <h2>Login to Your Account</h2>
          <p>Access your orders, bookings and preferences</p>
        </div>

        <div className="login-grid">
          <div className="card">
            <h3>Login</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="login-email">Email or Mobile</label>
                <input
                  type="text"
                  id="login-email"
                  placeholder="Enter your email or mobile number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input
                  type="password"
                  id="login-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="remember-forgot">
                <div>
                  <input type="checkbox" id="remember-me" />
                  <label htmlFor="remember-me">Remember me</label>
                </div>
                <Link to="#" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="login-btn">
                Login
              </button>
            </form>
            <div className="signup-link">
              <p>
                Don't have an account? <Link to="/Register" className="signup-text">Sign up now</Link>
              </p>
            </div>
            <div className="security-note">
              <p>
                <i className="fas fa-shield-alt"></i> Your data is safe with us
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;