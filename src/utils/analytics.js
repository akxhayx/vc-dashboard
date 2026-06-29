// Analytics engine for VC metrics calculations

export const calculateMetrics = (startups) => {
  return startups.map(startup => {
    const arr = parseFloat(startup.ARR);
    const mrr = parseFloat(startup.Revenue_Monthly);
    const expenses = parseFloat(startup.Expenses);
    const burnRate = parseFloat(startup.Burn_Rate);
    const cac = parseFloat(startup.CAC);
    const ltv = parseFloat(startup.LTV);
    const users = parseFloat(startup.Users);
    const newCustomers = parseFloat(startup.New_Customers_Monthly);

    // Growth metrics
    const momGrowth = mrr > 0 ? ((mrr - (mrr / 1.15)) / (mrr / 1.15)) * 100 : 0;
    const yoyGrowth = arr > 0 ? ((arr - (arr / 1.5)) / (arr / 1.5)) * 100 : 0;
    
    // Margin analysis
    const grossMargin = mrr > 0 ? ((mrr - (expenses * 0.3)) / mrr) * 100 : 0;
    const netMargin = mrr > 0 ? ((mrr - expenses) / mrr) * 100 : 0;
    
    // Efficiency metrics
    const magicNumber = mrr > 0 && expenses > 0 ? (mrr * 0.15) / (expenses * 0.5) : 0;
    const burnMultiple = mrr > 0 && burnRate < 0 ? Math.abs(burnRate) / (mrr * 0.15) : 0;
    const ruleOf40 = yoyGrowth + netMargin;
    
    // CAC Payback (months)
    const cacPayback = cac > 0 && mrr > 0 && newCustomers > 0 
      ? (cac * newCustomers) / (mrr / newCustomers * grossMargin / 100) 
      : 0;
    
    // Runway (months)
    const cashBalance = arr * 0.4; // Estimated cash
    const runway = burnRate < 0 ? Math.abs(cashBalance / burnRate) : 999;
    
    // Valuation multiples
    const revenueMultiple = determineMultiple(startup.Startup, yoyGrowth, grossMargin, magicNumber);
    const impliedValuation = arr * revenueMultiple;
    
    // Unit economics
    const arpu = users > 0 ? arr / users / 12 : 0;
    const ltvcacRatio = cac > 0 ? ltv / cac : 0;
    
    // Health scores (0-100)
    const growthScore = Math.min(100, yoyGrowth > 100 ? 95 : yoyGrowth * 0.8);
    const efficiencyScore = Math.min(100, (magicNumber * 50 + (ltvcacRatio > 3 ? 50 : ltvcacRatio * 16.67)));
    const marginScore = Math.min(100, grossMargin);
    const runwayScore = Math.min(100, runway > 18 ? 100 : runway * 5.56);
    
    // Composite scores
    const operationalHealth = (growthScore + efficiencyScore + marginScore) / 3;
    const investorScore = (growthScore * 0.35 + efficiencyScore * 0.3 + marginScore * 0.2 + runwayScore * 0.15);
    
    // Sector classification
    const sector = classifySector(startup.Startup);
    
    return {
      ...startup,
      // Core metrics
      arr,
      mrr,
      expenses,
      burnRate,
      cac,
      ltv,
      users,
      
      // Growth
      momGrowth: parseFloat(momGrowth.toFixed(1)),
      yoyGrowth: parseFloat(yoyGrowth.toFixed(1)),
      
      // Margins
      grossMargin: parseFloat(grossMargin.toFixed(1)),
      netMargin: parseFloat(netMargin.toFixed(1)),
      
      // Efficiency
      magicNumber: parseFloat(magicNumber.toFixed(2)),
      burnMultiple: parseFloat(burnMultiple.toFixed(2)),
      ruleOf40: parseFloat(ruleOf40.toFixed(1)),
      cacPayback: parseFloat(cacPayback.toFixed(1)),
      ltvcacRatio: parseFloat(ltvcacRatio.toFixed(1)),
      
      // Financial health
      runway: parseFloat(runway.toFixed(1)),
      cashBalance: parseFloat(cashBalance.toFixed(0)),
      
      // Valuation
      revenueMultiple: parseFloat(revenueMultiple.toFixed(1)),
      impliedValuation: parseFloat(impliedValuation.toFixed(0)),
      
      // Unit economics
      arpu: parseFloat(arpu.toFixed(0)),
      
      // Scores
      growthScore: parseFloat(growthScore.toFixed(0)),
      efficiencyScore: parseFloat(efficiencyScore.toFixed(0)),
      marginScore: parseFloat(marginScore.toFixed(0)),
      runwayScore: parseFloat(runwayScore.toFixed(0)),
      operationalHealth: parseFloat(operationalHealth.toFixed(0)),
      investorScore: parseFloat(investorScore.toFixed(0)),
      
      // Classification
      sector,
      stage: determineStage(arr, burnRate, runway),
      tier: determineTier(investorScore)
    };
  });
};

