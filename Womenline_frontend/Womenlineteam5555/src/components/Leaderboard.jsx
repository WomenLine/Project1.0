import React, { useState } from 'react';
import './Leaderboard.css';

// Mock data for the leaderboard
const mockUsers = [
  {
    id: '1',
    name: 'Priya S.',
    initials: 'PS',
    state: 'Maharashtra',
    totalCoins: 2450,
    weeklyCoins: 180,
    monthlyCoins: 890,
    avatar: 'bg-gradient-to-br from-pink-400 to-purple-500',
    level: 'Wellness Champion',
    badges: ['Health Guardian', 'Community Helper', 'Safety Advocate'],
    activities: { healthJournal: 28, safetyReports: 3, communityHelp: 15, voiceQA: 12 }
  },
  {
    id: '2',
    name: 'Anjali M.',
    initials: 'AM',
    state: 'Karnataka',
    totalCoins: 2380,
    weeklyCoins: 165,
    monthlyCoins: 820,
    avatar: 'bg-gradient-to-br from-blue-400 to-indigo-500',
    level: 'Wellness Hero',
    badges: ['Daily Warrior', 'Voice Leader'],
    activities: { healthJournal: 30, safetyReports: 2, communityHelp: 18, voiceQA: 8 }
  },
  {
    id: '3',
    name: 'Sneha R.',
    initials: 'SR',
    state: 'Tamil Nadu',
    totalCoins: 2150,
    weeklyCoins: 142,
    monthlyCoins: 750,
    avatar: 'bg-gradient-to-br from-green-400 to-emerald-500',
    level: 'Health Advocate',
    badges: ['Journal Master', 'Support Star'],
    activities: { healthJournal: 25, safetyReports: 1, communityHelp: 22, voiceQA: 10 }
  },
  {
    id: '4',
    name: 'Meera K.',
    initials: 'MK',
    state: 'Kerala',
    totalCoins: 1980,
    weeklyCoins: 128,
    monthlyCoins: 680,
    avatar: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    level: 'Wellness Guide',
    badges: ['Safety Hero', 'Community Builder'],
    activities: { healthJournal: 22, safetyReports: 4, communityHelp: 12, voiceQA: 14 }
  },
  {
    id: '5',
    name: 'Kavya N.',
    initials: 'KN',
    state: 'Andhra Pradesh',
    totalCoins: 1850,
    weeklyCoins: 115,
    monthlyCoins: 620,
    avatar: 'bg-gradient-to-br from-red-400 to-pink-500',
    level: 'Health Supporter',
    badges: ['Voice Champion'],
    activities: { healthJournal: 20, safetyReports: 2, communityHelp: 8, voiceQA: 18 }
  }
];

const Badge = ({ name }) => {
  const getBadgeColor = (name) => {
    const colors = {
      'Health Guardian': 'bg-green-100 text-green-800',
      'Community Helper': 'bg-blue-100 text-blue-800',
      'Safety Advocate': 'bg-red-100 text-red-800',
      'Daily Warrior': 'bg-purple-100 text-purple-800',
      'Voice Leader': 'bg-indigo-100 text-indigo-800',
      'Journal Master': 'bg-pink-100 text-pink-800',
      'Support Star': 'bg-yellow-100 text-yellow-800',
      'Safety Hero': 'bg-orange-100 text-orange-800',
      'Community Builder': 'bg-teal-100 text-teal-800',
      'Voice Champion': 'bg-rose-100 text-rose-800'
    };
    return colors[name] || 'bg-gray-100 text-gray-800';
  };

  return (
    <span className={`badge ${getBadgeColor(name)}`}>
      {name}
    </span>
  );
};

const RankIcon = ({ rank }) => {
  if (rank === 1) return <span className="rank-icon gold">🥇</span>;
  if (rank === 2) return <span className="rank-icon silver">🥈</span>;
  if (rank === 3) return <span className="rank-icon bronze">🥉</span>;
  return <span className="rank-number">{rank}</span>;
};

const UserCard = ({ user, rank, period, isCurrentUser = false }) => {
  const getCoinsForPeriod = () => {
    switch (period) {
      case 'weekly': return user.weeklyCoins;
      case 'monthly': return user.monthlyCoins;
      default: return user.totalCoins;
    }
  };

  return (
    <div className={`user-card ${isCurrentUser ? 'current-user' : ''}`}>
      <div className="user-rank">
        <RankIcon rank={rank} />
      </div>
      
      <div className="user-avatar">
        <div className={`avatar ${user.avatar}`}>
          {user.initials}
        </div>
      </div>
      
      <div className="user-info">
        <h3 className="user-name">{user.name}</h3>
        <p className="user-level">{user.level}</p>
        <p className="user-state">{user.state}</p>
        
        <div className="user-badges">
          {user.badges.slice(0, 2).map((badge, index) => (
            <Badge key={index} name={badge} />
          ))}
        </div>
      </div>
      
      <div className="user-stats">
        <div className="coins-display">
          <span className="coins-number">{getCoinsForPeriod().toLocaleString()}</span>
          <span className="coins-label">coins</span>
        </div>
        
        <div className="activities">
          <div className="activity-item">
            <span className="activity-icon">📝</span>
            <span className="activity-count">{user.activities.healthJournal}</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🛡️</span>
            <span className="activity-count">{user.activities.safetyReports}</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🤝</span>
            <span className="activity-count">{user.activities.communityHelp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Leaderboard = () => {
  const [period, setPeriod] = useState('weekly');

  const getPeriodTitle = () => {
    switch (period) {
      case 'weekly': return 'Weekly Leaderboard';
      case 'monthly': return 'Monthly Leaderboard';
      case 'allTime': return 'All-Time Leaderboard';
      default: return 'Leaderboard';
    }
  };

  const sortedUsers = [...mockUsers].sort((a, b) => {
    const aCoins = period === 'weekly' ? a.weeklyCoins : period === 'monthly' ? a.monthlyCoins : a.totalCoins;
    const bCoins = period === 'weekly' ? b.weeklyCoins : period === 'monthly' ? b.monthlyCoins : b.totalCoins;
    return bCoins - aCoins;
  });

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1 className="leaderboard-title">{getPeriodTitle()}</h1>
        <p className="leaderboard-subtitle">Celebrating women's wellness achievements</p>
      </div>

      <div className="period-tabs">
        <button 
          className={`period-tab ${period === 'weekly' ? 'active' : ''}`}
          onClick={() => setPeriod('weekly')}
        >
          Weekly
        </button>
        <button 
          className={`period-tab ${period === 'monthly' ? 'active' : ''}`}
          onClick={() => setPeriod('monthly')}
        >
          Monthly
        </button>
        <button 
          className={`period-tab ${period === 'allTime' ? 'active' : ''}`}
          onClick={() => setPeriod('allTime')}
        >
          All Time
        </button>
      </div>

      <div className="leaderboard-list">
        {sortedUsers.map((user, index) => (
          <UserCard 
            key={user.id} 
            user={user} 
            rank={index + 1} 
            period={period}
            isCurrentUser={user.id === '1'} // Assuming user 1 is current user
          />
        ))}
      </div>

      <div className="leaderboard-footer">
        <p>Keep earning coins by staying active and helping others!</p>
      </div>
    </div>
  );
};

export default Leaderboard; 