import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEmotion } from '../contexts/EmotionContext';
import './ChatbotPlayer.css';

const ChatbotPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const { currentTheme } = useEmotion();

  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: `Hello ${user?.email ? user.email.split('@')[0] : 'there'}! 👋 I'm your Womenline assistant. I'm here to help you with:\n\n• Health tracking tips\n• Period tracker guidance\n• Mental wellness support\n• MaCoin earning advice\n• General health questions\n\nHow can I assist you today?`,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage.toLowerCase());
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateBotResponse = (message) => {
    const responses = {
      // Health tracking
      'period': [
        "Tracking your period is important for understanding your cycle! 📅 You can use our Period Tracker to log your dates and symptoms. This helps predict future cycles and identify any irregularities.",
        "Great question about period tracking! 🩸 Our Period Tracker feature helps you monitor your cycle length, symptoms, and fertility windows. Regular tracking can help you notice patterns and discuss them with your healthcare provider."
      ],
      'cycle': [
        "Your menstrual cycle is unique to you! 🔄 Most cycles are between 21-35 days, but this can vary. Track your cycle regularly to understand your body's patterns and identify any changes.",
        "Understanding your cycle is key to reproductive health! 📊 Our Period Tracker can help you identify your cycle length, ovulation timing, and any irregularities. This information is valuable for family planning and health monitoring."
      ],
      'symptoms': [
        "Period symptoms can vary greatly from person to person! 😊 Common symptoms include cramps, bloating, mood changes, and fatigue. Track your symptoms in our Period Tracker to identify patterns and discuss with your doctor if needed.",
        "Everyone experiences period symptoms differently! 🌸 Some common ones are cramps, breast tenderness, mood swings, and food cravings. Logging these in our tracker helps you understand your body better."
      ],

      // Mental wellness
      'mood': [
        "Your mental health is just as important as physical health! 🧠 Our Mental Wellness Tracker helps you journal your thoughts and track mood patterns. Regular check-ins can help identify triggers and coping strategies.",
        "Taking care of your mental wellness is crucial! 💭 Use our Mental Wellness feature to log your daily mood, thoughts, and feelings. This can help you recognize patterns and seek support when needed."
      ],
      'stress': [
        "Stress management is essential for overall health! 😌 Try deep breathing, meditation, or gentle exercise. Our Mental Wellness tracker can help you identify stress triggers and track your coping strategies.",
        "Stress affects everyone differently! 🌿 Consider activities like yoga, walking, or talking with friends. Our app's Mental Wellness feature can help you track stress levels and find what works for you."
      ],
      'anxiety': [
        "Anxiety is a common experience, and it's okay to seek support! 🤗 Try grounding techniques like deep breathing or the 5-4-3-2-1 method. Our Mental Wellness tracker can help you monitor anxiety patterns.",
        "You're not alone in experiencing anxiety! 💙 Consider talking to a mental health professional. Our app can help you track anxiety triggers and coping strategies that work for you."
      ],

      // MaCoins
      'coin': [
        "MaCoins are our way of rewarding healthy habits! 🪙 You earn coins by tracking your period, logging mood entries, completing health forms, and staying consistent. Use them to redeem rewards!",
        "Earn MaCoins by taking care of yourself! ⭐ Track your period (+5 coins), log mood entries (+3 coins), complete health forms (+10 coins), and maintain streaks for bonus rewards!"
      ],
      'earn': [
        "You can earn MaCoins through various activities! 💰 Track your period (5 coins), log mood entries (3 coins), complete health forms (10 coins), and maintain weekly streaks for bonus rewards!",
        "MaCoins reward healthy habits! 🎯 Regular period tracking, mood logging, and form completion all earn you coins. Check your Coin History to see your earning patterns!"
      ],
      'reward': [
        "Redeem your MaCoins for exciting rewards! 🎁 Check the Available Rewards section in your dashboard to see what's available. More coins = more rewards!",
        "Your MaCoins can be exchanged for rewards! 🏆 Visit the rewards section to see available items. Keep tracking your health to earn more coins!"
      ],

      // General health
      'health': [
        "Your health journey is unique! 🌟 Our app helps you track various aspects of your health - from period cycles to mental wellness. Regular tracking provides valuable insights for you and your healthcare providers.",
        "Taking charge of your health is empowering! 💪 Use our features to track your period, monitor mental wellness, and maintain health records. This data helps you make informed health decisions."
      ],
      'doctor': [
        "Preparing for doctor visits is important! 👩‍⚕️ Use our PDF Generator to create health reports from your tracked data. This helps your doctor understand your health patterns better.",
        "Good communication with healthcare providers is key! 📋 Our Health Reports feature creates PDF summaries of your tracked data, making it easier to discuss your health with doctors."
      ],

      // App features
      'tracker': [
        "Our Period Tracker helps you monitor your menstrual cycle! 📅 Log your period dates, symptoms, and flow to understand your body's patterns and predict future cycles.",
        "The Period Tracker is a powerful tool for cycle awareness! 🩸 Track your dates, symptoms, and cycle length to identify patterns and discuss any irregularities with your healthcare provider."
      ],
      'wellness': [
        "Mental wellness is crucial for overall health! 🧠 Our Mental Wellness Tracker helps you journal thoughts, track mood patterns, and identify triggers. Regular check-ins support emotional well-being.",
        "Taking care of your mental health matters! 💭 Use our Mental Wellness feature to log daily mood, thoughts, and feelings. This helps you recognize patterns and seek support when needed."
      ],
      'pdf': [
        "Our PDF Generator creates health reports for doctor visits! 📄 It compiles your tracked data into professional reports, making it easier to discuss your health with healthcare providers.",
        "Generate professional health reports! 📋 The PDF Generator organizes your period, mood, and health data into reports you can share with doctors for better care coordination."
      ],

      // Help and support
      'help': [
        "I'm here to help! 🤝 You can ask me about period tracking, mental wellness, MaCoins, health features, or general health questions. What would you like to know?",
        "I'm your Womenline assistant! 💬 I can help with period tracking tips, mental wellness guidance, MaCoin earning advice, and general health questions. Just ask!"
      ],
      'hello': [
        "Hello! 👋 How can I assist you today? I can help with period tracking, mental wellness, MaCoins, or any health-related questions!",
        "Hi there! 😊 I'm here to support your health journey. Ask me about tracking, wellness, coins, or any health questions!"
      ],
      'hi': [
        "Hi! 👋 How can I help you today? I'm here to support your health and wellness journey!",
        "Hello! 😊 What would you like to know about your health tracking or wellness features?"
      ]
    };

    // Check for keyword matches
    for (const [keyword, responseArray] of Object.entries(responses)) {
      if (message.includes(keyword)) {
        return responseArray[Math.floor(Math.random() * responseArray.length)];
      }
    }

    // Default responses for unrecognized messages
    const defaultResponses = [
      "That's an interesting question! 🤔 I'm here to help with period tracking, mental wellness, MaCoins, and general health topics. Could you rephrase your question or ask about one of these areas?",
      "I'm still learning! 📚 I can best help with period tracking, mental wellness, MaCoins, and health-related questions. What would you like to know about these topics?",
      "Great question! 💭 I'm designed to help with women's health topics like period tracking, mental wellness, and our MaCoin system. How can I assist you with these areas?",
      "I'm here to support your health journey! 🌸 I can help with period tracking, mental wellness guidance, MaCoin earning tips, and general health questions. What would you like to explore?"
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div
        data-chatbot-trigger
        className="chatbot-button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: currentTheme.colors.gradient,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(123, 63, 63, 0.3)',
          zIndex: 1000,
          fontSize: '1.5rem',
          transition: 'all 0.3s ease',
          border: '2px solid rgba(255,255,255,0.2)'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 25px rgba(123, 63, 63, 0.4)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 20px rgba(123, 63, 63, 0.3)';
        }}
      >
        {isOpen ? '✕' : '💬'}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="chatbot-window chatbot-fade-in"
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '20px',
            width: '350px',
            height: '500px',
            background: currentTheme.colors.card,
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(123, 63, 63, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 999,
            border: `2px solid ${currentTheme.colors.border}`,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            className="chatbot-header"
            style={{
              background: currentTheme.colors.gradient,
              color: '#fff',
              padding: '1rem',
              borderRadius: '18px 18px 0 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <div style={{ fontSize: '1.5rem' }}>🤖</div>
            <div>
              <div className="chatbot-header-title" style={{ fontWeight: '600', fontSize: '1rem' }}>Womenline Assistant</div>
              <div className="chatbot-header-subtitle" style={{ fontSize: '0.8rem', opacity: 0.9 }}>Always here to help</div>
            </div>
          </div>

          {/* Messages Container */}
          <div
            className="chatbot-messages"
            style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem'
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '0.5rem'
                }}
              >
                <div
                  className={`chatbot-message-${message.sender}`}
                  style={{
                    maxWidth: '80%',
                    padding: '0.8rem 1rem',
                    borderRadius: '18px',
                    background: message.sender === 'user' 
                      ? currentTheme.colors.primary 
                      : '#f0f0f0',
                    color: message.sender === 'user' ? '#fff' : currentTheme.colors.text,
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word'
                  }}
                >
                  {message.text}
                  <div
                    style={{
                      fontSize: '0.7rem',
                      opacity: 0.7,
                      marginTop: '0.3rem',
                      textAlign: message.sender === 'user' ? 'right' : 'left'
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '0.8rem 1rem',
                    borderRadius: '18px',
                    background: '#f0f0f0',
                    color: currentTheme.colors.text,
                    fontSize: '0.9rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <div style={{ fontSize: '0.8rem' }}>🤖</div>
                    <div style={{ display: 'flex', gap: '0.2rem' }}>
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: currentTheme.colors.primary,
                          animation: 'typing 1.4s infinite'
                        }}
                      ></div>
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: currentTheme.colors.primary,
                          animation: 'typing 1.4s infinite 0.2s'
                        }}
                      ></div>
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: currentTheme.colors.primary,
                          animation: 'typing 1.4s infinite 0.4s'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: '1rem',
              borderTop: `1px solid ${currentTheme.colors.border}`,
              background: currentTheme.colors.card
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="chatbot-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: '0.8rem 1rem',
                  borderRadius: '25px',
                  border: `2px solid ${currentTheme.colors.border}`,
                  fontSize: '0.9rem',
                  outline: 'none',
                  background: '#fff',
                  color: currentTheme.colors.text
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: inputMessage.trim() && !isTyping 
                    ? currentTheme.colors.primary 
                    : '#ccc',
                  color: '#fff',
                  border: 'none',
                  cursor: inputMessage.trim() && !isTyping ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  transition: 'all 0.2s ease'
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Typing Animation CSS */}
      <style>
        {`
          @keyframes typing {
            0%, 60%, 100% {
              transform: translateY(0);
              opacity: 0.4;
            }
            30% {
              transform: translateY(-10px);
              opacity: 1;
            }
          }
        `}
      </style>
    </>
  );
};

export default ChatbotPlayer;
