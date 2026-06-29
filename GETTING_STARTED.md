# 🚀 Getting Started - Venture Intelligence Platform

Welcome to your premium VC intelligence dashboard! This guide will have you up and running in under 5 minutes.

## Quick Start (3 Steps)

### 1. Install Dependencies
```bash
cd vc-dashboard
npm install
```

### 2. Start the Dashboard
```bash
npm run dev
```

### 3. Open Your Browser
Navigate to: `http://localhost:3000`

**That's it!** The dashboard will load with sample Indian startup data.

## Alternative: Use the Start Script

We've included a helpful script:

```bash
./start.sh
```

This will:
- Check your Node.js installation
- Install dependencies if needed
- Give you options to run dev server, build, or preview

## What You'll See

### Default Dashboard
The platform loads with 25 Indian startups across multiple sectors:
- **SaaS**: Freshworks, Khatabook, Trupeer
- **Fintech**: Razorpay, CRED, Zerodha, Groww
- **EV & Mobility**: Ola Electric, Ather Energy, Bounce
- **EdTech**: Byju's, UpGrad
- **E-commerce**: Meesho, Urban Ladder, Swiggy
- And more...

### Three Main Views

#### 1. Overview (Default)
- Portfolio snapshot with 4 key KPIs
- Sector performance heatmap
- Valuation vs revenue scatter plot

#### 2. Performance
- Growth and efficiency metrics
- LTV/CAC vs Magic Number matrix
- Runway analysis with burn rate visualization

#### 3. Portfolio
- Comprehensive startup comparison table
- Sortable by any metric
- Filterable by sector
- Multi-select for detailed comparison

## Uploading Your Data

### Step 1: Prepare Your CSV
Your CSV needs these columns:
```
Startup,Revenue_Monthly,Users,New_Customers_Monthly,CAC,Expenses,ARR,LTV,Burn_Rate
```

Example row:
```
Acme SaaS,5000000,10000,200,1500,4000000,60000000,450000,-1000000
```

### Step 2: Upload
1. Click "Upload New CSV" button in the header
2. Select your CSV file
3. Dashboard processes and displays your data instantly

### Step 3: Explore
- Navigate between views
- Sort and filter companies
- Analyze metrics and trends

## Understanding the Metrics

### Key Performance Indicators (KPIs)

**Total ARR**: Sum of all company ARRs - measures portfolio size

**Portfolio Health**: Composite score based on:
- Companies with >12 months runway
- Companies with LTV/CAC > 3x
- Companies with >50% growth

**Avg Gross Margin**: Average margin across portfolio - profitability indicator

**Strong Unit Economics**: Count of companies with LTV/CAC > 3x

### Growth Metrics
- **YoY Growth**: Year-over-year ARR growth percentage
- **Growth Score**: Normalized score (0-100) based on growth velocity

### Efficiency Metrics
- **Magic Number**: (New ARR × 0.15) ÷ (S&M × 0.5) - sales efficiency
- **LTV/CAC Ratio**: Lifetime value ÷ Customer acquisition cost
- **Burn Multiple**: |Monthly Burn| ÷ Net New ARR - capital efficiency

### Financial Health
- **Runway**: Months of cash remaining at current burn rate
- **Gross Margin**: (Revenue - COGS) ÷ Revenue
- **Net Margin**: (Revenue - Expenses) ÷ Revenue

### Valuation
- **Revenue Multiple**: Varies by sector (SaaS: 8-15x, Fintech: 6-12x, etc.)
- **Implied Valuation**: ARR × Multiple × Premiums

## Navigation Tips

### Sorting the Table
- Click any column header to sort
- Click again to reverse sort order
- Look for ↑ or ↓ arrow indicator

### Filtering by Sector
- Use sector filter buttons above the table
- Click "All Sectors" to reset

### Selecting Companies
- Click row to select/deselect
- Multi-select for side-by-side comparison
- Click "Clear" to deselect all

### Interpreting Color Codes

**Runway Analysis**:
- 🔴 Red: <6 months (Critical)
- 🟡 Yellow: 6-12 months (Watch)
- 🟢 Green: >12 months (Healthy)

**Tier Classification**:
- Tier 1: Score ≥80 (Top performers)
- Tier 2: Score 60-79 (Strong)
- Tier 3: Score <60 (Needs attention)

## Common Tasks

