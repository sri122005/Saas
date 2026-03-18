import React from 'react';
import './DashboardCard.css';

const DashboardCard = ({ title, value, icon, color, trend }) => {
  return (
    <div className="stats-card">
      <div className="stats-header">
        <span className="stats-title">{title}</span>
        <div className="stats-icon" style={{ color: color }}>
          {icon}
        </div>
      </div>
      <div className="stats-body">
        <h2 className="stats-value">{value}</h2>
        {trend && (
          <div className={`stats-trend ${trend.type}`}>
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
