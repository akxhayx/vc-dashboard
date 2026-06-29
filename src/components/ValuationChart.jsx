import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

const ValuationChart = ({ startups }) => {
  // Filter out companies with null revenueMultiple or impliedValuation (like DeepTech)
  const validStartups = startups.filter(s => s.revenueMultiple !== null && s.impliedValuation > 0);

  const data = validStartups.map(s => ({
    name: s.Startup,
    x: s.arr, // ARR in rupees for log scale
    y: s.impliedValuation, // Valuation in rupees for log scale
    multiple: s.revenueMultiple,
    sector: s.sector,
    growth: s.yoyGrowth
  }));

  // Sector colors - updated for three sectors only
  const sectorColors = {
    'SaaS / B2B': '#4A9EFF',
    'EV & Mobility': '#00D68F',
    'DeepTech / Aerospace': '#F7B731',
    'Other': '#6b7280'
  };

  const getSectorColor = (sector) => {
    return sectorColors[sector] || sectorColors['Other'];
  };

  // Get unique sectors that actually exist in the data
  const sectorsInData = [...new Set(validStartups.map(s => s.sector))].filter(s => s !== 'DeepTech / Aerospace');

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const arrInCr = data.x / 1e7;
      const valuationInCr = data.y / 1e7;
      return (
        <div className="custom-tooltip">
          <div className="tooltip-title">{data.name}</div>
          <div className="tooltip-row">
            <span>ARR:</span>
            <span className="tooltip-value">₹{arrInCr.toFixed(1)}Cr</span>
          </div>
          <div className="tooltip-row">
            <span>Valuation:</span>
            <span className="tooltip-value">₹{valuationInCr.toFixed(1)}Cr</span>
          </div>
          <div className="tooltip-row">
            <span>Multiple:</span>
            <span className="tooltip-value">{data.multiple !== null ? `${data.multiple.toFixed(1)}x` : 'N/A'}</span>
          </div>
          <div className="tooltip-row">
            <span>Growth:</span>
            <span className="tooltip-value">{data.growth !== null ? `${data.growth.toFixed(0)}%` : 'N/A'}</span>
          </div>
          <div className="tooltip-sector" style={{ color: getSectorColor(data.sector) }}>
            {data.sector}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom label component for company names on dots
  const renderCustomLabel = (props) => {
    const { x, y, value } = props;
    if (!x || !y || !value) return null;

    return (
      <text
        x={x}
        y={y - 10}
        fill="white"
        textAnchor="middle"
        fontSize={10}
        fontWeight={500}
      >
        {value.name}
      </text>
    );
  };

  return (
    <div className="valuation-chart">
      <div className="chart-header">
        <h3>Valuation vs Revenue</h3>
        <p className="chart-subtitle">Revenue Multiple Analysis by Sector (Log Scale)</p>
      </div>

      {/* Legend with only sectors that exist in data */}
      <div className="sector-legend">
        {sectorsInData.map((sector) => (
          <div key={sector} className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: getSectorColor(sector) }}></div>
            <span>{sector}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={450}>
        <ScatterChart margin={{ top: 40, right: 30, bottom: 80, left: 100 }}>
          {/* X-axis with log scale - ARR in Crores */}
          <XAxis
            type="number"
            dataKey="x"
            name="ARR"
            scale="log"
            domain={[1e6, 1e10]}
            stroke="var(--text-tertiary)"
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
            tickFormatter={(value) => `₹${(value / 1e7).toFixed(0)}Cr`}
            label={{
              value: 'Annual Recurring Revenue (₹Cr)',
              position: 'bottom',
              offset: 50,
              fill: 'var(--text-secondary)',
              fontSize: 12
            }}
          />

          {/* Y-axis with log scale - Valuation in Crores */}
          <YAxis
            type="number"
            dataKey="y"
            name="Valuation"
            scale="log"
            domain={[1e6, 1e11]}
            stroke="var(--text-tertiary)"
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
            tickFormatter={(value) => `₹${(value / 1e7).toFixed(0)}Cr`}
            label={{
              value: 'Implied Valuation (₹Cr)',
              angle: -90,
              position: 'insideLeft',
              offset: -10,
              fill: 'var(--text-secondary)',
              fontSize: 12
            }}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'var(--border)' }} />

          {/* Scatter dots - uniform 8px radius, colored by sector */}
          <Scatter
            data={data}
            fill="#8884d8"
            shape={{ type: 'circle', radius: 8 }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getSectorColor(entry.sector)}
                opacity={0.8}
                stroke={getSectorColor(entry.sector)}
                strokeWidth={2}
              />
            ))}
            {/* Company name labels on dots */}
            <LabelList
              dataKey="name"
              content={renderCustomLabel}
            />
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ValuationChart;
