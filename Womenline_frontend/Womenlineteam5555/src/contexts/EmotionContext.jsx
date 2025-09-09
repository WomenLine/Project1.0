import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const EmotionContext = createContext();

export const useEmotion = () => {
  const context = useContext(EmotionContext);
  if (!context) {
    throw new Error('useEmotion must be used within an EmotionProvider');
  }
  return context;
};

// Default theme (original app colors)
const defaultTheme = {
  name: 'Default',
  emoji: '🌸',
  colors: {
    primary: '#7b3f3f',
    secondary: '#a05252',
    accent: '#b97a7a',
    background: '#f8f8f8',
    text: '#333333',
    card: '#FFFFFF',
    border: '#b97a7a',
    gradient: 'linear-gradient(135deg, #7b3f3f, #a05252)',
    shadow: '0 4px 15px rgba(123, 63, 63, 0.3)'
  },
  messages: {
    greeting: "Welcome to Womenline! How are you feeling today?",
    motivation: "Take a moment to check in with yourself.",
    tip: "Track your mood regularly to understand your patterns."
  },
  animations: {
    pulse: 'pulse-neutral',
    glow: 'glow-neutral'
  }
};

// Emotion themes with colors, styles, and content
const emotionThemes = {
  happy: {
    name: 'Happy',
    emoji: '😊',
    colors: {
      primary: '#FFD700', // Golden yellow
      secondary: '#FFA500', // Orange
      accent: '#FF6B35', // Coral
      background: '#FFF8DC', // Cornsilk
      text: '#8B4513', // Saddle brown
      card: '#FFFFFF',
      border: '#FFD700',
      gradient: 'linear-gradient(135deg, #FFD700, #FFA500)',
      shadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
    },
    messages: {
      greeting: "You're radiating positivity today! 🌟",
      motivation: "Keep that beautiful smile shining! ✨",
      tip: "Share your joy with others - it's contagious!"
    },
    animations: {
      pulse: 'pulse-happy',
      glow: 'glow-happy'
    }
  },
  sad: {
    name: 'Sad',
    emoji: '😢',
    colors: {
      primary: '#87CEEB', // Sky blue
      secondary: '#4682B4', // Steel blue
      accent: '#B0E0E6', // Powder blue
      background: '#F0F8FF', // Alice blue
      text: '#2F4F4F', // Dark slate gray
      card: '#FFFFFF',
      border: '#87CEEB',
      gradient: 'linear-gradient(135deg, #87CEEB, #4682B4)',
      shadow: '0 4px 15px rgba(135, 206, 235, 0.3)'
    },
    messages: {
      greeting: "It's okay to feel this way. You're not alone. 🤗",
      motivation: "Remember, every storm passes. You're stronger than you know. 💙",
      tip: "Try journaling your feelings - it helps process emotions."
    },
    animations: {
      pulse: 'pulse-sad',
      glow: 'glow-sad'
    }
  },
  anxious: {
    name: 'Anxious',
    emoji: '😰',
    colors: {
      primary: '#98FB98', // Pale green
      secondary: '#90EE90', // Light green
      accent: '#32CD32', // Lime green
      background: '#F0FFF0', // Honeydew
      text: '#228B22', // Forest green
      card: '#FFFFFF',
      border: '#98FB98',
      gradient: 'linear-gradient(135deg, #98FB98, #90EE90)',
      shadow: '0 4px 15px rgba(152, 251, 152, 0.3)'
    },
    messages: {
      greeting: "Take a deep breath. You're safe here. 🌿",
      motivation: "Focus on what you can control. One step at a time. 🧘‍♀️",
      tip: "Try the 4-7-8 breathing technique: 4 counts in, 7 hold, 8 out."
    },
    animations: {
      pulse: 'pulse-anxious',
      glow: 'glow-anxious'
    }
  },
  angry: {
    name: 'Angry',
    emoji: '😠',
    colors: {
      primary: '#FF6B6B', // Light coral
      secondary: '#FF4757', // Red
      accent: '#FF3838', // Bright red
      background: '#FFF5F5', // Light red
      text: '#8B0000', // Dark red
      card: '#FFFFFF',
      border: '#FF6B6B',
      gradient: 'linear-gradient(135deg, #FF6B6B, #FF4757)',
      shadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
    },
    messages: {
      greeting: "Your feelings are valid. Let's work through this together. 🔥",
      motivation: "Channel that energy into something positive. You've got this! 💪",
      tip: "Try counting to 10 or taking a short walk to cool down."
    },
    animations: {
      pulse: 'pulse-angry',
      glow: 'glow-angry'
    }
  },
  calm: {
    name: 'Calm',
    emoji: '😌',
    colors: {
      primary: '#E6E6FA', // Lavender
      secondary: '#D8BFD8', // Thistle
      accent: '#9370DB', // Medium purple
      background: '#F8F8FF', // Ghost white
      text: '#4B0082', // Indigo
      card: '#FFFFFF',
      border: '#E6E6FA',
      gradient: 'linear-gradient(135deg, #E6E6FA, #D8BFD8)',
      shadow: '0 4px 15px rgba(230, 230, 250, 0.3)'
    },
    messages: {
      greeting: "You're in a peaceful state. Enjoy this moment. 🕊️",
      motivation: "Your inner peace is beautiful. Keep it flowing. 🌸",
      tip: "Practice mindfulness to maintain this calm energy."
    },
    animations: {
      pulse: 'pulse-calm',
      glow: 'glow-calm'
    }
  },
  excited: {
    name: 'Excited',
    emoji: '🤩',
    colors: {
      primary: '#FF69B4', // Hot pink
      secondary: '#FF1493', // Deep pink
      accent: '#FF007F', // Rose
      background: '#FFF0F5', // Lavender blush
      text: '#8B008B', // Dark magenta
      card: '#FFFFFF',
      border: '#FF69B4',
      gradient: 'linear-gradient(135deg, #FF69B4, #FF1493)',
      shadow: '0 4px 15px rgba(255, 105, 180, 0.3)'
    },
    messages: {
      greeting: "Your enthusiasm is infectious! Let's celebrate! 🎉",
      motivation: "Channel this energy into achieving your goals! ⚡",
      tip: "Share your excitement with others - it multiplies joy!"
    },
    animations: {
      pulse: 'pulse-excited',
      glow: 'glow-excited'
    }
  },
  tired: {
    name: 'Tired',
    emoji: '😴',
    colors: {
      primary: '#B0C4DE', // Light steel blue
      secondary: '#778899', // Light slate gray
      accent: '#696969', // Dim gray
      background: '#F5F5F5', // White smoke
      text: '#2F4F4F', // Dark slate gray
      card: '#FFFFFF',
      border: '#B0C4DE',
      gradient: 'linear-gradient(135deg, #B0C4DE, #778899)',
      shadow: '0 4px 15px rgba(176, 196, 222, 0.3)'
    },
    messages: {
      greeting: "Rest is not a sign of weakness. Take care of yourself. 💤",
      motivation: "Listen to your body. It's okay to slow down. 🌙",
      tip: "Try a short meditation or gentle stretching."
    },
    animations: {
      pulse: 'pulse-tired',
      glow: 'glow-tired'
    }
  },
  stressed: {
    name: 'Stressed',
    emoji: '😤',
    colors: {
      primary: '#F0E68C', // Khaki
      secondary: '#DAA520', // Goldenrod
      accent: '#B8860B', // Dark goldenrod
      background: '#FFFACD', // Lemon chiffon
      text: '#8B6914', // Dark goldenrod
      card: '#FFFFFF',
      border: '#F0E68C',
      gradient: 'linear-gradient(135deg, #F0E68C, #DAA520)',
      shadow: '0 4px 15px rgba(240, 230, 140, 0.3)'
    },
    messages: {
      greeting: "You're handling a lot. Let's find some balance. ⚖️",
      motivation: "One task at a time. You're doing great. 🌟",
      tip: "Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste."
    },
    animations: {
      pulse: 'pulse-stressed',
      glow: 'glow-stressed'
    }
  }
};

