import React, { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setDebugInfo("");
    setLoading(true);

    try {
      console.log("Attempting password reset for:", email);
      setDebugInfo(`Sending request to backend...`);
      
      const response = await requestPasswordReset(email);
      console.log("Password reset response:", response);
      
      setSuccess(true);
      setEmail("");
      setDebugInfo("Password reset request successful!");
    } catch (err) {
      console.error("Password reset error:", err);
      
      let errorMessage = "Failed to send reset link. Please try again.";
      let debugMessage = "";
      
      if (err.message) {
        if (err.message.includes("404") || err.message.includes("Not Found")) {
          errorMessage = "Password reset endpoint not found on backend.";
          debugMessage = "Backend endpoint /api/auth/forgot-password is not implemented yet.";
        } else if (err.message.includes("500") || err.message.includes("Internal Server Error")) {
          errorMessage = "Backend server error occurred.";
          debugMessage = "Backend server is experiencing issues. Please try again later.";
        } else if (err.message.includes("Network") || err.message.includes("fetch")) {
          errorMessage = "Network error - cannot connect to backend.";
          debugMessage = "Check your internet connection and try again.";
        } else if (err.message.includes("CORS")) {
          errorMessage = "CORS error - backend configuration issue.";
          debugMessage = "Backend CORS configuration needs to be updated.";
        } else {
          errorMessage = err.message;
          debugMessage = `Error details: ${err.message}`;
        }
      }
      
      setError(errorMessage);
      setDebugInfo(debugMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card" style={{ maxWidth: 400, boxShadow: '0 6px 32px 0 rgba(123, 63, 63, 0.12)' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, color: '#7b3f3f' }}>WOMENLINE</h2>
          <h3 style={{ margin: '0.5rem 0 1.5rem 0', color: '#222', fontWeight: 600 }}>Check Your Email</h3>
          <p style={{ color: '#7b3f3f', fontSize: 15, marginBottom: 18 }}>
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p style={{ color: '#666', fontSize: 14, marginBottom: 18 }}>
            Please check your email and click the link to reset your password. If you don't see it, check your spam folder.
          </p>
          {debugInfo && (
            <div style={{ 
              background: '#e8f5e8', 
              padding: '12px', 
              borderRadius: '6px', 
              marginBottom: '18px',
              fontSize: '14px',
              color: '#2d5a2d'
            }}>
              <strong>Debug Info:</strong> {debugInfo}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'center', fontSize: 14, marginTop: 18 }}>
          <Link to="/login" style={{ color: '#7b3f3f', fontWeight: 600 }}>Back to Log in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: 400, boxShadow: '0 6px 32px 0 rgba(123, 63, 63, 0.12)' }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, color: '#7b3f3f' }}>WOMENLINE</h2>
        <h3 style={{ margin: '0.5rem 0 1.5rem 0', color: '#222', fontWeight: 600 }}>Reset Your Password</h3>
        <p style={{ color: '#7b3f3f', fontSize: 15, marginBottom: 18 }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="reset-email">Email Address</label>
        <input 
          id="reset-email" 
          type="email" 
          placeholder="Enter your email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
          disabled={loading}
        />
        <button 
          type="submit" 
          style={{ width: '100%', marginTop: 8 }} 
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        
        {error && (
          <div style={{ 
            color: 'red', 
            marginTop: 8, 
            textAlign: 'center', 
            fontSize: 14,
            padding: '8px',
            background: '#ffe6e6',
            borderRadius: '4px'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {debugInfo && (
          <div style={{ 
            background: '#fff3cd', 
            padding: '12px', 
            borderRadius: '6px', 
            marginTop: '12px',
            fontSize: '13px',
            color: '#856404',
            textAlign: 'left'
          }}>
            <strong>Debug Information:</strong><br />
            {debugInfo}
          </div>
        )}
        
        {loading && (
          <div style={{ 
            background: '#e3f2fd', 
            padding: '12px', 
            borderRadius: '6px', 
            marginTop: '12px',
            fontSize: '13px',
            color: '#1976d2',
            textAlign: 'center'
          }}>
            <strong>Status:</strong> Connecting to backend... Check browser console for detailed logs.
          </div>
        )}
      </form>
      <div style={{ textAlign: 'center', fontSize: 14, marginTop: 18 }}>
        <Link to="/login" style={{ color: '#7b3f3f', fontWeight: 600 }}>Back to Log in</Link>
      </div>
    </div>
  );
};

export default ForgotPassword; 