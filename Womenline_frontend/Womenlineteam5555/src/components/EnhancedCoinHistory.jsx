import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const EnhancedCoinHistory = () => {
  const { token, credits, updateCredits } = useAuth();
  const [selectedTab, setSelectedTab] = useState('earn');
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [lastEarnedAmount, setLastEarnedAmount] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [dailyGoals, setDailyGoals] = useState([
    {
      id: '1',
      title: 'Health Journal',
      description: 'Complete daily health check-in',
      reward: 50,
      completed: false,
      icon: '📝'
    },
    {
      id: '2',
      title: 'Period Tracking',
      description: 'Log your period cycle',
      reward: 100,
      completed: false,
      icon: '🩸'
    },
    {
      id: '3',
      title: 'Mental Wellness',
      description: 'Track your mood and feelings',
      reward: 75,
      completed: false,
      icon: '🧠'
    }
  ]);
  const [achievements, setAchievements] = useState([
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first health journal entry',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      icon: '🌟'
    },
    {
      id: '2',
      title: 'Consistency Champion',
      description: 'Complete 7 days of tracking',
      unlocked: false,
      progress: 0,
      maxProgress: 7,
      icon: '🔥'
    },
    {
      id: '3',
      title: 'Health Advocate',
      description: 'Earn 1000 MaCoins',
      unlocked: false,
      progress: 0,
      maxProgress: 1000,
      icon: '💎'
    }
  ]);

  const addTransaction = (type, amount, reason, category) => {
    const newTransaction = {
      id: Date.now().toString(),
      type,
      amount: type === 'earn' ? amount : -amount,
      reason,
      category,
      timestamp: new Date(),
      icon: getCategoryIcon(category)
    };

    setTransactions([newTransaction, ...transactions]);

    if (type === 'earn') {
      updateCredits(credits + amount);
      setLastEarnedAmount(amount);
      setShowCoinAnimation(true);
      setTimeout(() => setShowCoinAnimation(false), 2000);
      checkAchievements(amount);
    } else {
      updateCredits(credits - amount);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Health Journal': '📝',
      'Period Tracking': '🩸',
      'Mental Wellness': '🧠',
      'Data Contribution': '📊',
      'Safety Report': '🛡️',
      'Community': '💬',
      'Coaching': '🏆',
      'Shopping': '🛍️',
      'Donation': '🎓',
      'Rewards': '🎁'
    };
    return icons[category] || '💰';
  };

  const completeGoal = (goalId) => {
    setDailyGoals(goals => 
      goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, completed: true }
          : goal
      )
    );

    const goal = dailyGoals.find(g => g.id === goalId);
    if (goal) {
      addTransaction('earn', goal.reward, `Completed: ${goal.title}`, goal.title);
    }
  };

  const checkAchievements = (earnedAmount) => {
    // Check for achievements based on total earned
    const totalEarned = transactions
      .filter(t => t.type === 'earn')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0) + earnedAmount;

    achievements.forEach(achievement => {
      if (!achievement.unlocked) {
        let shouldUnlock = false;
        
        switch (achievement.id) {
          case '1': // First Steps
            shouldUnlock = transactions.filter(t => t.category === 'Health Journal').length >= 1;
            break;
          case '2': // Consistency Champion
            shouldUnlock = transactions.filter(t => t.category === 'Health Journal').length >= 7;
            break;
          case '3': // Health Advocate
            shouldUnlock = totalEarned >= 1000;
            break;
        }

        if (shouldUnlock) {
          setNewAchievement(achievement);
          setShowAchievement(true);
          setTimeout(() => setShowAchievement(false), 3000);
          
          setAchievements(prev => 
            prev.map(a => 
              a.id === achievement.id 
                ? { ...a, unlocked: true }
                : a
            )
          );
        }
      }
    });
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const completedGoalsCount = dailyGoals.filter(goal => goal.completed).length;
  const progressPercentage = (completedGoalsCount / dailyGoals.length) * 100;

  return (
    <div className="card" style={{ maxWidth: 800 }}>
      {/* Coin Animation */}
      {showCoinAnimation && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          pointerEvents: 'none'
        }}>
          <div style={{
            background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
            color: '#7b3f3f',
            padding: '1rem 2rem',
            borderRadius: '50px',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            animation: 'bounce 1s ease-in-out'
          }}>
            🪙 +{lastEarnedAmount} MaCoins!
          </div>
        </div>
      )}

      {/* Achievement Notification */}
      {showAchievement && newAchievement && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          background: 'linear-gradient(45deg, #7b3f3f, #a05252)',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          maxWidth: '300px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🏆</span>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Achievement Unlocked!</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>{newAchievement.title}</p>
            </div>
          </div>
        </div>
      )}

      <h2>🪙 Enhanced MaCoin System</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Track your earnings, complete goals, and unlock achievements
      </p>

      {/* Daily Progress */}
      <div style={{ 
        background: '#fff', 
        padding: '1.5rem', 
        borderRadius: '12px', 
        marginBottom: '2rem',
        border: '1px solid #b97a7a'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ color: '#7b3f3f', margin: 0 }}>🎯 Daily Progress</h3>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#7b3f3f' }}>
              {completedGoalsCount}/{dailyGoals.length}
            </p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Goals Complete</p>
          </div>
        </div>
        
        <div style={{ 
          width: '100%', 
          background: '#f0f0f0', 
          borderRadius: '10px', 
          height: '8px', 
          marginBottom: '1rem' 
        }}>
          <div style={{
            background: 'linear-gradient(45deg, #7b3f3f, #a05252)',
            height: '8px',
            borderRadius: '10px',
            width: `${progressPercentage}%`,
            transition: 'width 0.5s ease'
          }}></div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {dailyGoals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => !goal.completed && completeGoal(goal.id)}
              disabled={goal.completed}
              style={{
                padding: '1rem',
                borderRadius: '8px',
                border: goal.completed ? '2px solid #4CAF50' : '2px solid #b97a7a',
                background: goal.completed ? '#f1f8e9' : '#fff',
                cursor: goal.completed ? 'default' : 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left',
                width: '100%'
              }}
              onMouseOver={(e) => {
                if (!goal.completed) {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 4px 12px rgba(123, 63, 63, 0.2)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{goal.icon}</span>
                <span style={{ 
                  fontWeight: 'bold', 
                  color: goal.completed ? '#4CAF50' : '#7b3f3f' 
                }}>
                  +{goal.reward}
                </span>
              </div>
              <h4 style={{ margin: '0 0 0.3rem 0', color: '#333' }}>{goal.title}</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>{goal.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        background: '#fff', 
        padding: '0.5rem', 
        borderRadius: '8px', 
        marginBottom: '2rem',
        border: '1px solid #b97a7a'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { id: 'earn', label: 'Earn Coins', icon: '➕' },
            { id: 'spend', label: 'Spend Coins', icon: '➖' },
            { id: 'goals', label: 'Achievements', icon: '🏆' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              style={{
                flex: 1,
                padding: '0.8rem',
                borderRadius: '6px',
                border: 'none',
                background: selectedTab === tab.id 
                  ? 'linear-gradient(45deg, #7b3f3f, #a05252)' 
                  : '#f8f8f8',
                color: selectedTab === tab.id ? '#fff' : '#333',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Earn Coins Section */}
      {selectedTab === 'earn' && (
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #b97a7a' }}>
          <h3 style={{ color: '#7b3f3f', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            ✨ Earn MaCoins
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <button
              onClick={() => addTransaction('earn', 50, 'Completed daily health journal', 'Health Journal')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                border: '2px solid #4CAF50',
                borderRadius: '8px',
                background: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '2rem', marginRight: '1rem' }}>📝</span>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 0.3rem 0', color: '#333' }}>Health Journal</h4>
                <p style={{ margin: '0 0 0.2rem 0', color: '#4CAF50', fontWeight: 'bold' }}>+50 MaCoins</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Daily check-in</p>
              </div>
            </button>

            <button
              onClick={() => addTransaction('earn', 100, 'Logged period cycle', 'Period Tracking')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                border: '2px solid #E91E63',
                borderRadius: '8px',
                background: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 4px 12px rgba(233, 30, 99, 0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '2rem', marginRight: '1rem' }}>🩸</span>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 0.3rem 0', color: '#333' }}>Period Tracking</h4>
                <p style={{ margin: '0 0 0.2rem 0', color: '#E91E63', fontWeight: 'bold' }}>+100 MaCoins</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Cycle logging</p>
              </div>
            </button>

            <button
              onClick={() => addTransaction('earn', 75, 'Tracked mental wellness', 'Mental Wellness')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                border: '2px solid #9C27B0',
                borderRadius: '8px',
                background: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 4px 12px rgba(156, 39, 176, 0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '2rem', marginRight: '1rem' }}>🧠</span>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 0.3rem 0', color: '#333' }}>Mental Wellness</h4>
                <p style={{ margin: '0 0 0.2rem 0', color: '#9C27B0', fontWeight: 'bold' }}>+75 MaCoins</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Mood tracking</p>
              </div>
            </button>

            <button
              onClick={() => addTransaction('earn', 150, 'Uploaded health data', 'Data Contribution')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                border: '2px solid #2196F3',
                borderRadius: '8px',
                background: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '2rem', marginRight: '1rem' }}>📊</span>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 0.3rem 0', color: '#333' }}>Data Contribution</h4>
                <p style={{ margin: '0 0 0.2rem 0', color: '#2196F3', fontWeight: 'bold' }}>+150 MaCoins</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Help other women</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Spend Coins Section */}
      {selectedTab === 'spend' && (
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #b97a7a' }}>
          <h3 style={{ color: '#7b3f3f', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            🎁 Spend MaCoins
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <button
              onClick={() => credits >= 300 && addTransaction('spend', 300, 'Advanced coaching tools', 'Coaching')}
              disabled={credits < 300}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                border: '2px solid #FF9800',
                borderRadius: '8px',
                background: '#fff',
                cursor: credits >= 300 ? 'pointer' : 'not-allowed',
                opacity: credits >= 300 ? 1 : 0.5,
                transition: 'all 0.2s',
                width: '100%'
              }}
            >
              <span style={{ fontSize: '2rem', marginRight: '1rem' }}>🏆</span>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 0.3rem 0', color: '#333' }}>Coaching Tools</h4>
                <p style={{ margin: '0 0 0.2rem 0', color: '#FF9800', fontWeight: 'bold' }}>-300 MaCoins</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Advanced features</p>
              </div>
            </button>

            <button
              onClick={() => credits >= 200 && addTransaction('spend', 200, 'Health products discount', 'Shopping')}
              disabled={credits < 200}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                border: '2px solid #E91E63',
                borderRadius: '8px',
                background: '#fff',
                cursor: credits >= 200 ? 'pointer' : 'not-allowed',
                opacity: credits >= 200 ? 1 : 0.5,
                transition: 'all 0.2s',
                width: '100%'
              }}
            >
              <span style={{ fontSize: '2rem', marginRight: '1rem' }}>🛍️</span>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 0.3rem 0', color: '#333' }}>Health Products</h4>
                <p style={{ margin: '0 0 0.2rem 0', color: '#E91E63', fontWeight: 'bold' }}>-200 MaCoins</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Discount coupons</p>
              </div>
            </button>

            <button
              onClick={() => credits >= 500 && addTransaction('spend', 500, 'Education fund donation', 'Donation')}
              disabled={credits < 500}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                border: '2px solid #4CAF50',
                borderRadius: '8px',
                background: '#fff',
                cursor: credits >= 500 ? 'pointer' : 'not-allowed',
                opacity: credits >= 500 ? 1 : 0.5,
                transition: 'all 0.2s',
                width: '100%'
              }}
            >
              <span style={{ fontSize: '2rem', marginRight: '1rem' }}>🎓</span>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 0.3rem 0', color: '#333' }}>Education Fund</h4>
                <p style={{ margin: '0 0 0.2rem 0', color: '#4CAF50', fontWeight: 'bold' }}>-500 MaCoins</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Help rural girls</p>
              </div>
            </button>

            <button
              onClick={() => credits >= 100 && addTransaction('spend', 100, 'Wellness gift package', 'Rewards')}
              disabled={credits < 100}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                border: '2px solid #9C27B0',
                borderRadius: '8px',
                background: '#fff',
                cursor: credits >= 100 ? 'pointer' : 'not-allowed',
                opacity: credits >= 100 ? 1 : 0.5,
                transition: 'all 0.2s',
                width: '100%'
              }}
            >
              <span style={{ fontSize: '2rem', marginRight: '1rem' }}>🎁</span>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 0.3rem 0', color: '#333' }}>Wellness Gifts</h4>
                <p style={{ margin: '0 0 0.2rem 0', color: '#9C27B0', fontWeight: 'bold' }}>-100 MaCoins</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Premium package</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Achievements Section */}
      {selectedTab === 'goals' && (
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #b97a7a' }}>
          <h3 style={{ color: '#7b3f3f', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            🏆 Achievements
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  border: achievement.unlocked ? '2px solid #FFD700' : '2px solid #ddd',
                  background: achievement.unlocked ? 'linear-gradient(45deg, #fff9c4, #fff59d)' : '#f8f8f8',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{achievement.icon}</span>
                  <h4 style={{ margin: 0, color: achievement.unlocked ? '#333' : '#666' }}>
                    {achievement.title}
                  </h4>
                </div>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
                  {achievement.description}
                </p>
                <div style={{ 
                  width: '100%', 
                  background: '#ddd', 
                  borderRadius: '4px', 
                  height: '6px' 
                }}>
                  <div style={{
                    background: achievement.unlocked ? '#FFD700' : '#7b3f3f',
                    height: '6px',
                    borderRadius: '4px',
                    width: `${(achievement.progress / achievement.maxProgress) * 100}%`
                  }}></div>
                </div>
                <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.8rem', color: '#666' }}>
                  {achievement.progress}/{achievement.maxProgress}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ color: '#7b3f3f', marginBottom: '1rem' }}>📊 Recent Transactions</h3>
        {transactions.length > 0 ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {transactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} style={{
                background: '#fff',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #b97a7a',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ fontSize: '1.5rem' }}>{transaction.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.3rem 0', color: '#333' }}>{transaction.reason}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>{transaction.category}</p>
                    </div>
                    <div style={{ 
                      color: transaction.amount > 0 ? '#4CAF50' : '#F44336',
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount} MaCoins
                    </div>
                  </div>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.8rem', color: '#999' }}>
                    {formatTimeAgo(transaction.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            color: '#666',
            background: '#f8f8f8',
            borderRadius: '8px'
          }}>
            <p>No transactions yet.</p>
            <p>Start earning MaCoins to see your history!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCoinHistory; 