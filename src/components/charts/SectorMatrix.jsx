import React from 'react';
import './SectorMatrix.css';

const SECTOR_ORDER = ['SaaS / B2B', 'EV & Mobility', 'DeepTech / Aerospace'];

const SECTOR_ACCENT = {
  'SaaS / B2B': '#4A9EFF',
  'EV & Mobility': '#00D68F',
  'DeepTech / Aerospace': '#F7B731',
};

const TIER_DOT = {
  'Tier 1': '#10B981',
  'Tier 2': '#F59E0B',
  'Tier 3': '#EF4444',
};

const MetricBar = ({ label, value, max, color, isNegative, unit = '' }) => {
  const pct = isNegative ? 0 : Math.min(Math.max(value / max, 0), 1) * 100;
  const displayValue = isNegative ? 'N/A' : `${value}${unit}`;

  return (
    <div className="metric-row">
      <span className="metric-label">{label}</span>
      <div className="metric-bar-track">
        {isNegative ? (
          <div className="metric-bar-fill negative" style={{ width: '30%' }} />
        ) : (
          <div
            className="metric-bar-fill"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        )}
      </div>
      <span className={`metric-value ${isNegative ? 'na' : ''}`}>{displayValue}</span>
    </div>
  );
};

const SectorMatrix = ({ sectors, startups }) => {
  // Build a name → {tier} lookup from startups
  const companyMeta = {};
  startups.forEach(s => {
    companyMeta[s.Startup] = { tier: s.tier };
  });

  // Only render the three canonical sectors in order
  const sectorEntries = SECTOR_ORDER
    .map(name => ({ name, data: sectors[name] }))
    .filter(({ data }) => data != null);

  return (
    <div className="sector-matrix">
      <div className="sector-matrix-header">
        <h3>Sector Matrix</h3>
        <p className="chart-subtitle">Key metrics and companies by sector</p>
      </div>

      <div className="sector-cards">
        {sectorEntries.map(({ name, data }) => {
          const accent = SECTOR_ACCENT[name] || '#6B7280';
          const avgMarginNegative = data.avgMargin < 0;
          const avgGrowthNegative = data.avgGrowth < 0;

          return (
            <div key={name} className="sector-card">
              {/* Card header with sector accent background */}
              <div
                className="sector-card-header"
                style={{ backgroundColor: `${accent}26` /* 15% opacity = 26 in hex */ }}
              >
                <span className="sector-card-name" style={{ color: accent }}>
                  {name}
                </span>
                <span className="sector-card-badge" style={{ borderColor: `${accent}66`, color: accent }}>
                  {data.count}
                </span>
              </div>

              {/* Metric bars */}
              <div className="sector-card-metrics">
                <MetricBar
                  label="Avg YoY Growth"
                  value={data.avgGrowth}
                  max={200}
                  color={accent}
                  isNegative={avgGrowthNegative}
                  unit="%"
                />
                <MetricBar
                  label="Avg Gross Margin"
                  value={data.avgMargin}
                  max={100}
                  color={accent}
                  isNegative={avgMarginNegative}
                  unit="%"
                />
                <MetricBar
                  label="Avg LTV/CAC"
                  value={data.avgLtvCac}
                  max={10}
                  color={accent}
                  isNegative={false}
                  unit="x"
                />
                <MetricBar
                  label="Rule of 40"
                  value={data.avgRuleOf40}
                  max={80}
                  color={accent}
                  isNegative={data.avgRuleOf40 < 0}
                  unit=""
                />
              </div>

              {/* Divider */}
              <div className="sector-card-divider" />

              {/* Company pills with tier badges */}
              <div className="sector-card-companies">
                {data.companies.map(companyName => {
                  const meta = companyMeta[companyName];
                  const tier = meta?.tier || null;
                  const dotColor = tier ? TIER_DOT[tier] : '#6B7280';

                  return (
                    <span key={companyName} className="company-tag">
                      <span
                        className="tier-dot"
                        style={{ backgroundColor: dotColor }}
                        title={tier || 'Unscored'}
                      />
                      {companyName}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectorMatrix;
