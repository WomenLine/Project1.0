import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const resetToken = searchParams.get("token");
    if (!resetToken) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }
    setToken(resetToken);
  }, [searchParams]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, form.password);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card" style={{ maxWidth: 400, boxShadow: '0 6px 32px 0 rgba(123, 63, 63, 0.12)' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, color: '#7b3f3f' }}>WOMENLINE</h2>
          <h3 style={{ margin: '0.5rem 0 1.5rem 0', color: '#222', fontWeight: 600 }}>Password Reset Successful!</h3>
          <p style={{ color: '#7b3f3f', fontSize: 15, marginBottom: 18 }}>
            Your password has been successfully reset. You will be redirected to the login page in a few seconds.
          </p>
        </div>
        <div style={{ textAlign: 'center', fontSize: 14, marginTop: 18 }}>
          <Link to="/login" style={{ color: '#7b3f3f', fontWeight: 600 }}>Go to Login</Link>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="card" style={{ maxWidth: 400, boxShadow: '0 6px 32px 0 rgba(123, 63, 63, 0.12)' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, color: '#7b3f3f' }}>WOMENLINE</h2>
          <h3 style={{ margin: '0.5rem 0 1.5rem 0', color: '#222', fontWeight: 600 }}>Invalid Reset Link</h3>
          <p style={{ color: '#7b3f3f', fontSize: 15, marginBottom: 18 }}>
            {error || "This password reset link is invalid or has expired."}
          </p>
        </div>
        <div style={{ textAlign: 'center', fontSize: 14, marginTop: 18 }}>
          <Link to="/reset" style={{ color: '#7b3f3f', fontWeight: 600 }}>Request New Reset Link</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: 400, boxShadow: '0 6px 32px 0 rgba(123, 63, 63, 0.12)' }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, color: '#7b3f3f' }}>WOMENLINE</h2>
        <h3 style={{ margin: '0.5rem 0 1.5rem 0', color: '#222', fontWeight: 600 }}>Set New Password</h3>
        <p style={{ color: '#7b3f3f', fontSize: 15, marginBottom: 18 }}>
          Enter your new password below.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="password">New Password</label>
        <input 
          id="password" 
          type="password" 
          placeholder="Enter new password" 
          value={form.password}
          onChange={handleChange}
          required 
          disabled={loading}
          minLength={6}
        />
        <label htmlFor="confirmPassword">Confirm New Password</label>
        <input 
          id="confirmPassword" 
          type="password" 
          placeholder="Confirm new password" 
          value={form.confirmPassword}
          onChange={handleChange}
          required 
          disabled={loading}
          minLength={6}
        />
        <button 
          type="submit" 
          style={{ width: '100%', marginTop: 8 }} 
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        {error && (
          <div style={{ color: 'red', marginTop: 8, textAlign: 'center', fontSize: 14 }}>
            {error}
          </div>
        )}
      </form>
      <div style={{ textAlign: 'center', fontSize: 14, marginTop: 18 }}>
        <Link to="/login" style={{ color: '#7b3f3f', fontWeight: 600 }}>Back to Log in</Link>
      </div>
    </div>
  );
};

export default ResetPassword; 