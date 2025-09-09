import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { login } from "../api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = e => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    
    try {
      const response = await login(form);
      
      if (response.token) {
        authLogin({ email: form.email }, response.token);
        setSuccess(true);
        setTimeout(() => navigate(from, { replace: true }), 1200);
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400, boxShadow: '0 6px 32px 0 rgba(123, 63, 63, 0.12)', padding: '2.5rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, color: '#7b3f3f' }}>WOMENLINE</h2>
        <h3 style={{ margin: '0.5rem 0 1.5rem 0', color: '#222', fontWeight: 600 }}>Log In to Your Account</h3>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
        <label htmlFor="email" style={{ textAlign: 'left' }}>Email Address</label>
        <input 
          id="email" 
          type="email" 
          placeholder="Enter your email" 
          value={form.email} 
          onChange={handleChange} 
          required 
          disabled={loading}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label htmlFor="password" style={{ textAlign: 'left' }}>Password</label>
          <Link to="/reset" style={{ fontSize: 12, color: '#7b3f3f', textDecoration: 'underline' }}>Forgot Password?</Link>
        </div>
        <input 
          id="password" 
          type="password" 
          placeholder="Enter your password" 
          value={form.password} 
          onChange={handleChange} 
          required 
          disabled={loading}
        />
         
        <button 
          type="submit" 
          style={{ width: '100%', marginTop: 8 }} 
          disabled={loading}
        >
          {loading ? "Logging In..." : "Log In"}
        </button>
        {error && <div style={{ color: 'red', marginTop: 6, textAlign: 'left' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 6, textAlign: 'left' }}>Login successful! Redirecting...</div>}
      </form>
      <div style={{ textAlign: 'center', margin: '1.5rem 0 0.5rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1.5px solid #b97a7a' }} />
         
          <hr style={{ flex: 1, border: 'none', borderTop: '1.5px solid #b97a7a' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
           
          
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: 14, marginTop: 0.15 }}>
        Don't have an account? <Link to="/signup" style={{ color: '#7b3f3f', fontWeight: 600 }}>Sign up</Link>
      </div>
    </div>
  );
};

export default Login; 