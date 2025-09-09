import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmotion } from "../contexts/EmotionContext";

const Home = () => {
  const navigate = useNavigate();
  const { currentTheme } = useEmotion();
  const [isHovered, setIsHovered] = useState(false);

  function handleGetStarted() {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, ${currentTheme.colors.background} 0%, ${currentTheme.colors.card} 100%)`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 20% 80%, ${currentTheme.colors.primary}15 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, ${currentTheme.colors.secondary}15 0%, transparent 50%)`,
        pointerEvents: 'none'
      }}></div>

      {/* Hero Section */}
      <div style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Main Heading */}
          <div style={{
            marginBottom: '3rem'
          }}>
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '800',
              color: currentTheme.colors.primary,
              margin: '0 0 1rem 0',
              lineHeight: '1.2',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Empowering Women's Health
              <span style={{ 
                display: 'block', 
                fontSize: '2.5rem',
                color: currentTheme.colors.secondary,
                marginTop: '0.5rem'
              }}>
                Through Technology
              </span>
            </h1>
            
            <p style={{
              fontSize: '1.3rem',
              color: currentTheme.colors.text,
              margin: '0 0 2rem 0',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.6',
              opacity: 0.9
            }}>
              Womenline is an AI-powered, multilingual, and culturally intelligent personal wellness platform designed specifically for women across all life stages.
            </p>

            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '3rem'
            }}>
              <button 
                onClick={handleGetStarted}
                style={{
                  background: currentTheme.colors.gradient,
                  color: '#fff',
                  border: 'none',
                  padding: '1rem 2.5rem',
                  borderRadius: '50px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: currentTheme.colors.shadow,
                  transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Get Started Today
              </button>
              
              <button 
                onClick={() => navigate('/login')}
                style={{
                  background: 'transparent',
                  color: currentTheme.colors.primary,
                  border: `2px solid ${currentTheme.colors.primary}`,
                  padding: '1rem 2.5rem',
                  borderRadius: '50px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = currentTheme.colors.primary;
                  e.target.style.color = '#fff';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = currentTheme.colors.primary;
                }}
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {/* Period Tracking */}
            <div style={{
              background: currentTheme.colors.card,
              borderRadius: '20px',
              padding: '2rem',
              border: `2px solid ${currentTheme.colors.border}`,
              boxShadow: currentTheme.colors.shadow,
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = currentTheme.colors.shadow;
            }}
            onClick={() => navigate('/period-tracker')}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                📅
              </div>
              <h3 style={{
                color: currentTheme.colors.primary,
                margin: '0 0 1rem 0',
                fontSize: '1.5rem',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                Period & Hormonal Health
              </h3>
              <p style={{
                color: currentTheme.colors.text,
                margin: '0 0 1.5rem 0',
                lineHeight: '1.6',
                textAlign: 'center',
                opacity: 0.8
              }}>
                Track your cycle symptoms and hormonal health with privacy-first tools designed specifically for women.
              </p>
              <div style={{
                textAlign: 'center'
              }}>
                <span style={{
                  color: currentTheme.colors.primary,
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>
                  Learn More →
                </span>
              </div>
            </div>

            {/* Mental Wellness */}
            <div style={{
              background: currentTheme.colors.card,
              borderRadius: '20px',
              padding: '2rem',
              border: `2px solid ${currentTheme.colors.border}`,
              boxShadow: currentTheme.colors.shadow,
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = currentTheme.colors.shadow;
            }}
            onClick={() => navigate('/mental-wellness')}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                🧠
              </div>
              <h3 style={{
                color: currentTheme.colors.primary,
                margin: '0 0 1rem 0',
                fontSize: '1.5rem',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                Mental Wellness
              </h3>
              <p style={{
                color: currentTheme.colors.text,
                margin: '0 0 1.5rem 0',
                lineHeight: '1.6',
                textAlign: 'center',
                opacity: 0.8
              }}>
                Mood tracking, CBT techniques, gratitude journaling, and emotional support tailored for women's mental health.
              </p>
              <div style={{
                textAlign: 'center'
              }}>
                <span style={{
                  color: currentTheme.colors.primary,
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>
                  Learn More →
                </span>
              </div>
            </div>

            {/* Safety & Legal */}
            <div style={{
              background: currentTheme.colors.card,
              borderRadius: '20px',
              padding: '2rem',
              border: `2px solid ${currentTheme.colors.border}`,
              boxShadow: currentTheme.colors.shadow,
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = currentTheme.colors.shadow;
            }}
            onClick={() => navigate('/safety-tutorials')}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                🛡️
              </div>
              <h3 style={{
                color: currentTheme.colors.primary,
                margin: '0 0 1rem 0',
                fontSize: '1.5rem',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                Safety & Legal Support
              </h3>
              <p style={{
                color: currentTheme.colors.text,
                margin: '0 0 1.5rem 0',
                lineHeight: '1.6',
                textAlign: 'center',
                opacity: 0.8
              }}>
                Access abuse helplines, legal rights information, and anonymous complaint submission with complete privacy.
              </p>
              <div style={{
                textAlign: 'center'
              }}>
                <span style={{
                  color: currentTheme.colors.primary,
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>
                  Learn More →
                </span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div style={{
            background: currentTheme.colors.card,
            borderRadius: '20px',
            padding: '2rem',
            border: `2px solid ${currentTheme.colors.border}`,
            boxShadow: currentTheme.colors.shadow,
            marginBottom: '3rem'
          }}>
            <h2 style={{
              color: currentTheme.colors.primary,
              margin: '0 0 2rem 0',
              fontSize: '2rem',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              Why Choose Womenline?
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              textAlign: 'center'
            }}>
              <div>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '0.5rem'
                }}>
                  🔒
                </div>
                <h3 style={{
                  color: currentTheme.colors.primary,
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.2rem',
                  fontWeight: '600'
                }}>
                  Privacy First
                </h3>
                <p style={{
                  color: currentTheme.colors.text,
                  margin: 0,
                  fontSize: '0.9rem',
                  opacity: 0.8
                }}>
                  Your data is encrypted and secure
                </p>
              </div>
              
              <div>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '0.5rem'
                }}>
                  🌍
                </div>
                <h3 style={{
                  color: currentTheme.colors.primary,
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.2rem',
                  fontWeight: '600'
                }}>
                  Multilingual
                </h3>
                <p style={{
                  color: currentTheme.colors.text,
                  margin: 0,
                  fontSize: '0.9rem',
                  opacity: 0.8
                }}>
                  Available in multiple languages
                </p>
              </div>
              
              <div>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '0.5rem'
                }}>
                  🤖
                </div>
                <h3 style={{
                  color: currentTheme.colors.primary,
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.2rem',
                  fontWeight: '600'
                }}>
                  AI-Powered
                </h3>
                <p style={{
                  color: currentTheme.colors.text,
                  margin: 0,
                  fontSize: '0.9rem',
                  opacity: 0.8
                }}>
                  Intelligent insights and support
                </p>
              </div>
              
              <div>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '0.5rem'
                }}>
                  💝
                </div>
                <h3 style={{
                  color: currentTheme.colors.primary,
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.2rem',
                  fontWeight: '600'
                }}>
                  Women-Focused
                </h3>
                <p style={{
                  color: currentTheme.colors.text,
                  margin: 0,
                  fontSize: '0.9rem',
                  opacity: 0.8
                }}>
                  Designed specifically for women
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div style={{
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            <h2 style={{
              color: currentTheme.colors.primary,
              margin: '0 0 1rem 0',
              fontSize: '2rem',
              fontWeight: '600'
            }}>
              Ready to Start Your Wellness Journey?
            </h2>
            <p style={{
              color: currentTheme.colors.text,
              margin: '0 0 2rem 0',
              fontSize: '1.1rem',
              opacity: 0.8
            }}>
              Join thousands of women who trust Womenline for their health and wellness needs.
            </p>
            <button 
              onClick={handleGetStarted}
              style={{
                background: currentTheme.colors.gradient,
                color: '#fff',
                border: 'none',
                padding: '1.2rem 3rem',
                borderRadius: '50px',
                fontSize: '1.2rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: currentTheme.colors.shadow
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = currentTheme.colors.shadow;
              }}
            >
              Start Your Free Account
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        color: currentTheme.colors.primary,
        borderTop: `1px solid ${currentTheme.colors.border}`,
        background: currentTheme.colors.card
      }}>
        <p style={{
          margin: 0,
          fontSize: '1rem',
          fontWeight: '500'
        }}>
          Made with <span role="img" aria-label="love" style={{ color: '#e74c3c' }}>❤️</span> for Women | © 2025 Womenline Project
        </p>
      </footer>
    </div>
  );
};

export default Home; 