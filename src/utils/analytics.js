// Analytics engine for VC metrics calculations - production grade

export const calculateMetrics = (startups) => {
  return startups.map(startup => {
    // Parse core metrics from CSV
    const arr = parseFloat(startup.ARR) || 0;
    const arrPrevYear = parseFloat(startup.ARR_PrevYear) || 0;
    const mrr = parseFloat(startup.Revenue_Monthly) || 0;
    const cogs = parseFloat(startup.COGS) || 0;
    const expenses = parseFloat(startup.Expenses) || 0;
    const burnRate = parseFloat(startup.Burn_Rate) || 0;
    const cashBalance = parseFloat(startup.Cash_Balance) || 0;
    const salesMarketingSpend = parseFloat(startup.Sales_Marketing_Spend) || 0;
    const cac = parseFloat(startup.CAC) || 0;
    const ltv = parseFloat(startup.LTV) || 0;
    const users = parseFloat(startup.Users) || 0;
    const newCustomers = parseFloat(startup.New_Customers_Monthly) || 0;

    // Investment metrics
    const investmentAmount = parseFloat(startup.Investment_Amount) || 0;
    const entryValuation = parseFloat(startup.Entry_Valuation) || 0;
    const lastRoundValuation = parseFloat(startup.Last_Round_Valuation) || 0;
    const ownershipPct = parseFloat(startup.Ownership_Pct) || 0;

    // Sector read directly from CSV
    const sector = startup.Sector || 'Other';

    // ===== GROWTH METRICS =====

    // YoY Growth: (ARR - ARR_PrevYear) / ARR_PrevYear
    let yoyGrowth = null;
    if (arrPrevYear > 0) {
      yoyGrowth = parseFloat((((arr - arrPrevYear) / arrPrevYear) * 100).toFixed(1));
    }

    // MoM Growth: no prior month data = null (don't fake it)
    const momGrowth = null; // Would need Revenue_Monthly_PrevMonth from CSV

    // ===== MARGIN ANALYSIS =====

    // Gross Margin: (Revenue_Monthly - COGS) / Revenue_Monthly
    // Returns null if COGS is missing or zero (can't calculate without COGS)
    let grossMargin = null;
    if (mrr > 0 && cogs > 0) {
      grossMargin = parseFloat((((mrr - cogs) / mrr) * 100).toFixed(1));
    }

    // Net Margin: (Revenue_Monthly - Expenses) / Revenue_Monthly
    let netMargin = 0;
    if (mrr > 0) {
      netMargin = parseFloat((((mrr - expenses) / mrr) * 100).toFixed(1));
    }

    // ===== EFFICIENCY METRICS =====

    // Net New ARR
    const netNewARR = arr - arrPrevYear;

    // Magic Number: Net_New_ARR / Sales_Marketing_Spend
    // Returns null if Sales_Marketing_Spend is 0 or missing
    let magicNumber = null;
    if (salesMarketingSpend > 0) {
      magicNumber = parseFloat((netNewARR / salesMarketingSpend).toFixed(2));
    }

    // Burn Multiple: Math.abs(Burn_Rate * 12) / (ARR - ARR_PrevYear)
    let burnMultiple = 0;
    if (netNewARR > 0) {
      burnMultiple = parseFloat((Math.abs(burnRate * 12) / netNewARR).toFixed(2));
    }

    // Rule of 40
    const ruleOf40 = yoyGrowth !== null ? parseFloat((yoyGrowth + netMargin).toFixed(1)) : null;

    // CAC Payback (months)
    let cacPayback = null;
    if (cac > 0 && mrr > 0 && newCustomers > 0 && grossMargin !== null) {
      const mrrPerCustomer = mrr / newCustomers;
      const grossMarginDecimal = grossMargin / 100;
      if (mrrPerCustomer * grossMarginDecimal > 0) {
        cacPayback = parseFloat(((cac * newCustomers) / (mrrPerCustomer * grossMarginDecimal)).toFixed(1));
      }
    }

    // ===== FINANCIAL HEALTH =====

    // Runway: Cash_Balance / Math.abs(Burn_Rate)
    let runway = null;
    if (burnRate < 0 && cashBalance > 0) {
      runway = parseFloat((cashBalance / Math.abs(burnRate)).toFixed(1));
    } else if (burnRate >= 0) {
      runway = 999; // Not burning cash
    }

    // ===== VALUATION METRICS =====

    // MOIC: (Last_Round_Valuation * Ownership_Pct / 100) / Investment_Amount
    let moic = 0;
    if (investmentAmount > 0 && lastRoundValuation > 0 && ownershipPct > 0) {
      const currentValue = (lastRoundValuation * ownershipPct) / 100;
      moic = parseFloat((currentValue / investmentAmount).toFixed(2));
    }

    // Revenue multiple based on sector
    // Skip SaaS scoring for DeepTech / Aerospace (different valuation model)
    let revenueMultiple = null;
    let impliedValuation = 0;
    const isDeepTech = sector && sector.toLowerCase().includes('deeptech');

    if (!isDeepTech) {
      revenueMultiple = determineMultiple(sector, yoyGrowth, grossMargin, magicNumber);
      // Implied Valuation: ARR × Multiple
      if (arr > 0 && revenueMultiple > 0) {
        impliedValuation = parseFloat((arr * revenueMultiple).toFixed(0));
      }
    }

    // ===== UNIT ECONOMICS =====

    const arpu = users > 0 ? parseFloat((arr / users / 12).toFixed(0)) : 0;
    const ltvcacRatio = cac > 0 ? parseFloat((ltv / cac).toFixed(2)) : 0;

    // ===== HEALTH SCORES (0-100) =====

    let growthScore = 0;
    if (yoyGrowth !== null) {
      growthScore = Math.min(100, yoyGrowth > 100 ? 95 : yoyGrowth * 0.8);
    }

    const efficiencyScore = Math.min(
      100,
      (magicNumber * 50 + (ltvcacRatio > 3 ? 50 : ltvcacRatio * 16.67))
    );

    const marginScore = grossMargin !== null ? Math.min(100, grossMargin) : 0;

    let runwayScore = 0;
    if (runway !== null) {
      runwayScore = Math.min(100, runway > 18 ? 100 : runway * 5.56);
    }

    // ===== COMPOSITE SCORES =====

    // Skip investor scoring for DeepTech (use alternative models)
    let operationalHealth = null;
    let investorScore = null;

    if (!isDeepTech) {
      operationalHealth = (growthScore + efficiencyScore + marginScore) / 3;
      // Investor Score: 35% growth, 30% efficiency, 20% margin, 15% runway
      investorScore = (
        growthScore * 0.35 +
        efficiencyScore * 0.3 +
        marginScore * 0.2 +
        runwayScore * 0.15
      );
    }

    // Determine stage and tier
    const stage = determineStage(arr, burnRate, runway);
    const tier = investorScore !== null ? determineTier(investorScore) : null;

    return {
      ...startup,
      // Core metrics
      arr,
      arrPrevYear,
      mrr,
      cogs,
      expenses,
      burnRate,
      cashBalance,
      salesMarketingSpend,
      cac,
      ltv,
      users,

      // Investment metrics
      investmentAmount,
      entryValuation,
      lastRoundValuation,
      ownershipPct,

      // Growth
      momGrowth,
      yoyGrowth,

      // Margins
      grossMargin,
      netMargin,

      // Efficiency
      magicNumber,
      burnMultiple,
      ruleOf40,
      cacPayback,
      ltvcacRatio,
      netNewARR,

      // Financial health
      runway,

      // Valuation
      revenueMultiple: revenueMultiple !== null ? parseFloat(revenueMultiple.toFixed(1)) : null,
      impliedValuation,
      moic,

      // Unit economics
      arpu,

      // Scores
      growthScore: parseFloat(growthScore.toFixed(0)),
      efficiencyScore: parseFloat(efficiencyScore.toFixed(0)),
      marginScore: parseFloat(marginScore.toFixed(0)),
      runwayScore: parseFloat(runwayScore.toFixed(0)),
      operationalHealth: operationalHealth !== null ? parseFloat(operationalHealth.toFixed(0)) : null,
      investorScore: investorScore !== null ? parseFloat(investorScore.toFixed(0)) : null,

      // Classification
      sector,
      stage,
      tier
    };
  });
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

const determineMultiple = (sector, growth, margin, magic) => {
  let baseMultiple = 5;

  // Sector premiums - using includes for flexible sector names
  const sectorLower = (sector || '').toLowerCase();
  if (sectorLower.includes('saas')) baseMultiple = 12;
  else if (sectorLower.includes('fintech')) baseMultiple = 10;
  else if (sectorLower.includes('edtech')) baseMultiple = 6;
  else if (sectorLower.includes('ev') || sectorLower.includes('mobility')) baseMultiple = 8;
  else if (sectorLower.includes('e-commerce') || sectorLower.includes('ecommerce')) baseMultiple = 3;
  else if (sectorLower.includes('deeptech') || sectorLower.includes('deep tech') || sectorLower.includes('aerospace')) baseMultiple = 15;

  // Growth premium - only if growth exists
  if (growth !== null) {
    if (growth > 150) baseMultiple *= 1.5;
    else if (growth > 100) baseMultiple *= 1.3;
    else if (growth > 50) baseMultiple *= 1.1;
  }

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

  // Core portfolio metrics
  const totalARR = startups.reduce((sum, s) => sum + (s.arr || 0), 0);
  const totalUsers = startups.reduce((sum, s) => sum + (s.users || 0), 0);

  // Growth and margin
  const validGrowth = startups.filter(s => s.yoyGrowth !== null);
  const avgGrowth = validGrowth.length > 0
    ? validGrowth.reduce((sum, s) => sum + s.yoyGrowth, 0) / validGrowth.length
    : 0;
  const avgMargin = startups.reduce((sum, s) => sum + (s.grossMargin || 0), 0) / total;

  // Valuation
  const totalValuation = startups.reduce((sum, s) => sum + (s.impliedValuation || 0), 0);
  const avgInvestorScore = startups.reduce((sum, s) => sum + (s.investorScore || 0), 0) / total;

  // Investment metrics
  const totalInvested = startups.reduce((sum, s) => sum + (s.investmentAmount || 0), 0);
  const totalPortfolioValue = startups.reduce((sum, s) => {
    const currentValue = ((s.lastRoundValuation || 0) * (s.ownershipPct || 0)) / 100;
    return sum + currentValue;
  }, 0);

  // MOIC: weighted average by investment amount
  let totalMOIC = 0;
  const moicWeightedSum = startups.reduce((sum, s) => {
    return sum + ((s.moic || 0) * (s.investmentAmount || 0));
  }, 0);
  if (totalInvested > 0) {
    totalMOIC = parseFloat((moicWeightedSum / totalInvested).toFixed(2));
  }

  // Health indicators
  const healthyRunway = startups.filter(s => s.runway !== null && s.runway > 12).length;
  const strongLTV = startups.filter(s => (s.ltvcacRatio || 0) > 3).length;
  const highGrowth = startups.filter(s => s.yoyGrowth !== null && s.yoyGrowth > 50).length;

  // Portfolio health calculation
  const runwayRatio = total > 0 ? healthyRunway / total : 0;
  const ltvRatio = total > 0 ? strongLTV / total : 0;
  const growthRatio = total > 0 ? highGrowth / total : 0;

  return {
    total,
    totalARR,
    totalUsers,
    avgGrowth: parseFloat(avgGrowth.toFixed(1)),
    avgMargin: parseFloat(avgMargin.toFixed(1)),
    totalValuation,
    avgInvestorScore: parseFloat(avgInvestorScore.toFixed(0)),

    // Investment metrics
    totalInvested,
    totalPortfolioValue,
    totalMOIC,

    // Health indicators
    healthyRunway,
    strongLTV,
    highGrowth,
    portfolioHealth: parseFloat(((runwayRatio * 0.33 + ltvRatio * 0.33 + growthRatio * 0.34) * 100).toFixed(0))
  };
};

export const getSectorAnalysis = (startups) => {
  const sectors = {};

  startups.forEach(s => {
    const sector = s.sector || 'Other';
    if (!sectors[sector]) {
      sectors[sector] = {
        count: 0,
        totalARR: 0,
        avgGrowth: 0,
        avgMargin: 0,
        avgMultiple: 0,
        avgScore: 0,
        totalMOIC: 0,
        totalRuleOf40: 0,
        totalLtvCac: 0,
        companies: []
      };
    }

    sectors[sector].count++;
    sectors[sector].totalARR += s.arr || 0;
    if (s.yoyGrowth !== null) {
      sectors[sector].avgGrowth += s.yoyGrowth;
    }
    sectors[sector].avgMargin += s.grossMargin || 0;
    sectors[sector].avgMultiple += s.revenueMultiple || 0;
    sectors[sector].avgScore += s.investorScore || 0;
    sectors[sector].totalMOIC += s.moic || 0;
    if (s.ruleOf40 !== null) {
      sectors[sector].totalRuleOf40 += s.ruleOf40;
    }
    sectors[sector].totalLtvCac += s.ltvcacRatio || 0;
    sectors[sector].companies.push(s.Startup);
  });

  Object.keys(sectors).forEach(key => {
    const count = sectors[key].count;
    sectors[key].avgGrowth = parseFloat((sectors[key].avgGrowth / count).toFixed(1));
    sectors[key].avgMargin = parseFloat((sectors[key].avgMargin / count).toFixed(1));
    sectors[key].avgMultiple = parseFloat((sectors[key].avgMultiple / count).toFixed(1));
    sectors[key].avgScore = parseFloat((sectors[key].avgScore / count).toFixed(0));
    sectors[key].totalMOIC = parseFloat((sectors[key].totalMOIC / count).toFixed(2));
    sectors[key].avgRuleOf40 = parseFloat((sectors[key].totalRuleOf40 / count).toFixed(1));
    sectors[key].avgLtvCac = parseFloat((sectors[key].totalLtvCac / count).toFixed(2));
  });

  return sectors;
};

export const formatCurrency = (value) => {
  // Consistent scaling: >= 1e7 (10M) always use Crores, don't mix B/Cr/M
  if (value >= 1e7) return `₹${(value / 1e7).toFixed(1)}Cr`;
  if (value >= 1e6) return `₹${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `₹${(value / 1e3).toFixed(0)}K`;
  return `₹${value.toFixed(0)}`;
};

export const formatPercent = (value) => {
  if (value === null || isNaN(value)) return 'N/A';
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
};

export const formatNumber = (value) => {
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
  return value.toFixed(0);
};
