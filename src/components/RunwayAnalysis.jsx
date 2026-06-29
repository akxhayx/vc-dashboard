import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';

const RunwayAnalysis = ({ startups }) => {
  const data = startups
    .map(s => ({
      name: s.Startup,
      runway: Math.min(s.runway, 36), // Cap at 36 for visualization
      actualRunway: s.runway,
      burnRate: Math.abs(s.burnRate) / 1000000,
      sector: s.sector
    }))
    .sort((a, b) => a.runway - b.runway);

  const getRunwayColor = (runway) => {
    if (runway < 6) return 'var(--error)';
    if (runway < 12) return 'var(--warning)';
    return 'var(--success)';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <div className="tooltip-title">{data.name}</div>
          <div className="tooltip-row">
            <span>Runway:</span>
            <span className="tooltip-value">
              {data.actualRunway > 36 ? '36+ months' : `${data.actualRunway.toFixed(1)} months`}
            </span>
          </div>
          <div className="tooltip-row">
            <span>Monthly Burn:</span>
            <span className="tooltip-value">₹{data.burnRate.toFixed(1)}M</span>
          </div>
          <div className="tooltip-sector">{data.sector}</div>
        </div>
      );
    }
    return null;
  };

  const stats = {
    critical: data.filter(d => d.runway < 6).length,
    warning: data.filter(d => d.runway >= 6 && d.runway < 12).length,
    healthy: data.filter(d => d.runway >= 12).length
  };

  return (
    <div className="runway-analysis">
      <div className="chart-header">
        <h3>Runway Analysis</h3>
        <div className="runway-stats">
          <div className="runway-stat critical">
            <span className="stat-value">{stats.critical}</span>
            <span className="stat-label">Critical (&lt;6m)</span>
          </div>
          <div className="runway-stat warning">
            <span className="stat-value">{stats.warning}</span>
            <span className="stat-label">Watch (6-12m)</span>
          </div>
          <div className="runway-stat healthy">
            <span className="stat-value">{stats.healthy}</span>
            <span className="stat-label">Healthy (&gt;12m)</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          layout="horizontal"
          margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
        >
          <XAxis
            type="number"
            stroke="var(--text-tertiary)"
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
            label={{ value: 'Months of Runway', position: 'bottom', fill: 'var(--text-secondary)', fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="var(--text-tertiary)"
            tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            width={110}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--surface-hover)' }} />
          <ReferenceLine x={6} stroke="var(--error)" strokeDasharray="3 3" strokeWidth={2} />
          <ReferenceLine x={12} stroke="var(--warning)" strokeDasharray="3 3" strokeWidth={2} />
          <Bar dataKey="runway" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getRunwayColor(entry.runway)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RunwayAnalysis;
