import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CoinHistory = () => {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data for now - this will be replaced with real API calls
  const mockHistory = [
    {
      id: 1,
      type: 'earned',
      amount: 10,
      activity: 'Period Log Entry',
      description: 'Logged your period cycle',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      icon: '🩸'
    },
    {
      id: 2,
      type: 'earned',
      amount: 5,
      activity: 'Mental Wellness Check',
      description: 'Completed daily mood tracking',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      icon: '🧠'
    },
    {
      id: 3,
      type: 'spent',
      amount: -15,
      activity: 'Reward Redemption',
      description: 'Redeemed "Free Health Checkup"',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      icon: '🎁'
    },
    {
      id: 4,
      type: 'earned',
      amount: 8,
      activity: 'Health Data Update',
      description: 'Updated personal health information',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      icon: '📊'
    },
    {
      id: 5,
      type: 'earned',
      amount: 12,
      activity: 'Weekly Streak Bonus',
      description: 'Completed 7 days of tracking',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      icon: '🔥'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setHistory(mockHistory);
      setLoading(false);
    }, 1000);
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
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

  const getActivityColor = (type) => {
    switch (type) {
      case 'earned':
        return '#4CAF50';
      case 'spent':
        return '#F44336';
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ maxWidth: 600, textAlign: 'center' }}>
        <h2>Coin History</h2>
        <p>Loading your earning history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ maxWidth: 600, textAlign: 'center' }}>
        <h2>Coin History</h2>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: 600 }}>
      <h2>🪙 MaCoin History</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Track your earning and spending history
      </p>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '1rem',
          background: '#f8f8f8',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <div>
            <h3 style={{ margin: 0, color: '#7b3f3f' }}>Summary</h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
              Total earned: <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>+35 MaCoins</span>
            </p>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
              Total spent: <span style={{ color: '#F44336', fontWeight: 'bold' }}>-15 MaCoins</span>
            </p>
          </div>
          <div style={{ 
            background: '#ffe066', 
            color: '#7b3f3f', 
            padding: '1rem',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}>
            Net: +20 MaCoins
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ color: '#7b3f3f', marginBottom: '1rem' }}>Recent Activity</h3>
        {history.length > 0 ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {history.map((item) => (
              <div key={item.id} style={{
                background: '#fff',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #b97a7a',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  fontSize: '2rem',
                  width: '50px',
                  textAlign: 'center'
                }}>
                  {item.icon}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.3rem 0', color: '#7b3f3f' }}>
                        {item.activity}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                        {item.description}
                      </p>
                    </div>
                    <div style={{ 
                      color: getActivityColor(item.type),
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}>
                      {item.type === 'earned' ? '+' : ''}{item.amount} MaCoins
                    </div>
                  </div>
                  
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#999',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>{formatTimeAgo(item.timestamp)}</span>
                    <div style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      background: item.type === 'earned' ? '#e8f5e8' : '#ffeaea',
                      color: getActivityColor(item.type)
                    }}>
                      {item.type === 'earned' ? 'EARNED' : 'SPENT'}
                    </div>
                  </div>
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
            <p>No activity yet.</p>
            <p>Start using the app to see your earning history!</p>
          </div>
        )}
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: '#f0f8ff', 
        borderRadius: '8px',
        border: '1px solid #b3d9ff'
      }}>
        <h4 style={{ color: '#0066cc', marginBottom: '0.5rem' }}>💡 How to Earn More MaCoins</h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#333' }}>
          <li>Log your period regularly (+10 MaCoins per entry)</li>
          <li>Track your mood daily (+5 MaCoins per entry)</li>
          <li>Update health information (+8 MaCoins)</li>
          <li>Complete weekly streaks (+12 MaCoins bonus)</li>
          <li>Refer friends (+15 MaCoins per referral)</li>
        </ul>
      </div>
    </div>
  );
};

export default CoinHistory; 