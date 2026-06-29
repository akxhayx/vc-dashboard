import React from 'react';
import { motion } from 'framer-motion';

const SectorHeatmap = ({ sectors }) => {
  const sectorArray = Object.entries(sectors).map(([name, data]) => ({
    name,
    ...data
  }));

  const maxScore = Math.max(...sectorArray.map(s => s.avgScore));
  const minScore = Math.min(...sectorArray.map(s => s.avgScore));

  const getHeatColor = (score) => {
    const normalized = (score - minScore) / (maxScore - minScore);
    if (normalized > 0.66) return 'var(--heat-high)';
    if (normalized > 0.33) return 'var(--heat-mid)';
    return 'var(--heat-low)';
  };

  const getIntensity = (score) => {
    return ((score - minScore) / (maxScore - minScore)) * 0.6 + 0.2;
  };

  return (
    <div className="sector-heatmap">
      <div className="heatmap-header">
        <h3>Sector Performance Matrix</h3>
        <div className="heatmap-legend">
          <span>Low</span>
          <div className="legend-gradient"></div>
          <span>High</span>
        </div>
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
              backgroundColor: getHeatColor(sector.avgScore),
              opacity: getIntensity(sector.avgScore)
            }}
          >
            <div className="cell-header">
              <span className="cell-sector">{sector.name}</span>
              <span className="cell-count">{sector.count}</span>
            </div>
            <div className="cell-metrics">
              <div className="cell-metric">
                <span className="metric-label">Growth</span>
                <span className="metric-value">{sector.avgGrowth}%</span>
              </div>
              <div className="cell-metric">
                <span className="metric-label">Margin</span>
                <span className="metric-value">{sector.avgMargin}%</span>
              </div>
              <div className="cell-metric">
                <span className="metric-label">Multiple</span>
                <span className="metric-value">{sector.avgMultiple}x</span>
              </div>
            </div>
            <div className="cell-score">{sector.avgScore}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SectorHeatmap;
