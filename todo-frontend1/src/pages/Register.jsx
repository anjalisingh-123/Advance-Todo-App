import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername || !trimmedEmail || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    // Password complexity check: 8+ chars, uppercase, lowercase, number, special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const result = await register(trimmedUsername, trimmedEmail, password);
    setIsSubmitting(false);

    if (result.success) {
      setSuccess("Registration successful! Redirecting to login page...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Get started with your free account</p>
        </div>

        {error && (
          <div className="auth-alert auth-alert-error" style={{ marginBottom: "1.25rem" }}>
            {error}
          </div>
        )}

        {success && (
          <div className="auth-alert auth-alert-success" style={{ marginBottom: "1.25rem" }}>
            {success}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-group">
            <label className="auth-label" htmlFor="username">Full Name</label>
            <input
              className="auth-input"
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="John Doe"
              disabled={isSubmitting || !!success}
              required
            />
          </div>

          <div className="auth-group">
            <label className="auth-label" htmlFor="email">Email Address</label>
            <input
              className="auth-input"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              disabled={isSubmitting || !!success}
              required
            />
          </div>

          <div className="auth-group">
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              className="auth-input"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              disabled={isSubmitting || !!success}
              required
            />
          </div>

          <div className="auth-group">
            <label className="auth-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              className="auth-input"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              disabled={isSubmitting || !!success}
              required
            />
          </div>

          <button className="auth-button" type="submit" disabled={isSubmitting || !!success}>
            {isSubmitting ? (
              <>
                <div className="auth-spinner"></div>
                Registering...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? 
          <Link className="auth-link" to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
