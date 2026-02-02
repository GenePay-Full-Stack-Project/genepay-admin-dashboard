import React from 'react'

const StatCard = ({ label, value, trend, trendLabel }) => (
  <div className="stat-card">
    <div className="stat-meta">
      <p className="stat-label">{label}</p>
      {trend !== undefined && (
        <span className={`trend ${trend > 0 ? 'up' : 'down'}`}>
          {trend > 0 ? '+' : ''}
          {trend}%
        </span>
      )}
    </div>
    <h3>{value}</h3>
    {trendLabel && <p className="trend-label">{trendLabel}</p>}
  </div>
)

export default StatCard