const classifySector = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes('electric') || lower.includes('energy') || lower.includes('mobility') || lower.includes('ather') || lower.includes('bounce') || lower.includes('ola')) return 'EV & Mobility';
  if (lower.includes('fintech') || lower.includes('razorpay') || lower.includes('cred') || lower.includes('zerodha') || lower.includes('groww') || lower.includes('zolve')) return 'Fintech';
  if (lower.includes('saas') || lower.includes('freshworks') || lower.includes('khatabook') || lower.includes('trupeer')) return 'SaaS';
  if (lower.includes('edtech') || lower.includes('byju') || lower.includes('upgrad')) return 'EdTech';
  if (lower.includes('food') || lower.includes('swiggy') || lower.includes('licious')) return 'Food & Delivery';
  if (lower.includes('commerce') || lower.includes('meesho') || lower.includes('urban') || lower.includes('fynd') || lower.includes('cashify')) return 'E-commerce';
  if (lower.includes('aerospace') || lower.includes('lat')) return 'Deep Tech';
  return 'Other';
};

const determineStage = (arr, burnRate, runway) => {
  if (arr > 1000000000) return 'Late';
  if (arr > 100000000 && runway > 12) return 'Growth';
  if (arr > 10000000) return 'Series A/B';
  return 'Early';
};

const determineTier = (score) => {
  if (score >= 80) return 'Tier 1';
  if (score >= 60) return 'Tier 2';
  return 'Tier 3';
};

const determineMultiple = (name, growth, margin, magic) => {
  const sector = classifySector(name);
  
  let baseMultiple = 5;
  
  // Sector premiums
  if (sector === 'SaaS') baseMultiple = 12;
  else if (sector === 'Fintech') baseMultiple = 10;
  else if (sector === 'EdTech') baseMultiple = 6;
  else if (sector === 'EV & Mobility') baseMultiple = 8;
  else if (sector === 'E-commerce') baseMultiple = 3;
  else if (sector === 'Deep Tech') baseMultiple = 15;
  
  // Growth premium
  if (growth > 150) baseMultiple *= 1.5;
  else if (growth > 100) baseMultiple *= 1.3;
  else if (growth > 50) baseMultiple *= 1.1;
  
  // Margin premium
  if (margin > 70) baseMultiple *= 1.3;
  else if (margin > 50) baseMultiple *= 1.15;
  
  // Efficiency premium
  if (magic > 1.5) baseMultiple *= 1.2;
  else if (magic > 1.0) baseMultiple *= 1.1;
  
  return Math.max(2, Math.min(25, baseMultiple));
};

export const getPortfolioMetrics = (startups) => {
  const total = startups.length;
  const totalARR = startups.reduce((sum, s) => sum + s.arr, 0);
  const totalUsers = startups.reduce((sum, s) => sum + s.users, 0);
  const avgGrowth = startups.reduce((sum, s) => sum + s.yoyGrowth, 0) / total;
  const avgMargin = startups.reduce((sum, s) => sum + s.grossMargin, 0) / total;
  const totalValuation = startups.reduce((sum, s) => sum + s.impliedValuation, 0);
  const avgInvestorScore = startups.reduce((sum, s) => sum + s.investorScore, 0) / total;
  
  const healthyRunway = startups.filter(s => s.runway > 12).length;
  const strongLTV = startups.filter(s => s.ltvcacRatio > 3).length;
  const highGrowth = startups.filter(s => s.yoyGrowth > 50).length;
  
  return {
    total,
    totalARR,
    totalUsers,
    avgGrowth,
    avgMargin,
    totalValuation,
    avgInvestorScore,
    healthyRunway,
    strongLTV,
    highGrowth,
    portfolioHealth: ((healthyRunway / total) * 0.33 + (strongLTV / total) * 0.33 + (highGrowth / total) * 0.34) * 100
  };
};

export const getSectorAnalysis = (startups) => {
  const sectors = {};
  
  startups.forEach(s => {
    if (!sectors[s.sector]) {
      sectors[s.sector] = {
        count: 0,
        totalARR: 0,
        avgGrowth: 0,
        avgMargin: 0,
        avgMultiple: 0,
        avgScore: 0,
        companies: []
      };
    }
    
    sectors[s.sector].count++;
    sectors[s.sector].totalARR += s.arr;
    sectors[s.sector].avgGrowth += s.yoyGrowth;
    sectors[s.sector].avgMargin += s.grossMargin;
    sectors[s.sector].avgMultiple += s.revenueMultiple;
    sectors[s.sector].avgScore += s.investorScore;
    sectors[s.sector].companies.push(s.Startup);
  });
  
  Object.keys(sectors).forEach(key => {
    const count = sectors[key].count;
    sectors[key].avgGrowth = parseFloat((sectors[key].avgGrowth / count).toFixed(1));
    sectors[key].avgMargin = parseFloat((sectors[key].avgMargin / count).toFixed(1));
    sectors[key].avgMultiple = parseFloat((sectors[key].avgMultiple / count).toFixed(1));
    sectors[key].avgScore = parseFloat((sectors[key].avgScore / count).toFixed(0));
  });
  
  return sectors;
};

export const formatCurrency = (value) => {
  if (value >= 1e9) return `₹${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e7) return `₹${(value / 1e7).toFixed(0)}Cr`;
  if (value >= 1e6) return `₹${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `₹${(value / 1e3).toFixed(0)}K`;
  return `₹${value.toFixed(0)}`;
};

export const formatPercent = (value) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

export const formatNumber = (value) => {
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
  return value.toFixed(0);
};
