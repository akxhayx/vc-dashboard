import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Label } from 'recharts';

const EfficiencyMatrix = ({ startups }) => {
  // Filter: exclude null/0/> 5 magic number, exclude ltvcacRatio > 30
  const validStartups = startups.filter(s => {
    const magicNumber = s.magicNumber;
    const ltvcacRatio = s.ltvcacRatio;

    // Exclude null, 0, or > 5 magic number
    if (magicNumber === null || magicNumber === 0 || magicNumber > 5) return false;

    // Exclude ltvcacRatio > 30 (outliers/broken data)
    if (ltvcacRatio === null || ltvcacRatio > 30) return false;

    return true;
  });

  const data = validStartups.map(s => ({
    name: s.Startup,
    x: s.ltvcacRatio,
    y: s.magicNumber,
    sector: s.sector,
    score: s.investorScore,
    arr: s.arr
  }));

  // Updated sector colors
  const sectorColors = {
    'SaaS / B2B': '#4A9EFF',
    'EV & Mobility': '#00D68F',
    'DeepTech / Aerospace': '#F7B731',
    'Other': '#6B7280'
  };

  const getSectorColor = (sector) => {
    return sectorColors[sector] || sectorColors['Other'];
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
          {data.score !== null && (
            <div className="tooltip-row">
              <span>Score:</span>
              <span className="tooltip-value">{data.score}</span>
            </div>
          )}
          <div className="tooltip-sector" style={{ color: getSectorColor(data.sector) }}>
            {data.sector}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom label for top-right quadrant only
  const renderCustomLabel = (props) => {
    const { x, y, value } = props;
    if (!x || !y || !value) return null;

    // Only show labels for companies in top-right quadrant (x > 3, y > 1)
    if (value.x > 3 && value.y > 1) {
      return (
        <text
          x={x}
          y={y - 8}
          fill="white"
          textAnchor="middle"
          fontSize={9}
          fontWeight={500}
          pointerEvents="none"
        >
          {value.name}
        </text>
      );
    }
    return null;
  };


  return (
    <div className="efficiency-matrix">
      <div className="chart-header">
        <h3>Efficiency Matrix</h3>
        <p className="chart-subtitle">LTV/CAC vs Magic Number • Unit Economics & Growth Efficiency</p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 50, left: 70 }}>
          {/* X-axis: LTV/CAC */}
          <XAxis
            type="number"
            dataKey="x"
            name="LTV/CAC"
            stroke="var(--text-tertiary)"
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
            domain={[0, 30]}
            label={{
              value: 'LTV/CAC Ratio',
              position: 'bottom',
              offset: 10,
              fill: 'var(--text-secondary)',
              fontSize: 12
            }}
          />

          {/* Y-axis: Magic Number */}
          <YAxis
            type="number"
            dataKey="y"
            name="Magic Number"
            stroke="var(--text-tertiary)"
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
            domain={[0, 5]}
            label={{
              value: 'Magic Number (Sales Efficiency)',
              angle: -90,
              position: 'insideLeft',
              offset: -10,
              fill: 'var(--text-secondary)',
              fontSize: 12
            }}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'var(--border)' }} />

          {/* Reference line at x = 3 (LTV/CAC threshold) */}
          <ReferenceLine
            x={3}
            stroke="rgba(255, 255, 255, 0.4)"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          >
            <Label
              value="3x min"
              position="top"
              fill="rgba(255, 255, 255, 0.6)"
              fontSize={10}
              offset={5}
            />
          </ReferenceLine>

          {/* Reference line at y = 1 (Magic Number threshold) */}
          <ReferenceLine
            y={1}
            stroke="rgba(255, 255, 255, 0.4)"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          >
            <Label
              value="1.0 target"
              position="right"
              fill="rgba(255, 255, 255, 0.6)"
              fontSize={10}
              offset={5}
            />
          </ReferenceLine>

          {/* Scatter plot */}
          <Scatter data={data} name="Companies">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getSectorColor(entry.sector)}
                opacity={0.8}
                stroke={getSectorColor(entry.sector)}
                strokeWidth={1.5}
              />
            ))}
          </Scatter>

          {/* Labels for top-right quadrant companies */}
          {data
            .filter(d => d.x > 3 && d.y > 1)
            .map((entry, index) => (
              <text
                key={`label-${index}`}
                x={entry.x}
                y={entry.y - 8}
                fill="white"
                textAnchor="middle"
                fontSize={9}
                fontWeight={500}
                pointerEvents="none"
              >
                {entry.name}
              </text>
            ))}
        </ScatterChart>
      </ResponsiveContainer>

      {/* Quadrant legend */}
      <div className="matrix-quadrants">
        <div className="quadrant" style={{ backgroundColor: 'rgba(0, 214, 143, 0.08)' }}>
          <span className="quadrant-label">✓ Top Right</span>
          <span className="quadrant-desc">Strong unit economics + efficient growth</span>
        </div>
        <div className="quadrant" style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)' }}>
          <span className="quadrant-label">✗ Bottom Left</span>
          <span className="quadrant-desc">Weak unit economics + inefficient growth</span>
        </div>
      </div>
    </div>
  );
};

export default EfficiencyMatrix;
