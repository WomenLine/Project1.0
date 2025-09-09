import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEmotion } from "../contexts/EmotionContext";
import { getRewards } from "../api";
import EmotionSelector from "../components/EmotionSelector";

const Dashboard = () => {
  const { token, credits, user } = useAuth();
  const { currentTheme, getEmotionMessage, hasCustomEmotion } = useEmotion();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("You must be logged in to view your dashboard.");
      setLoading(false);
      return;
    }

    const fetchRewards = async () => {
      try {
        const response = await getRewards(token);
        if (response.success) {
          setRewards(response.data || []);
        } else {
          setError(response.message || "Failed to fetch rewards");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch rewards");
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [token]);

  const handleQuickAction = (action) => {
    switch (action) {
      case 'period-tracker':
        navigate('/period-tracker');
        break;
      case 'mental-wellness':
        navigate('/mental-wellness');
        break;
      case 'health-data':
        navigate('/health');
        break;
      case 'coin-history':
        navigate('/coin-history');
        break;
      case 'enhanced-coins':
        navigate('/enhanced-coins');
        break;
      case 'pdf-generator':
        navigate('/pdf-generator');
        break;
      default:
        break;
    }
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
          <p style={{ color: currentTheme.colors.text }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: currentTheme.colors.primary }}>Dashboard</h2>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {/* Header Section */}
      <div style={{
        background: currentTheme.colors.gradient,
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        color: '#fff',
        textAlign: 'center',
        boxShadow: currentTheme.colors.shadow
      }}>
        <h1 style={{ 
          margin: '0 0 0.5rem 0', 
          fontSize: '2.5rem',
          fontWeight: '700'
        }}>
          Welcome back! 👋
        </h1>
        {user && (
          <p style={{ 
            margin: '0 0 1rem 0',
            fontSize: '1.2rem',
            opacity: 0.9
          }}>
            Hello, {user.email}
          </p>
        )}
        
        {/* MaCoin Display */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '1rem',
          background: 'rgba(255,255,255,0.2)',
          padding: '1rem 2rem',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          <span style={{ fontSize: '2rem' }}>🪙</span>
          <div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>MaCoin Balance</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700' }}>{credits}</div>
          </div>
        </div>
      </div>

      {/* Emotion Selector */}
      <div style={{ marginBottom: '2rem' }}>
        <EmotionSelector />
      </div>

      {/* Quick Actions Grid */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          color: currentTheme.colors.primary, 
          marginBottom: '1.5rem',
          fontSize: '1.8rem',
          fontWeight: '600'
        }}>
          Quick Actions
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Period Tracker */}
          <div 
            onClick={() => handleQuickAction('period-tracker')}
            style={{
              background: currentTheme.colors.card,
              borderRadius: '15px',
              padding: '1.5rem',
              cursor: 'pointer',
              border: `2px solid ${currentTheme.colors.border}`,
              boxShadow: currentTheme.colors.shadow,
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = currentTheme.colors.shadow;
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            <h3 style={{ 
              color: currentTheme.colors.primary, 
              margin: '0 0 0.5rem 0',
              fontSize: '1.3rem',
              fontWeight: '600'
            }}>
              Period Tracker
            </h3>
            <p style={{ 
              color: currentTheme.colors.text, 
              margin: 0,
              opacity: 0.8,
              lineHeight: '1.5'
            }}>
              Track your menstrual cycle and symptoms
            </p>
          </div>

          {/* Mental Wellness */}
          <div 
            onClick={() => handleQuickAction('mental-wellness')}
            style={{
              background: currentTheme.colors.card,
              borderRadius: '15px',
              padding: '1.5rem',
              cursor: 'pointer',
              border: `2px solid ${currentTheme.colors.border}`,
              boxShadow: currentTheme.colors.shadow,
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = currentTheme.colors.shadow;
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠</div>
            <h3 style={{ 
              color: currentTheme.colors.primary, 
              margin: '0 0 0.5rem 0',
              fontSize: '1.3rem',
              fontWeight: '600'
            }}>
              Mental Wellness
            </h3>
            <p style={{ 
              color: currentTheme.colors.text, 
              margin: 0,
              opacity: 0.8,
              lineHeight: '1.5'
            }}>
              Journal your thoughts and track your mood
            </p>
          </div>

          {/* Health Data */}
          <div 
            onClick={() => handleQuickAction('health-data')}
            style={{
              background: currentTheme.colors.card,
              borderRadius: '15px',
              padding: '1.5rem',
              cursor: 'pointer',
              border: `2px solid ${currentTheme.colors.border}`,
              boxShadow: currentTheme.colors.shadow,
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = currentTheme.colors.shadow;
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ 
              color: currentTheme.colors.primary, 
              margin: '0 0 0.5rem 0',
              fontSize: '1.3rem',
              fontWeight: '600'
            }}>
              Health Data
            </h3>
            <p style={{ 
              color: currentTheme.colors.text, 
              margin: 0,
              opacity: 0.8,
              lineHeight: '1.5'
            }}>
              View your health insights and analytics
            </p>
          </div>

          {/* Coin History */}
          <div 
            onClick={() => handleQuickAction('coin-history')}
            style={{
              background: currentTheme.colors.card,
              borderRadius: '15px',
              padding: '1.5rem',
              cursor: 'pointer',
              border: `2px solid ${currentTheme.colors.border}`,
              boxShadow: currentTheme.colors.shadow,
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = currentTheme.colors.shadow;
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🪙</div>
            <h3 style={{ 
              color: currentTheme.colors.primary, 
              margin: '0 0 0.5rem 0',
              fontSize: '1.3rem',
              fontWeight: '600'
            }}>
              Coin History
            </h3>
            <p style={{ 
              color: currentTheme.colors.text, 
              margin: 0,
              opacity: 0.8,
              lineHeight: '1.5'
            }}>
              Track your MaCoin earning history
            </p>
          </div>

          {/* Enhanced Coins */}
          <div 
            onClick={() => handleQuickAction('enhanced-coins')}
            style={{
              background: currentTheme.colors.card,
              borderRadius: '15px',
              padding: '1.5rem',
              cursor: 'pointer',
              border: `2px solid ${currentTheme.colors.border}`,
              boxShadow: currentTheme.colors.shadow,
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = currentTheme.colors.shadow;
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
            <h3 style={{ 
              color: currentTheme.colors.primary, 
              margin: '0 0 0.5rem 0',
              fontSize: '1.3rem',
              fontWeight: '600'
            }}>
              Enhanced Coins
            </h3>
            <p style={{ 
              color: currentTheme.colors.text, 
              margin: 0,
              opacity: 0.8,
              lineHeight: '1.5'
            }}>
              Advanced coin system with goals and achievements
            </p>
          </div>

          {/* PDF Generator */}
          <div 
            onClick={() => handleQuickAction('pdf-generator')}
            style={{
              background: currentTheme.colors.card,
              borderRadius: '15px',
              padding: '1.5rem',
              cursor: 'pointer',
              border: `2px solid ${currentTheme.colors.border}`,
              boxShadow: currentTheme.colors.shadow,
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = currentTheme.colors.shadow;
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
            <h3 style={{ 
              color: currentTheme.colors.primary, 
              margin: '0 0 0.5rem 0',
              fontSize: '1.3rem',
              fontWeight: '600'
            }}>
              Health Reports
            </h3>
            <p style={{ 
              color: currentTheme.colors.text, 
              margin: 0,
              opacity: 0.8,
              lineHeight: '1.5'
            }}>
              Generate PDF reports for doctor visits
            </p>
          </div>

          {/* AI Assistant */}
          <div 
            onClick={() => {
              // Trigger chatbot to open
              const chatbotButton = document.querySelector('[data-chatbot-trigger]');
              if (chatbotButton) {
                chatbotButton.click();
              }
            }}
            style={{
              background: currentTheme.colors.card,
              borderRadius: '15px',
              padding: '1.5rem',
              cursor: 'pointer',
              border: `2px solid ${currentTheme.colors.border}`,
              boxShadow: currentTheme.colors.shadow,
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = currentTheme.colors.shadow;
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
            <h3 style={{ 
              color: currentTheme.colors.primary, 
              margin: '0 0 0.5rem 0',
              fontSize: '1.3rem',
              fontWeight: '600'
            }}>
              AI Assistant
            </h3>
            <p style={{ 
              color: currentTheme.colors.text, 
              margin: 0,
              opacity: 0.8,
              lineHeight: '1.5'
            }}>
              Get help with health tracking and tips
            </p>
          </div>
        </div>
      </div>

      {/* Rewards Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          color: currentTheme.colors.primary, 
          marginBottom: '1.5rem',
          fontSize: '1.8rem',
          fontWeight: '600'
        }}>
          Available Rewards
        </h2>
        
        {rewards.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {rewards.map((reward, index) => (
              <div key={index} style={{
                background: currentTheme.colors.card,
                padding: '1.5rem',
                borderRadius: '15px',
                border: `2px solid ${currentTheme.colors.border}`,
                boxShadow: currentTheme.colors.shadow,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ 
                    margin: '0 0 0.5rem 0', 
                    color: currentTheme.colors.primary,
                    fontSize: '1.2rem',
                    fontWeight: '600'
                  }}>
                    {reward.title}
                  </h4>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.9rem', 
                    color: currentTheme.colors.text,
                    opacity: 0.8,
                    lineHeight: '1.4'
                  }}>
                    {reward.description || 'No description available'}
                  </p>
                </div>
                <div style={{ 
                  background: '#ffe066', 
                  color: '#7b3f3f', 
                  padding: '0.8rem 1.2rem',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  minWidth: '80px',
                  textAlign: 'center'
                }}>
                  {reward.cost}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: currentTheme.colors.card,
            padding: '2rem',
            borderRadius: '15px',
            border: `2px solid ${currentTheme.colors.border}`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🎁</div>
            <p style={{ 
              color: currentTheme.colors.text, 
              margin: 0,
              fontStyle: 'italic',
              opacity: 0.8
            }}>
              No rewards available at the moment. Check back later!
            </p>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div style={{
        background: currentTheme.colors.background,
        borderRadius: '15px',
        padding: '2rem',
        border: `2px solid ${currentTheme.colors.border}`
      }}>
        <h3 style={{ 
          color: currentTheme.colors.primary, 
          marginBottom: '1rem',
          fontSize: '1.5rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          💡 Quick Tips
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📅</span>
            <span style={{ color: currentTheme.colors.text }}>Log your period regularly to earn MaCoins</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🧠</span>
            <span style={{ color: currentTheme.colors.text }}>Track your mood daily for better mental wellness</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📊</span>
            <span style={{ color: currentTheme.colors.text }}>Complete health forms to unlock more features</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🪙</span>
            <span style={{ color: currentTheme.colors.text }}>Redeem rewards with your earned MaCoins</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📈</span>
            <span style={{ color: currentTheme.colors.text }}>Check your coin history to see earning patterns</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>⭐</span>
            <span style={{ color: currentTheme.colors.text }}>Try the enhanced coin system for more features</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📄</span>
            <span style={{ color: currentTheme.colors.text }}>Generate PDF reports for doctor visits</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🌸</span>
            <span style={{ color: currentTheme.colors.text }}>Set your mood to personalize your experience</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🤖</span>
            <span style={{ color: currentTheme.colors.text }}>Chat with our AI assistant for help and tips</span>
          </div>
        </div>
      </div>

      {/* Motivation Message */}
      {hasCustomEmotion() && (
        <div style={{
          background: currentTheme.colors.card,
          borderRadius: '15px',
          padding: '1.5rem',
          marginTop: '2rem',
          border: `2px solid ${currentTheme.colors.border}`,
          textAlign: 'center'
        }}>
          <p style={{ 
            color: currentTheme.colors.text, 
            margin: 0, 
            fontStyle: 'italic',
            fontSize: '1.1rem'
          }}>
            {getEmotionMessage('motivation')}
          </p>
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

export default Dashboard; 