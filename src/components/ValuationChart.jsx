import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const ValuationChart = ({ startups }) => {
  const data = startups.map(s => ({
    name: s.Startup,
    x: s.arr / 1000000, // ARR in millions
    y: s.impliedValuation / 1000000, // Valuation in millions
    multiple: s.revenueMultiple,
    sector: s.sector,
    growth: s.yoyGrowth
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
            <span>ARR:</span>
            <span className="tooltip-value">₹{data.x.toFixed(0)}M</span>
          </div>
          <div className="tooltip-row">
            <span>Valuation:</span>
            <span className="tooltip-value">₹{data.y.toFixed(0)}M</span>
          </div>
          <div className="tooltip-row">
            <span>Multiple:</span>
            <span className="tooltip-value">{data.multiple.toFixed(1)}x</span>
          </div>
          <div className="tooltip-row">
            <span>Growth:</span>
            <span className="tooltip-value">{data.growth.toFixed(0)}%</span>
          </div>
          <div className="tooltip-sector" style={{ color: getSectorColor(data.sector) }}>
            {data.sector}
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate reference lines for common multiples
  const maxX = Math.max(...data.map(d => d.x));

  return (
    <div className="valuation-chart">
      <div className="chart-header">
        <h3>Valuation vs Revenue</h3>
        <p className="chart-subtitle">Revenue Multiple Analysis by Sector</p>
      </div>
      <div className="sector-legend">
        {Object.entries({
          'SaaS': '#3b82f6',
          'Fintech': '#8b5cf6',
          'EV & Mobility': '#10b981',
          'EdTech': '#f59e0b',
          'E-commerce': '#ec4899'
        }).map(([sector, color]) => (
          <div key={sector} className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: color }}></div>
            <span>{sector}</span>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={450}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 80 }}>
          <XAxis
            type="number"
            dataKey="x"
            name="ARR"
            stroke="var(--text-tertiary)"
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
            label={{ 
              value: 'Annual Recurring Revenue (₹M)', 
              position: 'bottom', 
              offset: 40,
              fill: 'var(--text-secondary)', 
              fontSize: 12 
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Valuation"
            stroke="var(--text-tertiary)"
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
            label={{ 
              value: 'Implied Valuation (₹M)', 
              angle: -90, 
              position: 'insideLeft',
              offset: 10,
              fill: 'var(--text-secondary)', 
              fontSize: 12 
            }}
          />
          <ZAxis type="number" dataKey="growth" range={[100, 600]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'var(--border)' }} />
          
          {/* Reference lines for multiples */}
          <ReferenceLine
            segment={[{ x: 0, y: 0 }, { x: maxX, y: maxX * 5 }]}
            stroke="var(--text-tertiary)"
            strokeDasharray="4 4"
            strokeWidth={1}
            label={{ value: '5x', fill: 'var(--text-tertiary)', fontSize: 10 }}
          />
          <ReferenceLine
            segment={[{ x: 0, y: 0 }, { x: maxX, y: maxX * 10 }]}
            stroke="var(--text-tertiary)"
            strokeDasharray="4 4"
            strokeWidth={1}
            label={{ value: '10x', fill: 'var(--text-tertiary)', fontSize: 10 }}
          />
          
          <Scatter data={data} fill="#8884d8">
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getSectorColor(entry.sector)} 
                opacity={0.75}
                stroke={getSectorColor(entry.sector)}
                strokeWidth={2}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ValuationChart;
