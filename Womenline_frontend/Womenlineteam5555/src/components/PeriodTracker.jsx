import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEmotion } from '../contexts/EmotionContext';
import { createPeriodLog, getPeriodLogs, earnCredits } from '../api';

const PeriodTracker = () => {
  const { token, user } = useAuth();
  const { currentTheme } = useEmotion();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [periodLogs, setPeriodLogs] = useState([]);
  const [localPeriodDays, setLocalPeriodDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    symptoms: [],
    mood: 'Happy',
    notes: '',
    cycleLength: 28
  });

  const [cycleLength, setCycleLength] = useState(28);
  const [lastPeriodDate, setLastPeriodDate] = useState(null);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [customCycleLength, setCustomCycleLength] = useState(28);

  const symptoms = [
    'cramps', 'bloating', 'fatigue', 'mood swings', 
    'headaches', 'back pain', 'breast tenderness', 'acne',
    'food cravings', 'insomnia', 'hot flashes', 'irritability'
  ];

  const moods = [
    'Happy', 'Sad', 'Irritable', 'Anxious', 'Calm', 
    'Energetic', 'Tired', 'Stressed', 'Excited', 'Depressed'
  ];

  // Load local period days from localStorage
  useEffect(() => {
    const savedPeriodDays = localStorage.getItem('periodDays');
    if (savedPeriodDays) {
      const savedDays = JSON.parse(savedPeriodDays);
      setLocalPeriodDays(savedDays);
      
      // Calculate cycle length from saved data
      if (savedDays.length >= 2) {
        calculateCycleLength(savedDays);
      }
      
      // Set last period date
      if (savedDays.length > 0) {
        const sortedDays = savedDays.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLastPeriodDate(sortedDays[0].date);
      }
    }
  }, []);

  const calculateCycleLength = (periodDays) => {
    if (periodDays.length < 2) return;
    
    const sortedDays = periodDays.sort((a, b) => new Date(a.date) - new Date(b.date));
    let totalDays = 0;
    let cycleCount = 0;
    
    for (let i = 1; i < sortedDays.length; i++) {
      const prevDate = new Date(sortedDays[i-1].date);
      const currDate = new Date(sortedDays[i].date);
      const daysDiff = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff >= 20 && daysDiff <= 40) { // Reasonable cycle length
        totalDays += daysDiff;
        cycleCount++;
      }
    }
    
    if (cycleCount > 0) {
      const avgCycleLength = Math.round(totalDays / cycleCount);
      setCycleLength(avgCycleLength);
    }
  };

  const predictNextPeriod = () => {
    if (!lastPeriodDate) return null;
    
    const lastDate = new Date(lastPeriodDate);
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + cycleLength);
    
    return nextDate.toISOString().split('T')[0];
  };

  const getPredictedPeriodDays = () => {
    if (!lastPeriodDate || cycleLength === 0) return [];
    
    const predictedDays = [];
    const lastDate = new Date(lastPeriodDate);
    
    // Predict next 3 cycles
    for (let cycle = 1; cycle <= 3; cycle++) {
      const predictedDate = new Date(lastDate);
      predictedDate.setDate(lastDate.getDate() + (cycleLength * cycle));
      predictedDays.push(predictedDate.toISOString().split('T')[0]);
    }
    
    return predictedDays;
  };

  const getPredictedPeriodRanges = () => {
    if (!lastPeriodDate || cycleLength === 0) return [];
    
    const predictedRanges = [];
    const lastDate = new Date(lastPeriodDate);
    
    // Predict next 3 cycles with duration
    for (let cycle = 1; cycle <= 3; cycle++) {
      const startDate = new Date(lastDate);
      startDate.setDate(lastDate.getDate() + (cycleLength * cycle));
      
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + periodDuration - 1);
      
      predictedRanges.push({
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      });
    }
    
    return predictedRanges;
  };

  const getOvulationDays = () => {
    if (!lastPeriodDate || cycleLength === 0) return [];
    
    const ovulationDays = [];
    const lastDate = new Date(lastPeriodDate);
    
    // Calculate ovulation for next 3 cycles (typically 14 days before next period)
    for (let cycle = 1; cycle <= 3; cycle++) {
      const nextPeriodStart = new Date(lastDate);
      nextPeriodStart.setDate(lastDate.getDate() + (cycleLength * cycle));
      
      const ovulationDate = new Date(nextPeriodStart);
      ovulationDate.setDate(nextPeriodStart.getDate() - 14);
      
      ovulationDays.push(ovulationDate.toISOString().split('T')[0]);
    }
    
    return ovulationDays;
  };

  const getFertileDays = () => {
    if (!lastPeriodDate || cycleLength === 0) return [];
    
    const fertileDays = [];
    const lastDate = new Date(lastPeriodDate);
    
    // Calculate fertile window for next 3 cycles (5 days before and 1 day after ovulation)
    for (let cycle = 1; cycle <= 3; cycle++) {
      const nextPeriodStart = new Date(lastDate);
      nextPeriodStart.setDate(lastDate.getDate() + (cycleLength * cycle));
      
      const ovulationDate = new Date(nextPeriodStart);
      ovulationDate.setDate(nextPeriodStart.getDate() - 14);
      
      // Add 5 days before ovulation and 1 day after
      for (let day = -5; day <= 1; day++) {
        const fertileDate = new Date(ovulationDate);
        fertileDate.setDate(ovulationDate.getDate() + day);
        fertileDays.push(fertileDate.toISOString().split('T')[0]);
      }
    }
    
    return fertileDays;
  };

  const fetchPeriodLogs = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await getPeriodLogs(token);
      if (response.success) {
        const logs = response.data || [];
        console.log('Fetched period logs:', logs);
        setPeriodLogs(logs);
      } else {
        setError(response.message || 'Failed to fetch period logs');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch period logs');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPeriodLogs();
  }, [fetchPeriodLogs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('You must be logged in to log period data.');
      return;
    }

    if (!formData.startDate) {
      setError('Please select a date.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const dateText = new Date(formData.startDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const logData = {
        mood: formData.mood,
        notes: `Period Day - ${dateText}\n${formData.notes || ''}`
      };
      
      const response = await createPeriodLog(logData, token);
      if (response.success) {
        console.log('Period log created successfully:', response);
        
        // Add to local storage for immediate calendar update
        const newPeriodDay = {
          date: formData.startDate,
          mood: formData.mood,
          notes: formData.notes,
          timestamp: new Date().toISOString()
        };
        
        const updatedLocalPeriodDays = [...localPeriodDays, newPeriodDay];
        setLocalPeriodDays(updatedLocalPeriodDays);
        localStorage.setItem('periodDays', JSON.stringify(updatedLocalPeriodDays));
        
        // Update last period date and recalculate cycle length
        setLastPeriodDate(formData.startDate);
        calculateCycleLength(updatedLocalPeriodDays);
        
        // Earn credits for logging period
        try {
          await earnCredits({
            activityType: 'period-log',
            source: 'Period Tracker'
          }, token);
        } catch (creditErr) {
          console.error('Failed to earn credits:', creditErr);
        }
        
        // Refresh period logs
        await fetchPeriodLogs();
        
        setFormData({
          startDate: '',
          endDate: '',
          symptoms: [],
          mood: 'Happy',
          notes: '',
          cycleLength: 28
        });
        setShowForm(false);
        
        // Force calendar re-render
        setCurrentDate(new Date(currentDate));
      } else {
        setError(response.message || 'Failed to create period log');
      }
    } catch (err) {
      setError(err.message || 'Failed to create period log');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSymptomChange = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
    const days = [];
    
    console.log('Rendering calendar with local period days:', localPeriodDays);
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="date empty"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Check if this day is an actual period day
      const isActualPeriodDay = localPeriodDays.some(periodDay => {
        return periodDay.date === dateStr;
      });
      
      // Check if this day is a predicted period day
      const predictedRanges = getPredictedPeriodRanges();
      const isPredictedPeriodDay = predictedRanges.some(range => {
        const current = new Date(dateStr);
        const start = new Date(range.start);
        const end = new Date(range.end);
        return current >= start && current <= end;
      });
      
      // Check if this day is ovulation
      const ovulationDays = getOvulationDays();
      const isOvulationDay = ovulationDays.includes(dateStr);
      
      // Check if this day is fertile
      const fertileDays = getFertileDays();
      const isFertileDay = fertileDays.includes(dateStr);
      
      console.log(`Day ${day} (${dateStr}) - Actual: ${isActualPeriodDay}, Predicted: ${isPredictedPeriodDay}, Ovulation: ${isOvulationDay}, Fertile: ${isFertileDay}`);
      
      let dayStyle = {
        cursor: 'pointer',
        padding: '0.5rem',
        textAlign: 'center',
        borderRadius: '4px',
        fontWeight: 'normal'
      };
      
      // Priority: Actual Period > Predicted Period > Ovulation > Fertile
      if (isActualPeriodDay) {
        dayStyle.background = '#f7aaaa';
        dayStyle.color = '#fff';
        dayStyle.fontWeight = 'bold';
      } else if (isPredictedPeriodDay) {
        dayStyle.background = '#be7b75';
        dayStyle.color = '#fff';
        dayStyle.fontWeight = 'bold';
      } else if (isOvulationDay) {
        dayStyle.background = '#90caf9';
        dayStyle.color = '#fff';
        dayStyle.fontWeight = 'bold';
      } else if (isFertileDay) {
        dayStyle.background = '#b2dfdb';
        dayStyle.color = '#333';
        dayStyle.fontWeight = 'bold';
      }
      
      days.push(
        <div 
          key={day} 
          className={`date ${isActualPeriodDay ? 'period-day' : ''} ${isPredictedPeriodDay ? 'predicted-period-day' : ''} ${isOvulationDay ? 'ovulation-day' : ''} ${isFertileDay ? 'fertile-day' : ''}`}
          style={dayStyle}
          onClick={() => {
            setFormData(prev => ({ ...prev, startDate: dateStr }));
            setShowForm(true);
          }}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  const changeMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: `4px solid ${currentTheme.colors.border}`,
            borderTop: `4px solid ${currentTheme.colors.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: currentTheme.colors.text }}>Loading your period data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="period-tracker-card">
      <h2>Period Tracker</h2>
      
      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '1rem', 
          padding: '1rem', 
          background: '#ffe6e6', 
          borderRadius: '8px',
          border: '1px solid #ffcccc'
        }}>
          {error}
        </div>
      )}

      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)}>&lt; Previous</button>
        <h2>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={() => changeMonth(1)}>Next &gt;</button>
      </div>

      {/* Debug info */}
      <div style={{ 
        background: '#f0f0f0', 
        padding: '0.5rem', 
        marginBottom: '1rem', 
        borderRadius: '4px',
        fontSize: '0.8rem'
      }}>
        <strong>Debug Info:</strong> Found {localPeriodDays.length} local period days
        {localPeriodDays.length > 0 && (
          <div>
            {localPeriodDays.map((periodDay, index) => (
              <div key={index} style={{ marginLeft: '1rem' }}>
                Day {index + 1}: {periodDay.date} - {periodDay.mood} - {periodDay.notes?.substring(0, 30)}...
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cycle Information */}
      {localPeriodDays.length > 0 && (
        <div style={{ 
          background: '#e8f5e8', 
          padding: '1rem', 
          marginBottom: '1rem', 
          borderRadius: '8px',
          border: '1px solid #4caf50'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>📊 Cycle Information</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>Calculated Cycle Length:</strong> {cycleLength} days
            </div>
            <div>
              <strong>Last Period:</strong> {lastPeriodDate ? new Date(lastPeriodDate).toLocaleDateString() : 'Not recorded'}
            </div>
            <div>
              <strong>Next Predicted:</strong> {predictNextPeriod() ? new Date(predictNextPeriod()).toLocaleDateString() : 'Not enough data'}
            </div>
            <div>
              <strong>Total Logs:</strong> {localPeriodDays.length} period days
            </div>
          </div>
        </div>
      )}

      {/* Settings Section */}
      <div style={{ 
        background: '#fff3cd', 
        padding: '1rem', 
        marginBottom: '1rem', 
        borderRadius: '8px',
        border: '1px solid #ffc107'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#856404' }}>⚙️ Customize Your Cycle</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Custom Cycle Length (days):
            </label>
            <input
              type="number"
              min="20"
              max="40"
              value={customCycleLength}
              onChange={(e) => setCustomCycleLength(parseInt(e.target.value) || 28)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
            <small style={{ color: '#666' }}>Typical range: 21-35 days</small>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Period Duration (days):
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={periodDuration}
              onChange={(e) => setPeriodDuration(parseInt(e.target.value) || 5)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
            <small style={{ color: '#666' }}>Typical range: 3-7 days</small>
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={() => {
              setCycleLength(customCycleLength);
              console.log(`Updated cycle length to ${customCycleLength} days and period duration to ${periodDuration} days`);
            }}
            style={{
              background: '#ffc107',
              color: '#333',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Update Settings
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="day">Sun</div>
        <div className="day">Mon</div>
        <div className="day">Tue</div>
        <div className="day">Wed</div>
        <div className="day">Thu</div>
        <div className="day">Fri</div>
        <div className="day">Sat</div>
        {renderCalendar()}
      </div>

      <div className="legend">
        <span><div className="color-box" style={{ backgroundColor: '#f7aaaa' }}></div>Actual Period Days</span>
        <span><div className="color-box" style={{ backgroundColor: '#be7b75' }}></div>Predicted Period Days</span>
        <span><div className="color-box" style={{ backgroundColor: '#90caf9' }}></div>Ovulation Day</span>
        <span><div className="color-box" style={{ backgroundColor: '#b2dfdb' }}></div>Fertile Window</span>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button 
          onClick={() => setShowForm(true)}
          style={{ 
            background: currentTheme.colors.gradient, 
            color: '#fff', 
            border: 'none', 
            padding: '0.8rem 1.5rem', 
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            marginRight: '1rem'
          }}
        >
          Log Period
        </button>
        
        <button 
          onClick={fetchPeriodLogs}
          style={{ 
            background: '#6c757d', 
            color: '#fff', 
            border: 'none', 
            padding: '0.8rem 1.5rem', 
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem'
          }}
        >
          Refresh Logs
        </button>
      </div>

      {showForm && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: 500, maxHeight: '80vh', overflow: 'auto' }}>
            <h3>Log Period Details</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Date:</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label>Mood:</label>
                <select
                  value={formData.mood}
                  onChange={(e) => setFormData(prev => ({ ...prev, mood: e.target.value }))}
                >
                  {moods.map(mood => (
                    <option key={mood} value={mood}>{mood}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label>Notes:</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="How are you feeling today? Any symptoms or notes..."
                  rows="3"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Log Period Day'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  style={{ background: '#ccc' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {localPeriodDays.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Recent Period Logs</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {localPeriodDays.slice(-3).reverse().map((periodDay, index) => (
              <div key={index} style={{
                background: '#fff',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #b97a7a'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong>{new Date(periodDay.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</strong>
                  <span style={{ color: '#7b3f3f' }}>{periodDay.mood}</span>
                </div>
                {periodDay.notes && (
                  <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    Notes: {periodDay.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CSS for loading animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default PeriodTracker; 