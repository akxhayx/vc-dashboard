import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const EfficiencyMatrix = ({ startups }) => {
  const data = startups.map(s => ({
    name: s.Startup,
    x: s.ltvcacRatio,
    y: s.magicNumber,
    z: s.arr / 1000000, // Size by ARR
    sector: s.sector,
    score: s.investorScore
  }));

  const getSectorColor = (sector) => {
    const colors = {
      'SaaS': '#3b82f6',
      'Fintech': '#8b5cf6',
      'EV & Mobility': '#10b981',
      'EdTech': '#f59e0b',
      'Food & Delivery': '#ef4444',
      'E-commerce': '#ec4899',
      'Deep Tech': '#06b6d4',
      'Other': '#6b7280'
    };
    return colors[sector] || colors['Other'];
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <div className="tooltip-title">{data.name}</div>
          <div className="tooltip-row">
            <span>LTV/CAC:</span>
            <span className="tooltip-value">{data.x.toFixed(1)}x</span>
          </div>
          <div className="tooltip-row">
            <span>Magic Number:</span>
            <span className="tooltip-value">{data.y.toFixed(2)}</span>
          </div>
          <div className="tooltip-row">
            <span>Score:</span>
            <span className="tooltip-value">{data.score}</span>
          </div>
          <div className="tooltip-sector" style={{ color: getSectorColor(data.sector) }}>
            {data.sector}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="efficiency-matrix">
      <div className="chart-header">
        <h3>Efficiency Matrix</h3>
        <p className="chart-subtitle">LTV/CAC vs Magic Number • Sized by ARR</p>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 60 }}>
          <XAxis
            type="number"
            dataKey="x"
            name="LTV/CAC"
            stroke="var(--text-tertiary)"
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
            label={{ value: 'LTV/CAC Ratio', position: 'bottom', fill: 'var(--text-secondary)', fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Magic Number"
            stroke="var(--text-tertiary)"
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
            label={{ value: 'Magic Number', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)', fontSize: 12 }}
          />
          <ZAxis type="number" dataKey="z" range={[100, 1000]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'var(--border)' }} />
          <Scatter data={data} fill="#8884d8">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getSectorColor(entry.sector)} opacity={0.8} />
            ))}
          </Scatter>
          {/* Reference lines */}
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="var(--border)" strokeDasharray="4 4" strokeWidth={1} />
        </ScatterChart>
      </ResponsiveContainer>
      <div className="matrix-quadrants">
        <div className="quadrant">
          <span className="quadrant-label">High LTV/CAC</span>
          <span className="quadrant-desc">Strong unit economics</span>
        </div>
        <div className="quadrant">
          <span className="quadrant-label">High Magic Number</span>
          <span className="quadrant-desc">Efficient growth</span>
        </div>
      </div>
    </div>
  );
};

export default EfficiencyMatrix;
