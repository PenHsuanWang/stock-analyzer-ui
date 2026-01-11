import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

// Mock Data
const METRICS = [
  { label: 'System Status', value: 'Online', trend: '●', trendType: 'positive' },
  { label: 'Active Jobs', value: '2', trend: 'Running', trendType: 'neutral' },
  { label: 'Total Datasets', value: '14', trend: '+3 this week', trendType: 'positive' },
  { label: 'Last Update', value: '10m ago', trend: 'Auto-fetch', trendType: 'neutral' },
];

const RECENT_ACTIVITY = [
  { action: 'Fetch Data', target: 'AAPL', status: 'Success', time: '2m ago' },
  { action: 'Model Train', target: 'LSTM_v2', status: 'Running', time: '15m ago' },
  { action: 'Fetch Data', target: 'TSLA', status: 'Failed', time: '1h ago' },
  { action: 'Data Export', target: 'All_Holdings', status: 'Success', time: '2h ago' },
  { action: 'System', target: 'Backup', status: 'Success', time: '1d ago' },
];

const MetricCard = ({ label, value, trend, trendType }) => (
  <div className="metric-card">
    <div className="metric-card__label">{label}</div>
    <div className="metric-card__value">{value}</div>
    <div className={`metric-card__trend metric-card__trend--${trendType}`}>
      {trend}
    </div>
  </div>
);

const ActionCard = ({ icon, title, desc, to }) => (
  <Link to={to} className="action-card">
    <div className="action-card__icon">{icon}</div>
    <div className="action-card__title">{title}</div>
    <div className="action-card__desc">{desc}</div>
  </Link>
);

const HomePage = () => {
  return (
    <div className="home-dashboard">
      {/* Row 1: Metrics */}
      <section className="metric-ticker">
        {METRICS.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </section>

      {/* Row 2: Quick Actions */}
      <section className="quick-actions">
        <ActionCard 
          to="/data-collect" 
          icon="⚡" 
          title="New Manual Fetch" 
          desc="Retrieve fresh stock data from yFinance"
        />
        <ActionCard 
          to="/stock-analysis-dashboard" 
          icon="📈" 
          title="View Analysis" 
          desc="Visualize trends and candlestick patterns"
        />
        <ActionCard 
          to="/job-scheduler" 
          icon="⏱️" 
          title="Check Jobs" 
          desc="Monitor background fetch tasks"
        />
      </section>

      {/* Row 3: Recent Activity */}
      <section className="recent-activity">
        <div className="recent-activity__header">
          <h2 className="recent-activity__title">Recent Activity</h2>
        </div>
        <div className="dataset-table__wrapper">
          <table className="dataset-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Target</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ACTIVITY.map((row, i) => (
                <tr key={i}>
                  <td>{row.action}</td>
                  <td>{row.target}</td>
                  <td style={{ 
                    color: row.status === 'Success' ? 'var(--success)' : 
                           row.status === 'Failed' ? 'var(--danger)' : 'var(--warning)' 
                  }}>
                    {row.status}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default HomePage;