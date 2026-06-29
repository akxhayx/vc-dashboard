import React, { useState, useMemo } from 'react';
import './EfficiencyQuadrant.css';

const EfficiencyQuadrant = ({ startups }) => {
  const [hoveredCompany, setHoveredCompany] = useState(null);

  // Filter: exclude DeepTech, exclude null/invalid values
  const validStartups = useMemo(() => {
    return startups
      .filter(s => {
        const hasMagicNumber = s.magicNumber !== null && s.magicNumber > 0 && s.magicNumber <= 5;
        const hasLtvCac = s.ltvcacRatio !== null && s.ltvcacRatio <= 30;
        const isNotDeepTech = !s.sector?.includes('DeepTech');
        return hasMagicNumber && hasLtvCac && isNotDeepTech;
      })
      .map(s => ({
        name: s.Startup,
        x: Math.min(s.ltvcacRatio, 15), // Cap at 15
        y: Math.min(s.magicNumber, 3), // Cap at 3
        sector: s.sector,
        magicNumber: s.magicNumber,
        ltvcacRatio: s.ltvcacRatio
      }));
  }, [startups]);

  // Sector colors
  const sectorColors = {
    'SaaS / B2B': '#4A9EFF',
    'EV & Mobility': '#00D68F',
    'Other': '#6B7280'
  };

  const getSectorColor = (sector) => sectorColors[sector] || sectorColors['Other'];

  // SVG dimensions
  const padding = 50;
  const width = 700;
  const height = 500;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  // Scale functions
  const scaleX = (value) => (value / 15) * chartWidth;
  const scaleY = (value) => chartHeight - (value / 3) * chartHeight;

  // Get quadrant label
  const getQuadrantLabel = (x, y) => {
    if (x > 3 && y > 1) return 'Stars';
    if (x <= 3 && y > 1) return 'Efficient\nbut Pricey';
    if (x > 3 && y <= 1) return 'Good Economics,\nSlow Growth';
    return 'Needs Work';
  };

  // Companies in Stars quadrant
  const starCompanies = validStartups.filter(s => s.x > 3 && s.y > 1);

  // Helper function to position labels without overlap
  const getStarLabels = () => {
    const labels = starCompanies.map(company => ({
      company,
      x: scaleX(company.x),
      y: scaleY(company.y)
    }));

    // Simple offset to avoid overlaps
    return labels.map((label, index) => ({
      ...label,
      offsetX: (index % 2) * 40 - 20,
      offsetY: Math.floor(index / 2) * 20 - 10
    }));
  };

  const starLabels = useMemo(() => getStarLabels(), [starCompanies]);

  return (
    <div className="efficiency-quadrant-container">
      <div className="chart-header">
        <h3>Efficiency Quadrant</h3>
        <p className="chart-subtitle">LTV/CAC vs Sales Efficiency • Unit Economics</p>
      </div>

      <div className="chart-wrapper">
        <svg width={width} height={height} className="quadrant-svg">
          {/* Quadrant backgrounds */}
          {/* Top-right: Stars */}
          <rect
            x={padding + scaleX(3)}
            y={padding}
            width={chartWidth - scaleX(3)}
            height={scaleY(1) - padding}
            fill="rgba(0, 214, 143, 0.06)"
          />

          {/* Top-left: Efficient but Pricey */}
          <rect
            x={padding}
            y={padding}
            width={scaleX(3)}
            height={scaleY(1) - padding}
            fill="rgba(247, 183, 49, 0.06)"
          />

          {/* Bottom-right: Good Economics, Slow Growth */}
          <rect
            x={padding + scaleX(3)}
            y={scaleY(1)}
            width={chartWidth - scaleX(3)}
            height={chartHeight - (scaleY(1) - padding)}
            fill="rgba(74, 158, 255, 0.06)"
          />

          {/* Bottom-left: Needs Work */}
          <rect
            x={padding}
            y={scaleY(1)}
            width={scaleX(3)}
            height={chartHeight - (scaleY(1) - padding)}
            fill="rgba(239, 68, 68, 0.06)"
          />

          {/* Quadrant labels */}
          <text
            x={padding + chartWidth - 8}
            y={padding + 16}
            textAnchor="end"
            fill="rgba(255,255,255,0.4)"
            fontSize="11px"
            fontWeight="500"
          >
            Stars
          </text>
          <text
            x={padding + 8}
            y={padding + 16}
            textAnchor="start"
            fill="rgba(255,255,255,0.4)"
            fontSize="11px"
            fontWeight="500"
          >
            Efficient
          </text>
          <text
            x={padding + chartWidth - 8}
            y={height - padding + 12}
            textAnchor="end"
            fill="rgba(255,255,255,0.4)"
            fontSize="11px"
            fontWeight="500"
          >
            Good Economics
          </text>
          <text
            x={padding + 8}
            y={height - padding + 12}
            textAnchor="start"
            fill="rgba(255,255,255,0.4)"
            fontSize="11px"
            fontWeight="500"
          >
            Needs Work
          </text>

          {/* Axes */}
          {/* X axis */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />

          {/* Y axis */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />

          {/* Reference lines */}
          {/* LTV/CAC = 3 (vertical) */}
          <line
            x1={padding + scaleX(3)}
            y1={padding}
            x2={padding + scaleX(3)}
            y2={height - padding}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <text
            x={padding + scaleX(3)}
            y={height - padding + 20}
            textAnchor="middle"
            fill="rgba(255,255,255,0.6)"
            fontSize="10px"
            fontWeight="500"
          >
            3x
          </text>

          {/* Magic Number = 1 (horizontal) */}
          <line
            x1={padding}
            y1={scaleY(1)}
            x2={width - padding}
            y2={scaleY(1)}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <text
            x={padding - 8}
            y={scaleY(1) - 5}
            textAnchor="end"
            fill="rgba(255,255,255,0.6)"
            fontSize="10px"
            fontWeight="500"
          >
            1.0
          </text>

          {/* Axis labels */}
          <text
            x={width - padding}
            y={height - padding + 35}
            textAnchor="end"
            fill="rgba(255,255,255,0.5)"
            fontSize="12px"
            fontWeight="500"
          >
            LTV/CAC Ratio
          </text>
          <text
            x={padding - 25}
            y={padding - 5}
            textAnchor="end"
            fill="rgba(255,255,255,0.5)"
            fontSize="12px"
            fontWeight="500"
          >
            Magic Number
          </text>

          {/* Tick marks and labels */}
          {[0, 3, 6, 9, 12, 15].map(val => (
            <g key={`x-tick-${val}`}>
              <line
                x1={padding + scaleX(val)}
                y1={height - padding}
                x2={padding + scaleX(val)}
                y2={height - padding + 4}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />
              <text
                x={padding + scaleX(val)}
                y={height - padding + 16}
                textAnchor="middle"
                fill="rgba(255,255,255,0.4)"
                fontSize="10px"
              >
                {val}
              </text>
            </g>
          ))}

          {[0, 1, 2, 3].map(val => (
            <g key={`y-tick-${val}`}>
              <line
                x1={padding - 4}
                y1={scaleY(val)}
                x2={padding}
                y2={scaleY(val)}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />
              <text
                x={padding - 10}
                y={scaleY(val) + 3}
                textAnchor="end"
                fill="rgba(255,255,255,0.4)"
                fontSize="10px"
              >
                {val}
              </text>
            </g>
          ))}

          {/* Company dots */}
          {validStartups.map(company => {
            const cx = padding + scaleX(company.x);
            const cy = scaleY(company.y);
            const isHovered = hoveredCompany === company.name;
            const isStar = company.x > 3 && company.y > 1;

            return (
              <g key={company.name}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 14 : 10}
                  fill={getSectorColor(company.sector)}
                  opacity={0.85}
                  stroke={getSectorColor(company.sector)}
                  strokeWidth="1.5"
                  className="company-dot"
                  onMouseEnter={() => setHoveredCompany(company.name)}
                  onMouseLeave={() => setHoveredCompany(null)}
                />

                {/* Labels for Stars only */}
                {isStar && (
                  <text
                    x={cx}
                    y={cy - 18}
                    textAnchor="middle"
                    fill="white"
                    fontSize="9px"
                    fontWeight="600"
                    pointerEvents="none"
                  >
                    {company.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="quadrant-legend">
          <div className="legend-item">
            <span
              className="legend-dot"
              style={{ backgroundColor: '#4A9EFF' }}
            ></span>
            <span>SaaS / B2B</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-dot"
              style={{ backgroundColor: '#00D68F' }}
            ></span>
            <span>EV & Mobility</span>
          </div>
        </div>
      </div>

      <div className="chart-footnote">
        ℹ️ DeepTech companies excluded — metric not applicable
      </div>
    </div>
  );
};

export default EfficiencyQuadrant;
