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
    const cx = size / 2;
    const cy = size / 2;
    const radius = 28;
    const progress = Math.min(runway / 36, 1);

    // Arc spans 270° from -135° (bottom-left) clockwise to +135° (bottom-right)
    const startAngle = -135 * (Math.PI / 180);
    const totalAngle = 270 * (Math.PI / 180);

    const toXY = (angle) => ({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });

    const bgEnd = toXY(startAngle + totalAngle);
    const bgStart = toXY(startAngle);

    // Foreground arc endpoint at progress fraction of 270°
    const fgEndAngle = startAngle + totalAngle * progress;
    const fgEnd = toXY(fgEndAngle);
    const fgLargeArc = totalAngle * progress > Math.PI ? 1 : 0;

    return (
      <svg width={size} height={size} className="arc-gauge">
        {/* Background arc — full 270° */}
        <path
          d={`M ${bgStart.x.toFixed(2)} ${bgStart.y.toFixed(2)} A ${radius} ${radius} 0 1 1 ${bgEnd.x.toFixed(2)} ${bgEnd.y.toFixed(2)}`}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Foreground arc — geometric endpoint only, no dasharray */}
        {progress > 0 && (
          <path
            d={`M ${bgStart.x.toFixed(2)} ${bgStart.y.toFixed(2)} A ${radius} ${radius} 0 ${fgLargeArc} 1 ${fgEnd.x.toFixed(2)} ${fgEnd.y.toFixed(2)}`}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
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
