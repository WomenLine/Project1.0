import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { 
  getUserCredits, 
  getRedemptionHistory, 
  earnCredits,
  getRewards,
  getLeaderboard
} from "../api";
import "./MaCoinCenter.css";

const MaCoinCenter = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [userCredits, setUserCredits] = useState(0);
  const [redemptionHistory, setRedemptionHistory] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fallback data for demo purposes
  const fallbackRewards = [
    { id: 1, name: "Premium Health Consultation", cost: 100, category: "Health", available: true },
    { id: 2, name: "Mental Wellness Session", cost: 75, category: "Wellness", available: true },
    { id: 3, name: "Nutrition Plan", cost: 50, category: "Health", available: true },
    { id: 4, name: "Fitness Tracker", cost: 200, category: "Wellness", available: false },
    { id: 5, name: "Meditation App Premium", cost: 25, category: "Wellness", available: true },
    { id: 6, name: "Health Report", cost: 30, category: "Health", available: true }
  ];

  const fallbackLeaderboard = [
    { id: 1, name: "Sarah Johnson", avatar: "👩‍⚕️", level: "Gold", score: 1250, position: 1 },
    { id: 2, name: "Maria Garcia", avatar: "👩‍💼", level: "Silver", score: 980, position: 2 },
    { id: 3, name: "Emma Wilson", avatar: "👩‍🎓", level: "Bronze", score: 845, position: 3 },
    { id: 4, name: "Lisa Chen", avatar: "👩‍🔬", level: "Expert", score: 720, position: 4 },
    { id: 5, name: "Anna Davis", avatar: "👩‍🏫", level: "Advanced", score: 650, position: 5 }
  ];

  const fallbackHistory = [
    { id: 1, type: "earned", amount: 15, category: "Journal Entry", date: "2024-12-17", time: "10:30 AM" },
    { id: 2, type: "earned", amount: 10, category: "Health Check", date: "2024-12-16", time: "2:15 PM" },
    { id: 3, type: "earned", amount: 5, category: "Daily Login", date: "2024-12-16", time: "9:00 AM" },
    { id: 4, type: "spent", amount: -50, category: "Reward Redemption", date: "2024-12-15", time: "4:45 PM" },
    { id: 5, type: "earned", amount: 20, category: "Appointment Booking", date: "2024-12-14", time: "11:20 AM" }
  ];

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // If no user, load fallback data
      loadFallbackData();
    }
  }, [user]);

  const loadUserData = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Load user credits
      const credits = await getUserCredits(user.token);
      setUserCredits(credits.credits || 0);

      // Load redemption history
      const history = await getRedemptionHistory(user.token);
      setRedemptionHistory(history.history || []);

      // Load available rewards
      const availableRewards = await getRewards(user.token);
      setRewards(availableRewards.rewards || []);

      // Load leaderboard
      const topUsers = await getLeaderboard(user.token);
      setLeaderboard(topUsers.leaderboard || []);

    } catch (err) {
      console.error("Error loading user data:", err);
      setError("Failed to load user data. Loading demo data instead.");
      // Load fallback data on error
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackData = () => {
    setUserCredits(150); // Demo balance
    setRedemptionHistory(fallbackHistory);
    setRewards(fallbackRewards);
    setLeaderboard(fallbackLeaderboard);
    setError("");
  };

  const handleEarnCredits = async (activity) => {
    try {
      if (user && user.token) {
        const result = await earnCredits({ activity }, user.token);
        if (result.success) {
          setUserCredits(prev => prev + (result.creditsEarned || 0));
          // Reload data to show updated information
          loadUserData();
        }
      } else {
        // Demo mode - simulate earning credits
        const creditAmounts = {
          daily_login: 5,
          health_check: 10,
          journal_entry: 15,
          appointment_booking: 20
        };
        const amount = creditAmounts[activity] || 5;
        setUserCredits(prev => prev + amount);
        
        // Add to history
        const newEntry = {
          id: Date.now(),
          type: "earned",
          amount: amount,
          category: activity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
        setRedemptionHistory(prev => [newEntry, ...prev]);
      }
    } catch (err) {
      console.error("Error earning credits:", err);
      setError("Failed to earn credits. Please try again.");
    }
  };

  const handleRedeemReward = (reward) => {
    if (userCredits >= reward.cost) {
      setUserCredits(prev => prev - reward.cost);
      
      // Add redemption to history
      const newEntry = {
        id: Date.now(),
        type: "spent",
        amount: -reward.cost,
        category: `Redeemed: ${reward.name}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setRedemptionHistory(prev => [newEntry, ...prev]);
      
      alert(`🎉 Successfully redeemed ${reward.name}!`);
    } else {
      alert("❌ Not enough MaCoins to redeem this reward.");
    }
  };

  const renderOverview = () => (
    <div className="macoins-overview">
      <div className="credit-display">
        <div className="credit-circle">
          <span className="credit-amount">{userCredits}</span>
          <span className="credit-label">MaCoins</span>
        </div>
        <div className="credit-info">
          <h3>Your MaCoin Balance</h3>
          <p>Earn coins by completing activities and redeem them for rewards!</p>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button 
            className="action-btn earn-btn"
            onClick={() => handleEarnCredits("daily_login")}
          >
            🗓️ Daily Login (+5 coins)
          </button>
          <button 
            className="action-btn earn-btn"
            onClick={() => handleEarnCredits("health_check")}
          >
            🏥 Health Check (+10 coins)
          </button>
          <button 
            className="action-btn earn-btn"
            onClick={() => handleEarnCredits("journal_entry")}
          >
            📝 Journal Entry (+15 coins)
          </button>
          <button 
            className="action-btn earn-btn"
            onClick={() => handleEarnCredits("appointment_booking")}
          >
            📅 Book Appointment (+20 coins)
          </button>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {redemptionHistory.slice(0, 5).map((activity) => (
            <div key={activity.id} className={`activity-item ${activity.type}`}>
              <div className="activity-icon">
                {activity.type === 'earned' ? '🟢' : '🔴'}
              </div>
              <div className="activity-details">
                <span className="activity-category">{activity.category}</span>
                <span className="activity-time">{activity.date} at {activity.time}</span>
              </div>
              <span className={`activity-amount ${activity.type}`}>
                {activity.type === 'earned' ? '+' : ''}{activity.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="macoins-history">
      <div className="history-header">
        <h3>Transaction History</h3>
        <div className="history-filters">
          <button 
            className={`filter-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${activeTab === 'earned' ? 'active' : ''}`}
            onClick={() => setActiveTab('earned')}
          >
            Earned
          </button>
          <button 
            className={`filter-btn ${activeTab === 'spent' ? 'active' : ''}`}
            onClick={() => setActiveTab('spent')}
          >
            Spent
          </button>
        </div>
      </div>

      <div className="history-list">
        {redemptionHistory.map((transaction) => (
          <div key={transaction.id} className={`history-item ${transaction.type}`}>
            <div className="transaction-icon">
              {transaction.type === 'earned' ? '🟢' : '🔴'}
            </div>
            <div className="transaction-details">
              <span className="transaction-category">{transaction.category}</span>
              <span className="transaction-date">{transaction.date} at {transaction.time}</span>
            </div>
            <span className={`transaction-amount ${transaction.type}`}>
              {transaction.type === 'earned' ? '+' : ''}{transaction.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRewards = () => (
    <div className="macoins-rewards">
      <h3>Available Rewards</h3>
      <div className="rewards-grid">
        {rewards.map((reward) => (
          <div key={reward.id} className={`reward-card ${reward.available ? 'available' : 'unavailable'}`}>
            <div className="reward-header">
              <h4>{reward.name}</h4>
              <span className="reward-category">{reward.category}</span>
            </div>
            <div className="reward-cost">
              <span className="cost-amount">{reward.cost}</span>
              <span className="cost-label">MaCoins</span>
            </div>
            {reward.available && userCredits >= reward.cost ? (
              <button 
                className="redeem-btn"
                onClick={() => handleRedeemReward(reward)}
              >
                Redeem Now
              </button>
            ) : (
              <button className="redeem-btn disabled" disabled>
                {userCredits >= reward.cost ? 'Not Available' : 'Not Enough Coins'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="macoins-leaderboard">
      <h3>Top Performers</h3>
      <div className="leaderboard-list">
        {leaderboard.map((user, index) => (
          <div key={user.id} className={`leaderboard-item ${index < 3 ? `top-${index + 1}` : ''}`}>
            <div className="position-badge">
              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
            </div>
            <div className="user-avatar">{user.avatar}</div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-level">{user.level}</span>
            </div>
            <div className="user-score">{user.score} coins</div>
          </div>
        ))}
      </div>
      
      <div className="your-position">
        <h4>Your Position</h4>
        <div className="position-display">
          <span className="position-number">#8</span>
          <span className="position-text">with {userCredits} coins</span>
        </div>
      </div>
    </div>
  );

  const renderExchange = () => (
    <div className="macoins-exchange">
      <h3>Coin Exchange</h3>
      <div className="exchange-options">
        <div className="exchange-card">
          <h4>Premium Features</h4>
          <p>Exchange MaCoins for premium features and benefits</p>
          <div className="exchange-rate">
            <span>100 coins = 1 Premium Day</span>
          </div>
          <button className="exchange-btn">Exchange Now</button>
        </div>
        
        <div className="exchange-card">
          <h4>Special Offers</h4>
          <p>Limited-time bonuses and special promotions</p>
          <div className="exchange-rate">
            <span>50 coins = 1 Consultation</span>
          </div>
          <button className="exchange-btn">View Offers</button>
        </div>
        
        <div className="exchange-card">
          <h4>Health Products</h4>
          <p>Redeem coins for health and wellness products</p>
          <div className="exchange-rate">
            <span>200 coins = 1 Product</span>
          </div>
          <button className="exchange-btn">Browse Products</button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="macoins-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your MaCoin Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="macoins-container">
      <div className="macoins-header">
        <h1>🏆 MaCoin Center</h1>
        <p>Your one-stop hub for all coin-related activities</p>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="macoins-navigation">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📈 History
        </button>
        <button 
          className={`nav-tab ${activeTab === 'rewards' ? 'active' : ''}`}
          onClick={() => setActiveTab('rewards')}
        >
          🎁 Rewards
        </button>
        <button 
          className={`nav-tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          🏅 Leaderboard
        </button>
        <button 
          className={`nav-tab ${activeTab === 'exchange' ? 'active' : ''}`}
          onClick={() => setActiveTab('exchange')}
        >
          🔄 Exchange
        </button>
      </div>

      <div className="macoins-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'rewards' && renderRewards()}
        {activeTab === 'leaderboard' && renderLeaderboard()}
        {activeTab === 'exchange' && renderExchange()}
      </div>
    </div>
  );
};

export default MaCoinCenter;
