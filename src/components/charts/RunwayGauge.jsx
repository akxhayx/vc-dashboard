import React, { useMemo } from 'react';
import './RunwayGauge.css';

const RunwayGauge = ({ startups }) => {
  // Filter startups with valid runway data
  const validStartups = startups.filter(s => s.runway !== null && s.runway > 0);

  // Sort by runway status: critical first (red), then warning (amber), then healthy (green)
  const sortedStartups = useMemo(() => {
    return [...validStartups].sort((a, b) => {
      const getCriticality = (runway) => {
        if (runway < 6) return 0; // Critical - sort first
        if (runway < 12) return 1; // Warning
        return 2; // Healthy
      };
      return getCriticality(a.runway) - getCriticality(b.runway);
    });
  }, [validStartups]);

  const getRunwayColor = (runway) => {
    if (runway < 6) return '#EF4444'; // Red
    if (runway < 12) return '#F59E0B'; // Amber
    return '#10B981'; // Green
  };

  const getRunwayLabel = (runway) => {
    return runway > 36 ? '36m+' : `${runway.toFixed(0)}m`;
  };

  const formatBurnRate = (burnRate) => {
    const monthlyBurn = Math.abs(burnRate) / 1e7; // Convert to Crores
    return `₹${monthlyBurn.toFixed(0)}Cr/mo`;
  };

  // SVG Arc gauge component
  const ArcGauge = ({ runway, color }) => {
    const size = 80;
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(runway / 36, 1);
    const strokeDashoffset = circumference * (1 - progress);

    // Draw a 270° arc (starting at -135° to 135°)
    const startAngle = -135 * (Math.PI / 180);
    const endAngle = 135 * (Math.PI / 180);
    const startX = size / 2 + radius * Math.cos(startAngle);
    const startY = size / 2 + radius * Math.sin(startAngle);
    const endX = size / 2 + radius * Math.cos(endAngle);
    const endY = size / 2 + radius * Math.sin(endAngle);

    return (
      <svg width={size} height={size} className="arc-gauge">
        {/* Background arc - full 270° */}
        <path
          d={`M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${endX} ${endY}`}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Foreground arc - progress */}
        <path
          d={`M ${startX} ${startY} A ${radius} ${radius} 0 ${progress > 0.75 ? 1 : 0} 1 ${
            size / 2 + radius * Math.cos(startAngle + (endAngle - startAngle) * progress)
          } ${size / 2 + radius * Math.sin(startAngle + (endAngle - startAngle) * progress)}`}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="arc-progress"
        />
      </svg>
    );
  };

  return (
    <div className="runway-gauge-container">
      <div className="chart-header">
        <h3>Runway Monitor</h3>
        <p className="chart-subtitle">Company cash runway at current burn rate</p>
      </div>

      <div className="runway-stats-summary">
        <div className="stat-card critical">
          <span className="stat-label">Critical</span>
          <span className="stat-count">
            {validStartups.filter(s => s.runway < 6).length}
          </span>
        </div>
        <div className="stat-card warning">
          <span className="stat-label">Watch</span>
          <span className="stat-count">
            {validStartups.filter(s => s.runway >= 6 && s.runway < 12).length}
          </span>
        </div>
        <div className="stat-card healthy">
          <span className="stat-label">Healthy</span>
          <span className="stat-count">
            {validStartups.filter(s => s.runway >= 12).length}
          </span>
        </div>
      </div>

      <div className="gauge-grid">
        {sortedStartups.map((startup, index) => {
          const runway = startup.runway;
          const color = getRunwayColor(runway);
          const isCritical = runway < 6;

          return (
            <div
              key={startup.Startup}
              className={`gauge-card ${isCritical ? 'critical' : ''}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Company name */}
              <div className="card-company">{startup.Startup}</div>

              {/* Gauge arc and number */}
              <div className="card-gauge-wrapper">
                <ArcGauge runway={runway} color={color} />
                <div className="card-runway">{getRunwayLabel(runway)}</div>
              </div>

              {/* Burn rate */}
              <div className="card-burn">{formatBurnRate(startup.burnRate)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RunwayGauge;
