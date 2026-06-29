import React from 'react';
import { motion } from 'framer-motion';

const SectorHeatmap = ({ sectors }) => {
  // Convert sector object to array
  const sectorArray = Object.entries(sectors)
    .map(([name, data]) => ({
      name,
      ...data
    }))
    .filter(s => s.name !== 'Other' && s.avgScore !== null); // Filter out "Other" and DeepTech (null score)

  // New intentional color scheme
  const sectorColors = {
    'SaaS / B2B': '#1E3A5F',       // Dark blue
    'EV & Mobility': '#1A3A2A',    // Dark green
    'DeepTech / Aerospace': '#3A2A0A' // Dark amber
  };

  const getBackgroundColor = (sectorName) => {
    return sectorColors[sectorName] || '#2D2D3D'; // Fallback color
  };

  return (
    <div className="sector-heatmap">
      <div className="heatmap-header">
        <h3>Sector Performance Matrix</h3>
        <p className="heatmap-subtitle">Key metrics by sector</p>
      </div>

      <div className="heatmap-grid">
        {sectorArray.map((sector, index) => (
          <motion.div
            key={sector.name}
            className="heatmap-cell"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            style={{
              backgroundColor: getBackgroundColor(sector.name),
              opacity: 1 // Always full opacity for readability
            }}
          >
            {/* Sector name with company count badge */}
            <div className="cell-header">
              <span className="cell-sector">{sector.name}</span>
              <span className="cell-badge">{sector.count}</span>
            </div>

            {/* Key metrics */}
            <div className="cell-metrics">
              <div className="cell-metric">
                <span className="metric-label">Growth</span>
                <span className="metric-value">
                  {sector.avgGrowth !== null ? `${sector.avgGrowth}%` : 'N/A'}
                </span>
              </div>

              <div className="cell-metric">
                <span className="metric-label">Margin</span>
                <span className="metric-value">
                  {sector.avgMargin < 0 ? 'N/A' : `${sector.avgMargin}%`}
                </span>
              </div>

              <div className="cell-metric">
                <span className="metric-label">Multiple</span>
                <span className="metric-value">
                  {sector.avgMultiple !== null ? `${sector.avgMultiple}x` : 'N/A'}
                </span>
              </div>

              <div className="cell-metric">
                <span className="metric-label">Rule of 40</span>
                <span className="metric-value">
                  {sector.avgRuleOf40 !== null ? sector.avgRuleOf40 : 'N/A'}
                </span>
              </div>
            </div>

            {/* Company pills */}
            <div className="cell-companies">
              <div className="companies-label">Companies:</div>
              <div className="companies-list">
                {sector.companies.slice(0, 3).map((company, i) => (
                  <span key={i} className="company-pill">
                    {company}
                  </span>
                ))}
                {sector.companies.length > 3 && (
                  <span className="company-pill more">
                    +{sector.companies.length - 3}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SectorHeatmap;
