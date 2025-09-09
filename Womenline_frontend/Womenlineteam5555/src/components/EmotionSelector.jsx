import React, { useState } from 'react';
import { useEmotion } from '../contexts/EmotionContext';

const EmotionSelector = ({ onEmotionChange, showPreview = true }) => {
  const { currentEmotion, currentTheme, updateEmotion, emotionThemes, getEmotionMessage, hasCustomEmotion } = useEmotion();
  const [selectedEmotion, setSelectedEmotion] = useState(currentEmotion);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
    updateEmotion(emotion);
    if (onEmotionChange) {
      onEmotionChange(emotion);
    }
  };

  const emotions = [
    { key: 'default', label: 'Default', emoji: '🌸' },
    { key: 'happy', label: 'Happy', emoji: '😊' },
    { key: 'excited', label: 'Excited', emoji: '🤩' },
    { key: 'calm', label: 'Calm', emoji: '😌' },
    { key: 'tired', label: 'Tired', emoji: '😴' },
    { key: 'anxious', label: 'Anxious', emoji: '😰' },
    { key: 'stressed', label: 'Stressed', emoji: '😤' },
    { key: 'sad', label: 'Sad', emoji: '😢' },
    { key: 'angry', label: 'Angry', emoji: '😠' }
  ];

  const getCurrentEmotionDisplay = () => {
    if (!hasCustomEmotion()) {
      return { emoji: '🌸', name: 'Default', description: 'Original app colors' };
    }
    const emotion = emotions.find(e => e.key === currentEmotion);
    return {
      emoji: emotion?.emoji || '🌸',
      name: emotion?.label || 'Custom',
      description: 'Personalized theme'
    };
  };

  const currentDisplay = getCurrentEmotionDisplay();

  return (
    <div style={{
      background: currentTheme.colors.card,
      border: `2px solid ${currentTheme.colors.border}`,
      borderRadius: '12px',
      padding: '1.5rem',
      margin: '1rem 0',
      boxShadow: currentTheme.colors.shadow,
      transition: 'all 0.3s ease'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <h3 style={{ 
          color: currentTheme.colors.text, 
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {currentDisplay.emoji} Personalize Your Experience
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            color: currentTheme.colors.text
          }}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {!isExpanded && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: currentTheme.colors.text,
          fontSize: '0.9rem',
          padding: '0.5rem',
          background: currentTheme.colors.background,
          borderRadius: '6px'
        }}>
          <span>Current theme: {currentDisplay.emoji} {currentDisplay.name}</span>
          {hasCustomEmotion() && (
            <span style={{ 
              fontSize: '0.8rem', 
              color: currentTheme.colors.primary,
              fontWeight: '600'
            }}>
              (Personalized)
            </span>
          )}
        </div>
      )}

      {isExpanded && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ 
            color: currentTheme.colors.text, 
            marginBottom: '1rem',
            fontStyle: 'italic'
          }}>
            Choose your mood to personalize the app's colors and messages. Select "Default" to return to the original design.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '0.5rem'
          }}>
            {emotions.map((emotion) => (
              <button
                key={emotion.key}
                onClick={() => handleEmotionSelect(emotion.key)}
                style={{
                  background: selectedEmotion === emotion.key 
                    ? currentTheme.colors.gradient 
                    : 'transparent',
                  color: selectedEmotion === emotion.key 
                    ? '#fff' 
                    : currentTheme.colors.text,
                  border: `2px solid ${currentTheme.colors.border}`,
                  borderRadius: '8px',
                  padding: '0.8rem',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  fontWeight: selectedEmotion === emotion.key ? '600' : '400',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
                onMouseOver={(e) => {
                  if (selectedEmotion !== emotion.key) {
                    e.target.style.background = currentTheme.colors.background;
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedEmotion !== emotion.key) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{emotion.emoji}</span>
                <span style={{ fontSize: '0.8rem' }}>{emotion.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {showPreview && hasCustomEmotion() && (
        <div style={{
          background: currentTheme.colors.background,
          border: `1px solid ${currentTheme.colors.border}`,
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '1rem'
        }}>
          <h4 style={{ 
            color: currentTheme.colors.text, 
            margin: '0 0 0.5rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {currentTheme.emoji} {currentTheme.name} Mode
          </h4>
          <p style={{ 
            color: currentTheme.colors.text, 
            margin: '0 0 0.5rem 0',
            fontSize: '0.9rem'
          }}>
            {getEmotionMessage('motivation')}
          </p>
          <p style={{ 
            color: currentTheme.colors.text, 
            margin: 0,
            fontSize: '0.8rem',
            fontStyle: 'italic'
          }}>
            💡 {getEmotionMessage('tip')}
          </p>
        </div>
      )}

      {showPreview && !hasCustomEmotion() && (
        <div style={{
          background: currentTheme.colors.background,
          border: `1px solid ${currentTheme.colors.border}`,
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '1rem'
        }}>
          <h4 style={{ 
            color: currentTheme.colors.text, 
            margin: '0 0 0.5rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🌸 Default Theme
          </h4>
          <p style={{ 
            color: currentTheme.colors.text, 
            margin: 0,
            fontSize: '0.9rem',
            fontStyle: 'italic'
          }}>
            Using the original Womenline design. Choose a mood above to personalize your experience!
          </p>
        </div>
      )}
    </div>
  );
};

export default EmotionSelector; 