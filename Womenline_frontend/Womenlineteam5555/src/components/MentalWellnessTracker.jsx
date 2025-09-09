import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useEmotion } from "../contexts/EmotionContext";
import { createJournal, getJournals, earnCredits } from "../api";

const MentalWellnessTracker = () => {
  const { token, user } = useAuth();
  const { currentTheme, getEmotionMessage } = useEmotion();
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    mood: "happy",
    note: "",
    periodDay: "regular-day"
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchJournals = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await getJournals(token);
      if (response.success) {
        setJournals(response.data || []);
      } else {
        setError(response.message || "Failed to fetch journals");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch journals");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("You must be logged in to create journal entries.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await createJournal(formData, token);
      if (response.success) {
        // Note: We don't automatically update the app emotion here
        // User can manually set their mood in the Dashboard if they want to personalize the app
        
        // Earn credits for journal entry
        try {
          await earnCredits({
            userId: user?.id || 'current',
            activityType: 'journal-entry',
            source: 'Mental Wellness Module'
          }, token);
        } catch (creditError) {
          console.error('Failed to earn credits:', creditError);
        }

        setFormData({
          mood: "happy",
          note: "",
          periodDay: "regular-day"
        });
        
        // Refresh journals
        await fetchJournals();
      } else {
        setError(response.message || "Failed to create journal entry");
      }
    } catch (err) {
      setError(err.message || "Failed to create journal entry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getMoodLabel = (mood) => {
    const moodLabels = {
      'happy': '😊 Happy',
      'sad': '😢 Sad',
      'anxious': '😰 Anxious',
      'angry': '😠 Angry',
      'calm': '😌 Calm',
      'excited': '🤩 Excited',
      'tired': '😴 Tired',
      'stressed': '😤 Stressed'
    };
    return moodLabels[mood] || mood;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="card emotion-card" style={{ maxWidth: 600, textAlign: 'center' }}>
        <h2 className="emotion-text-primary">Mental Wellness Tracker</h2>
        <p className="emotion-text">Loading your journal entries...</p>
      </div>
    );
  }

  return (
    <div className="card emotion-card" style={{ maxWidth: 800 }}>
      <h2 className="emotion-text-primary">🧠 Mental Wellness Tracker</h2>
      <p style={{ color: currentTheme.colors.text, marginBottom: '2rem' }}>
        Track your mood and thoughts to understand your mental wellness patterns.
      </p>

      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '1rem', 
          padding: '0.5rem', 
          background: '#ffe6e6', 
          borderRadius: '4px' 
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Form Section */}
        <div>
          <h3 style={{ color: currentTheme.colors.primary, marginBottom: '1rem' }}>
            {currentTheme.emoji} How are you feeling?
          </h3>
          
          <form onSubmit={handleSubmit} className="emotion-card" style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: currentTheme.colors.text }}>
                Your Mood:
              </label>
              <select 
                name="mood" 
                value={formData.mood} 
                onChange={handleChange}
                className="emotion-input"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
              >
                <option value="happy">😊 Happy</option>
                <option value="excited">🤩 Excited</option>
                <option value="calm">😌 Calm</option>
                <option value="tired">😴 Tired</option>
                <option value="anxious">😰 Anxious</option>
                <option value="stressed">😤 Stressed</option>
                <option value="sad">😢 Sad</option>
                <option value="angry">😠 Angry</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: currentTheme.colors.text }}>
                Your Thoughts:
              </label>
              <textarea 
                name="note" 
                value={formData.note} 
                onChange={handleChange}
                placeholder="How are you feeling today? What's on your mind?"
                rows="4"
                className="emotion-input"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: currentTheme.colors.text }}>
                Period Day:
              </label>
              <select 
                name="periodDay" 
                value={formData.periodDay} 
                onChange={handleChange}
                className="emotion-input"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
              >
                <option value="regular-day">Regular Day</option>
                <option value="period-day">Period Day</option>
                <option value="pms-day">PMS Day</option>
                <option value="ovulation-day">Ovulation Day</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="emotion-button"
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.6 : 1
              }}
            >
              {submitting ? 'Saving...' : '📝 Save Journal Entry'}
            </button>
          </form>

          {/* Emotion-based motivation */}
          <div className="emotion-card" style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '8px',
            background: currentTheme.colors.background
          }}>
            <p style={{ 
              color: currentTheme.colors.text, 
              margin: 0, 
              fontStyle: 'italic',
              textAlign: 'center'
            }}>
              {getEmotionMessage('tip')}
            </p>
          </div>

          {/* Personalization tip */}
          <div className="emotion-card" style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '8px',
            background: currentTheme.colors.background,
            border: `2px solid ${currentTheme.colors.accent}`
          }}>
            <p style={{ 
              color: currentTheme.colors.text, 
              margin: 0, 
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              💡 <strong>Tip:</strong> Want to personalize the app's colors? Go to Dashboard and set your mood in the emotion selector!
            </p>
          </div>
        </div>

        {/* Journal Entries Section */}
        <div>
          <h3 style={{ color: currentTheme.colors.primary, marginBottom: '1rem' }}>
            📖 Recent Journal Entries
          </h3>
          
          {journals.length > 0 ? (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {journals.map((journal, index) => (
                <div key={index} className="emotion-card" style={{
                  marginBottom: '1rem',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ 
                      fontWeight: '600', 
                      color: currentTheme.colors.primary,
                      fontSize: '1.1rem'
                    }}>
                      {getMoodLabel(journal.mood)}
                    </span>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      color: currentTheme.colors.text,
                      fontStyle: 'italic'
                    }}>
                      {formatDate(journal.createdAt || Date.now())}
                    </span>
                  </div>
                  
                  <p style={{ 
                    margin: '0.5rem 0', 
                    color: currentTheme.colors.text,
                    lineHeight: '1.5'
                  }}>
                    "{journal.note}"
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.5rem'
                  }}>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      color: currentTheme.colors.text,
                      background: currentTheme.colors.background,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px'
                    }}>
                      {journal.periodDay || 'Regular Day'}
                    </span>
                    
                    {journal.coinsEarned && (
                      <span style={{ 
                        fontSize: '0.8rem', 
                        color: '#7b3f3f',
                        fontWeight: '600'
                      }}>
                        +{journal.coinsEarned} MaCoin
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="emotion-card" style={{
              padding: '2rem',
              textAlign: 'center',
              borderRadius: '8px'
            }}>
              <p style={{ 
                color: currentTheme.colors.text, 
                margin: 0,
                fontStyle: 'italic'
              }}>
                No journal entries yet. Start by adding your first entry above!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Wellness Tips */}
      <div className="emotion-card" style={{
        marginTop: '2rem',
        padding: '1rem',
        borderRadius: '8px',
        background: currentTheme.colors.background
      }}>
        <h4 style={{ color: currentTheme.colors.primary, marginBottom: '0.5rem' }}>
          💡 Mental Wellness Tips
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: currentTheme.colors.text }}>
          <li>Journal regularly to track your emotional patterns</li>
          <li>Notice how your mood changes throughout your cycle</li>
          <li>Practice self-compassion - all feelings are valid</li>
          <li>Connect with others when you're feeling down</li>
          <li>Try mindfulness or meditation for stress relief</li>
          <li>Set your mood in the dashboard to personalize your experience</li>
        </ul>
      </div>
    </div>
  );
};

export default MentalWellnessTracker; 