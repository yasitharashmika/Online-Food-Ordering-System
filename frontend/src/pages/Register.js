import React, { useState } from 'react';
import '../style/Register.css'; // Relative path to CSS
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, mobile, password }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Registration successful! Please log in.'); // Notify user
        navigate('/login'); // Redirect to login page
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please check your network.');
    }
  };

  return (
    <div className="page-content">
      <div className="container">
        <div className="register-card">
          <h3>Register</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="register-name">Full Name</label>
              <input
                type="text"
                id="register-name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-email">Email Address</label>
              <input
                type="email"
                id="register-email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-mobile">Mobile Number</label>
              <input
                type="tel"
                id="register-mobile"
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-password">Password</label>
              <input
                type="password"
                id="register-password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-confirm">Confirm Password</label>
              <input
                type="password"
                id="register-confirm"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="btn btn-secondary">
              Create Account
            </button>
          </form>
          <div className="login-link">
            <p>
              Already have an account? <Link to="/login" className="login-text">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;