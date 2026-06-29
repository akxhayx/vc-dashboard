import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KPICard from './components/KPICard';
import SectorHeatmap from './components/SectorHeatmap';
import EfficiencyMatrix from './components/EfficiencyMatrix';
import RunwayGauge from './components/charts/RunwayGauge';
import ValuationBubble from './components/charts/ValuationBubble';
import StartupTable from './components/StartupTable';
import FileUpload from './components/FileUpload';
import { parseCSV, validateStartupData } from './utils/csvParser';
import { calculateMetrics, getPortfolioMetrics, getSectorAnalysis, formatCurrency, formatPercent, formatNumber } from './utils/analytics';
import './App.css';

function App() {
  const [startups, setStartups] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [sectors, setSectors] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    // Load default CSV on mount
    loadDefaultData();
  }, []);

  const loadDefaultData = async () => {
    try {
      const response = await fetch('/startups.csv');
      const text = await response.text();
      const blob = new Blob([text], { type: 'text/csv' });
      const file = new File([blob], 'startups.csv', { type: 'text/csv' });
      await handleFileUpload(file);
    } catch (err) {
      console.error('Failed to load default data:', err);
      setError('Failed to load default portfolio data');
    }
  };

  const handleFileUpload = async (file) => {
    setIsProcessing(true);
    setError(null);

    try {
      const data = await parseCSV(file);
      const validatedData = validateStartupData(data);

      const enriched = calculateMetrics(validatedData);
      const portfolioMetrics = getPortfolioMetrics(enriched);
      const sectorMetrics = getSectorAnalysis(enriched);

      // DEBUG: Log first 5 companies' key metrics
      console.log('=== DATA VERIFICATION ===');
      console.log('First 5 companies:');
      enriched.slice(0, 5).forEach((s, i) => {
        console.log(`${i + 1}. ${s.Startup}`, {
          runway: s.runway,
          grossMargin: s.grossMargin,
          magicNumber: s.magicNumber,
          sector: s.sector,
          arr: s.arr,
          impliedValuation: s.impliedValuation,
          moic: s.moic
        });
      });

      setStartups(enriched);
      setPortfolio(portfolioMetrics);
      setSectors(sectorMetrics);
    } catch (err) {
      setError(err.message);
      console.error('Error processing file:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!startups) {
    return (
      <div className="app">
        <div className="upload-container">
          <FileUpload onFileUpload={handleFileUpload} isProcessing={isProcessing} />
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="logo">
              <span className="logo-icon">◆</span>
              Akshaye's Portfolio Dashboard
            </h1>
            <div className="header-meta">
              <span className="portfolio-count">{portfolio.total} companies</span>
              <span className="separator">•</span>
              <span className="valuation-total">{formatCurrency(portfolio.totalValuation)}</span>
            </div>
          </div>
          <div className="header-right">
            <button 
              className="upload-new-btn"
              onClick={() => {
                setStartups(null);
                setError(null);
              }}
            >
              Upload New CSV
            </button>
          </div>
        </div>
      </header>

      <nav className="nav">
        <button
          className={`nav-btn ${activeView === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveView('overview')}
        >
          Overview
        </button>
        <button
          className={`nav-btn ${activeView === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveView('performance')}
        >
          Performance
        </button>
        <button
          className={`nav-btn ${activeView === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveView('portfolio')}
        >
          Portfolio
        </button>
      </nav>

      <main className="main">
        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <section className="section">
                <h2 className="section-title">Portfolio Snapshot</h2>
                <div className="kpi-grid">
                  <KPICard
                    label="Total ARR"
                    value={formatCurrency(portfolio.totalARR)}
                    subtitle={`${formatNumber(portfolio.totalUsers)} users`}
                    trend={portfolio.avgGrowth}
                    trendLabel="avg growth"
                    delay={0}
                  />
                  <KPICard
                    label="Weighted Avg MOIC"
                    value={`${portfolio.totalMOIC.toFixed(1)}x`}
                    subtitle="multiple on invested capital"
                    trend={portfolio.totalMOIC - 2}
                    delay={0.1}
                  />
                  <KPICard
                    label="Total Portfolio Value"
                    value={formatCurrency(portfolio.totalPortfolioValue)}
                    subtitle="current position value"
                    trend={portfolio.totalInvested > 0 ? ((portfolio.totalPortfolioValue - portfolio.totalInvested) / portfolio.totalInvested) * 100 : 0}
                    trendLabel="return"
                    delay={0.2}
                  />
                  <KPICard
                    label="Strong Unit Economics"
                    value={portfolio.strongLTV}
                    subtitle="LTV/CAC > 3x"
                    trend={((portfolio.strongLTV / portfolio.total) * 100) - 50}
                    delay={0.3}
                  />
                </div>
              </section>

              <section className="section">
                <SectorHeatmap sectors={sectors} />
              </section>

              <section className="section">
                <div className="chart-grid">
                  <ValuationBubble startups={startups} />
                </div>
              </section>
            </motion.div>
          )}

          {activeView === 'performance' && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <section className="section">
                <h2 className="section-title">Efficiency & Growth Metrics</h2>
                <div className="kpi-grid-wide">
                  <KPICard
                    label="High Growth Cos."
                    value={portfolio.highGrowth}
                    subtitle=">50% YoY growth"
                    delay={0}
                  />
                  <KPICard
                    label="Avg Growth Rate"
                    value={formatPercent(portfolio.avgGrowth)}
                    subtitle="year over year"
                    trend={portfolio.avgGrowth}
                    delay={0.1}
                  />
                  <KPICard
                    label="Median Revenue Multiple"
                    value={`${(() => {
                      const sorted = [...startups].map(s => s.revenueMultiple).sort((a, b) => a - b);
                      const mid = Math.floor(sorted.length / 2);
                      return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
                    })().toFixed(1)}x`}
                    subtitle="ARR valuation"
                    delay={0.2}
                  />
                  <KPICard
                    label="Total Invested"
                    value={formatCurrency(portfolio.totalInvested)}
                    subtitle="capital deployed"
                    trend={portfolio.totalPortfolioValue > 0 ? ((portfolio.totalPortfolioValue - portfolio.totalInvested) / portfolio.totalInvested) * 100 : 0}
                    trendLabel="gain"
                    delay={0.3}
                  />
                </div>
              </section>

              <section className="section">
                <EfficiencyMatrix startups={startups} />
              </section>

              <section className="section">
                <RunwayGauge startups={startups} />
              </section>
            </motion.div>
          )}

          {activeView === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <section className="section">
                <h2 className="section-title">Company Comparison</h2>
                <StartupTable startups={startups} />
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="footer">
        <span>Venture Intelligence Platform</span>
        <span className="separator">•</span>
        <span>Data refreshed: {new Date().toLocaleDateString()}</span>
      </footer>
    </div>
  );
}

export default App;
