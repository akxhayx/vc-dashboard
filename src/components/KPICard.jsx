import React from 'react';
import { motion } from 'framer-motion';

const KPICard = ({ 
  label, 
  value, 
  subtitle, 
  trend, 
  trendLabel,
  icon,
  delay = 0,
  variant = 'default'
}) => {
  const getTrendColor = () => {
    if (!trend) return 'var(--text-tertiary)';
    if (variant === 'inverse') {
      return trend > 0 ? 'var(--error)' : 'var(--success)';
    }
    return trend > 0 ? 'var(--success)' : 'var(--error)';
  };

  return (
    <motion.div
      className="kpi-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="kpi-header">
        <span className="kpi-label">{label}</span>
        {icon && <span className="kpi-icon">{icon}</span>}
      </div>
      <div className="kpi-value">{value}</div>
      {subtitle && <div className="kpi-subtitle">{subtitle}</div>}
      {trend !== undefined && (
        <div className="kpi-trend" style={{ color: getTrendColor() }}>
          <span className="kpi-trend-arrow">
            {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'}
          </span>
          <span className="kpi-trend-value">
            {Math.abs(trend).toFixed(1)}%
          </span>
          {trendLabel && <span className="kpi-trend-label">{trendLabel}</span>}
        </div>
      )}
    </motion.div>
  );
};

export default KPICard;