### Task 1: Identify Top Performers
1. Go to Portfolio view
2. Click "Score" column header to sort descending
3. Top companies are your Tier 1 performers

### Task 2: Find Companies Needing Attention
1. Go to Performance view
2. Check Runway Analysis chart
3. Red bars indicate critical runway

### Task 3: Compare Sector Performance
1. Go to Overview
2. Review Sector Heatmap
3. Brighter colors = better performance

### Task 4: Analyze Unit Economics
1. Go to Performance view
2. Review Efficiency Matrix
3. Top-right quadrant = strong unit economics

### Task 5: Assess Valuation Multiples
1. Go to Overview
2. Review Valuation vs Revenue chart
3. Points above reference lines = premium multiples

## Troubleshooting

### Issue: CSV Upload Fails
**Solution**: 
- Check column names match exactly (case-sensitive)
- Ensure all numeric fields contain valid numbers
- Remove commas from numbers
- Save as UTF-8 encoded CSV

### Issue: Metrics Seem Wrong
**Solution**:
- Verify Burn_Rate is negative if burning cash
- Check that ARR = Revenue_Monthly × 12
- Ensure all required fields are filled

### Issue: Dashboard is Slow
**Solution**:
- Limit CSV to <1000 companies
- Use production build: `npm run build && npm run preview`
- Close other browser tabs

### Issue: Charts Not Displaying
**Solution**:
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Clear browser cache
- Check browser console for errors

## Pro Tips

### Keyboard Shortcuts
- `Cmd/Ctrl + R`: Refresh data
- `Tab`: Navigate between sections
- `Escape`: Clear selections

### Data Best Practices
- Update data monthly for accurate trends
- Keep backup of your CSV files
- Use consistent currency (₹) throughout
- Validate data before upload

### Performance Optimization
- Use production build for deployment
- Enable gzip compression on server
- Cache static assets
- Use CDN for faster loading

### Customization
- Edit `src/utils/analytics.js` for metric logic
- Modify `src/App.css` for styling
- Add components in `src/components/`

## Next Steps

### For Daily Use
1. Bookmark your deployed URL
2. Set up monthly data updates
3. Create team access if using shared hosting
4. Configure monitoring/analytics

### For Deployment
1. Read DEPLOYMENT.md for detailed instructions
2. Choose hosting provider (Vercel recommended)
3. Configure custom domain
4. Set up HTTPS

### For Customization
1. Review PROJECT_OVERVIEW.md for architecture
2. Check component files for modification points
3. Test changes in development before deploying
4. Document your customizations

## Getting Help

### Resources
- **README.md**: Complete feature documentation
- **DEPLOYMENT.md**: Deployment and hosting guide
- **PROJECT_OVERVIEW.md**: Technical architecture and metrics
- **Code Comments**: Inline documentation in source files

### Support Channels
1. Check documentation first
2. Review troubleshooting section
3. Validate CSV format
4. Check browser console for errors

## Video Tutorial

### Recommended Learning Path
1. **Day 1**: Install and explore default data (15 min)
2. **Day 2**: Upload your own CSV (10 min)
3. **Day 3**: Learn metric interpretations (30 min)
4. **Day 4**: Customize for your needs (1 hour)
5. **Day 5**: Deploy to production (30 min)

## Checklist for First Use

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Development server running (`npm run dev`)
- [ ] Default data loads successfully
- [ ] All three views accessible
- [ ] CSV prepared with correct format
- [ ] Custom CSV uploads successfully
- [ ] All metrics display correctly
- [ ] Charts render properly
- [ ] Table sorting/filtering works

## Success Criteria

You'll know you're ready when you can:
1. ✅ Load the dashboard in under 3 seconds
2. ✅ Upload your portfolio CSV
3. ✅ Navigate all three views
4. ✅ Sort and filter the company table
5. ✅ Interpret the key metrics
6. ✅ Identify top and bottom performers
7. ✅ Understand the scoring system

## Welcome to Professional VC Intelligence!

You now have an institutional-grade tool for portfolio analysis. Explore the features, customize to your needs, and make data-driven investment decisions.

Need help? All documentation is in the project folder.

Happy analyzing! 🚀📊

---

**Quick Reference Commands**

```bash
# Development
npm run dev          # Start dev server

# Production  
npm run build        # Build for production
npm run preview      # Preview production build

# Deployment
./start.sh          # Interactive setup script
vercel --prod       # Deploy to Vercel
netlify deploy      # Deploy to Netlify
```
