import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatPercent } from '../utils/analytics';

const StartupTable = ({ startups }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'investorScore', direction: 'desc' });
  const [filterSector, setFilterSector] = useState('all');
  const [selectedStartups, setSelectedStartups] = useState([]);

  const sectors = ['all', ...new Set(startups.map(s => s.sector))];

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getSortedData = () => {
    let filtered = filterSector === 'all' 
      ? startups 
      : startups.filter(s => s.sector === filterSector);

    return [...filtered].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      const modifier = sortConfig.direction === 'asc' ? 1 : -1;
      return (aVal < bVal ? -1 : 1) * modifier;
    });
  };

  const toggleStartup = (name) => {
    setSelectedStartups(prev => 
      prev.includes(name) 
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const sortedData = getSortedData();

  const columns = [
    { key: 'Startup', label: 'Company', width: '180px' },
    { key: 'sector', label: 'Sector', width: '140px' },
    { key: 'arr', label: 'ARR', width: '120px', format: formatCurrency },
    { key: 'yoyGrowth', label: 'YoY Growth', width: '110px', format: formatPercent },
    { key: 'grossMargin', label: 'Margin', width: '100px', format: v => `${v.toFixed(0)}%` },
    { key: 'ltvcacRatio', label: 'LTV/CAC', width: '100px', format: v => `${v.toFixed(1)}x` },
    { key: 'runway', label: 'Runway', width: '100px', format: v => `${v.toFixed(0)}m` },
    { key: 'revenueMultiple', label: 'Multiple', width: '100px', format: v => `${v.toFixed(1)}x` },
    { key: 'investorScore', label: 'Score', width: '90px', format: v => v.toFixed(0) }
  ];

  const getTierBadge = (tier) => {
    const colors = {
      'Tier 1': 'var(--success)',
      'Tier 2': 'var(--warning)',
      'Tier 3': 'var(--text-tertiary)'
    };
    return (
      <span className="tier-badge" style={{ color: colors[tier] }}>
        {tier}
      </span>
    );
  };

  return (
    <div className="startup-table-container">
      <div className="table-controls">
        <div className="sector-filters">
          {sectors.map(sector => (
            <button
              key={sector}
              className={`filter-btn ${filterSector === sector ? 'active' : ''}`}
              onClick={() => setFilterSector(sector)}
            >
              {sector === 'all' ? 'All Sectors' : sector}
            </button>
          ))}
        </div>
        {selectedStartups.length > 0 && (
          <div className="selection-info">
            {selectedStartups.length} selected
            <button onClick={() => setSelectedStartups([])}>Clear</button>
          </div>
        )}
      </div>

      <div className="table-wrapper">
        <table className="startup-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              {columns.map(col => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  onClick={() => handleSort(col.key)}
                  className="sortable"
                >
                  <div className="th-content">
                    {col.label}
                    {sortConfig.key === col.key && (
                      <span className="sort-indicator">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {sortedData.map((startup, index) => (
                <motion.tr
                  key={startup.Startup}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className={selectedStartups.includes(startup.Startup) ? 'selected' : ''}
                  onClick={() => toggleStartup(startup.Startup)}
                >
                  <td>
                    <div className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={selectedStartups.includes(startup.Startup)}
                        onChange={() => {}}
                      />
                    </div>
                  </td>
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.key === 'Startup' ? (
                        <div className="company-cell">
                          <span className="company-name">{startup.Startup}</span>
                          {getTierBadge(startup.tier)}
                        </div>
                      ) : col.format ? (
                        <span className={col.key.includes('Growth') && startup[col.key] > 50 ? 'highlight-positive' : ''}>
                          {col.format(startup[col.key])}
                        </span>
                      ) : (
                        startup[col.key]
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StartupTable;
