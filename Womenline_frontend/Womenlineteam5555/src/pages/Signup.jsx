import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api";

const Signup = () => {
  const [form, setForm] = useState({ 
    Fullname: "", 
    email: "", 
    password: "", 
    phone: "+91" // default +91
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const errors = [];
    if (password.length < minLength) errors.push(`At least ${minLength} characters`);
    if (!hasUpperCase) errors.push("At least one uppercase letter");
    if (!hasLowerCase) errors.push("At least one lowercase letter");
    if (!hasNumbers) errors.push("At least one number");
    if (!hasSpecialChar) errors.push("At least one special character");
    
    return errors;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    const passwordErrors = validatePassword(form.password);
    if (passwordErrors.length > 0) {
      setError(`Password requirements: ${passwordErrors.join(", ")}`);
      return;
    }
    
    setLoading(true);
    try {
      const response = await register({
        Fullname: form.Fullname,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });

      // ✅ Redirect to login if message says user registered
      if (response.message && response.message.includes("User registered")) {
        navigate("/login", { replace: true, state: { email: form.email } });
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="card" 
      style={{ 
        maxWidth: 400, 
        boxShadow: '0 6px 32px 0 rgba(123, 63, 63, 0.12)', 
        padding: '2.5rem 2rem' 
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, color: '#7b3f3f' }}>WOMENLINE</h2>
        <h3 style={{ margin: '0.5rem 0 1.5rem 0', color: '#222', fontWeight: 600 }}>
          Create Your Account
        </h3>
      </div>

      <form 
        onSubmit={handleSubmit} 
        style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}
      >
        <label htmlFor="Fullname" style={{ textAlign: 'left' }}>Full Name</label>
        <input 
          id="Fullname" 
          type="text" 
          placeholder="Enter your Full name" 
          value={form.Fullname} 
          onChange={handleChange} 
          required 
          disabled={loading}
        />
        
        <label htmlFor="email" style={{ textAlign: 'left' }}>Email</label>
        <input 
          id="email" 
          type="email" 
          placeholder="Enter your email" 
          value={form.email} 
          onChange={handleChange} 
          required 
          disabled={loading}
        />

        <label htmlFor="password" style={{ textAlign: 'left' }}>Password</label>
        <input 
          id="password" 
          type="password" 
          placeholder="Create a password" 
          value={form.password} 
          onChange={handleChange} 
          required 
          disabled={loading}
        /> 

        <label htmlFor="phone" style={{ textAlign: 'left' }}>Phone</label>
        <input 
          id="phone" 
          type="tel" 
          placeholder="Enter your phone" 
          value={form.phone} 
          onChange={(e) => {
            let value = e.target.value;
            value = value.replace(/[^\d+]/g, "");
            if (!value.startsWith("+91")) value = "+91" + value.replace(/\+91/g, "");
            if (value.length > 13) value = value.slice(0, 13);
            setForm({ ...form, phone: value });
          }} 
          required 
          disabled={loading}
        />

        <button 
          type="submit" 
          style={{ width: '100%', marginTop: 8 }} 
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        {error && (
          <div style={{ color: 'red', marginTop: 6, textAlign: 'left' }}>
            {error}
          </div>
        )}
      </form>

      <div style={{ textAlign: 'center', fontSize: 14, marginTop: 18 }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: '#7b3f3f', fontWeight: 600 }}>
          Log in
        </Link>
      </div>
    </div>
  );
};

export default Signup;
