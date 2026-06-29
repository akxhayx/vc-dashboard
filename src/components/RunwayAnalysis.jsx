import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, LabelList } from 'recharts';

const RunwayAnalysis = ({ startups }) => {
  // Filter startups with valid runway data
  const validStartups = startups.filter(s => s.runway !== null && s.runway > 0);

  // Log first 3 companies' runway values for debugging
  console.log('Runway values (first 3):');
  validStartups.slice(0, 3).forEach((s, i) => {
    console.log(`  ${i + 1}. ${s.Startup}: runway=${s.runway} (type: ${typeof s.runway})`);
  });

  // Sort ascending by runway - most critical (lowest) first
  const sortedStartups = [...validStartups].sort((a, b) => a.runway - b.runway);

  const data = sortedStartups.map(s => ({
    name: s.Startup,
    runway: Math.min(s.runway, 36), // Cap at 36 for display
    actualRunway: s.runway, // Keep actual value for labels and tooltip
    burnRate: Math.abs(s.burnRate) / 1000000,
    sector: s.sector,
    displayLabel: s.runway > 36 ? '36m+' : `${s.runway.toFixed(0)}m`
  }));

  const getRunwayColor = (runwayValue) => {
    if (runwayValue < 6) return '#EF4444'; // Red - critical
    if (runwayValue < 12) return '#F59E0B'; // Amber - warning
    return '#10B981'; // Green - healthy
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
    critical: data.filter(d => d.actualRunway < 6).length,
    warning: data.filter(d => d.actualRunway >= 6 && d.actualRunway < 12).length,
    healthy: data.filter(d => d.actualRunway >= 12).length
  };

  // Dynamic height: 36px per company + padding
  const chartHeight = Math.max(300, data.length * 36);

  return (
    <div className="runway-analysis">
      <div className="chart-header">
        <h3>Runway Analysis</h3>
        <p className="chart-subtitle">Cash position and burn rate • Most critical at top</p>
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

      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={data}
          layout="horizontal"
          margin={{ top: 10, right: 80, left: 150, bottom: 30 }}
        >
          {/* X-axis: Runway in months */}
          <XAxis
            type="number"
            domain={[0, 36]}
            stroke="var(--text-tertiary)"
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
            label={{
              value: 'Months of Runway',
              position: 'bottom',
              offset: 10,
              fill: 'var(--text-secondary)',
              fontSize: 12
            }}
          />

          {/* Y-axis: Company names */}
          <YAxis
            type="category"
            dataKey="name"
            stroke="var(--text-tertiary)"
            tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
            width={140}
          />

          {/* Tooltip on hover */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
          />

          {/* Reference lines at critical thresholds */}
          <ReferenceLine
            x={6}
            stroke="rgba(239, 68, 68, 0.5)"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: '6m (critical)',
              position: 'top',
              fill: 'rgba(239, 68, 68, 0.7)',
              fontSize: 10
            }}
          />
          <ReferenceLine
            x={12}
            stroke="rgba(245, 158, 11, 0.5)"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: '12m (target)',
              position: 'top',
              fill: 'rgba(245, 158, 11, 0.7)',
              fontSize: 10
            }}
          />

          {/* Bars with color-coded runway status */}
          <Bar
            dataKey="runway"
            fill="#8884d8"
            radius={[0, 4, 4, 0]}
            isAnimationActive={true}
          >
            {/* Color each bar by runway status */}
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getRunwayColor(entry.actualRunway)}
                opacity={0.85}
              />
            ))}

            {/* Runway labels at end of bars: "20m", "36m+", etc */}
            <LabelList
              dataKey="displayLabel"
              position="right"
              fill="white"
              fontSize={11}
              fontWeight={500}
              offset={8}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RunwayAnalysis;