export const EmotionProvider = ({ children }) => {
  const { token } = useAuth();
  const [currentEmotion, setCurrentEmotion] = useState(null); // null means default theme
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [lastMoodCheck, setLastMoodCheck] = useState(null);

  // Get current theme based on emotion (default if no emotion set)
  const getCurrentTheme = () => {
    if (!currentEmotion) return defaultTheme;
    return emotionThemes[currentEmotion] || defaultTheme;
  };

  // Update emotion and apply theme
  const updateEmotion = (emotion) => {
    if (emotion === 'neutral' || emotion === 'default') {
      // Reset to default theme
      setCurrentEmotion(null);
      applyThemeToDocument(defaultTheme);
      localStorage.removeItem('womenline-emotion');
      localStorage.removeItem('womenline-emotion-timestamp');
    } else if (emotionThemes[emotion]) {
      setCurrentEmotion(emotion);
      setEmotionHistory(prev => [...prev, { emotion, timestamp: new Date() }]);
      
      // Apply theme to document
      applyThemeToDocument(emotionThemes[emotion]);
      
      // Store in localStorage
      localStorage.setItem('womenline-emotion', emotion);
      localStorage.setItem('womenline-emotion-timestamp', new Date().toISOString());
    }
  };

  // Apply theme to document
  const applyThemeToDocument = (theme) => {
    const root = document.documentElement;
    
    // Set CSS custom properties
    root.style.setProperty('--emotion-primary', theme.colors.primary);
    root.style.setProperty('--emotion-secondary', theme.colors.secondary);
    root.style.setProperty('--emotion-accent', theme.colors.accent);
    root.style.setProperty('--emotion-background', theme.colors.background);
    root.style.setProperty('--emotion-text', theme.colors.text);
    root.style.setProperty('--emotion-card', theme.colors.card);
    root.style.setProperty('--emotion-border', theme.colors.border);
    root.style.setProperty('--emotion-gradient', theme.colors.gradient);
    root.style.setProperty('--emotion-shadow', theme.colors.shadow);
    
    // Add emotion class to body (or remove if default)
    if (currentEmotion) {
      document.body.className = `emotion-${currentEmotion}`;
    } else {
      document.body.className = 'emotion-default';
    }
  };

  // Initialize emotion from localStorage or default
  useEffect(() => {
    const savedEmotion = localStorage.getItem('womenline-emotion');
    const savedTimestamp = localStorage.getItem('womenline-emotion-timestamp');
    
    if (savedEmotion && savedTimestamp) {
      const lastUpdate = new Date(savedTimestamp);
      const hoursSinceUpdate = (new Date() - lastUpdate) / (1000 * 60 * 60);
      
      // If emotion was set more than 24 hours ago, reset to default
      if (hoursSinceUpdate < 24) {
        setCurrentEmotion(savedEmotion);
        applyThemeToDocument(emotionThemes[savedEmotion]);
      } else {
        // Reset to default after 24 hours
        setCurrentEmotion(null);
        applyThemeToDocument(defaultTheme);
        localStorage.removeItem('womenline-emotion');
        localStorage.removeItem('womenline-emotion-timestamp');
      }
    } else {
      // Start with default theme
      setCurrentEmotion(null);
      applyThemeToDocument(defaultTheme);
    }
  }, []);

  // Auto-detect emotion from recent journal entries (but don't auto-apply)
  const detectEmotionFromJournals = (journals) => {
    if (!journals || journals.length === 0) return null;
    
    const recentJournals = journals.slice(-3); // Last 3 entries
    const moodCounts = {};
    
    recentJournals.forEach(journal => {
      const mood = journal.mood || 'neutral';
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });
    
    // Find most common mood
    const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );
    
    return mostCommonMood;
  };

  // Get emotion-based message
  const getEmotionMessage = (type) => {
    const theme = getCurrentTheme();
    return theme.messages[type] || theme.messages.greeting;
  };

  // Get emotion-based animation class
  const getEmotionAnimation = (type) => {
    const theme = getCurrentTheme();
    return theme.animations[type] || '';
  };

  // Check if user has set a custom emotion
  const hasCustomEmotion = () => {
    return currentEmotion !== null;
  };

  const value = {
    currentEmotion,
    currentTheme: getCurrentTheme(),
    emotionHistory,
    updateEmotion,
    detectEmotionFromJournals,
    getEmotionMessage,
    getEmotionAnimation,
    emotionThemes,
    defaultTheme,
    hasCustomEmotion
  };

  return (
    <EmotionContext.Provider value={value}>
      {children}
    </EmotionContext.Provider>
  );
}; 