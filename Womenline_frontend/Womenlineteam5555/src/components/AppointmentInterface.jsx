import React, { useState } from 'react';
import './AppointmentInterface.css';

const AppointmentInterface = () => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    reason: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle appointment booking logic here
    console.log('Appointment booked:', formData);
    alert('Appointment booked successfully!');
    setFormData({ name: '', date: '', time: '', reason: '' });
  };

  return (
    <div className="appointment-container">
      <header className="womenbg">
        <h1 className="text-2xl font-bold" style={{ marginLeft: "1em" }}>
          WOMENLINE
        </h1>
        <nav className="navbar">
          <ul>
            <li><a href="">Services</a></li>
            <li><a href="">Contact Us</a></li>
            <li><a href="">About</a></li>
            <li><a href="landing.html">Home</a></li>
          </ul>
        </nav>
      </header>
      
      <div className="appointment-content">
        <div className="card">
          <h2>Book Appointment</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                placeholder="Your name" 
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input 
                type="date" 
                id="date" 
                value={formData.date}
                onChange={handleChange}
                required
              />
              <label htmlFor="time">Time</label>
              <input 
                type="time" 
                id="time" 
                value={formData.time}
                onChange={handleChange}
                required
              />
              <label htmlFor="reason">Problem</label>
              <textarea 
                id="reason" 
                rows={3} 
                value={formData.reason}
                onChange={handleChange}
                placeholder="Describe your health concern..."
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Book Appointment
            </button>
          </form>
        </div>
      </div>
      
      <footer className="footer">
        © Made with ❤️ for Women | © 2025 Womenline Project
      </footer>
    </div>
  );
};

export default AppointmentInterface; 