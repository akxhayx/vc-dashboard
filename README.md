# Venture Intelligence Platform

A premium, VC-grade startup intelligence dashboard built for institutional investors. Combines the sophistication of PitchBook with the elegance of Stripe Analytics and the polish of Linear.

![Dashboard Preview](https://img.shields.io/badge/Status-Production_Ready-success)
![React](https://img.shields.io/badge/React-18.2-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

### 🎯 Core Capabilities
- **Portfolio Intelligence**: Real-time metrics across your entire portfolio
- **Sector Analysis**: Heat-mapped performance visualization by industry vertical
- **Efficiency Metrics**: LTV/CAC ratios, Magic Number, Burn Multiple analysis
- **Runway Monitoring**: Critical burn rate and cash position tracking
- **Valuation Models**: Revenue multiple analysis with sector-specific premiums
- **Company Comparison**: Interactive table with multi-dimensional sorting

### 📊 Key Metrics Tracked
- **Growth**: MoM/YoY growth rates, momentum analysis
- **Unit Economics**: CAC, LTV, LTV/CAC ratios, ARPU
- **Efficiency**: Magic Number, Burn Multiple, CAC Payback
- **Financial Health**: Runway, burn rate, cash position, Rule of 40
- **Margins**: Gross margin, net margin analysis
- **Valuation**: Revenue multiples, implied valuation, sector benchmarks

### 🎨 Design Philosophy
- **Dark Mode First**: Refined dark theme optimized for extended viewing
- **Premium Typography**: Instrument Serif + Instrument Sans + JetBrains Mono
- **Sophisticated Layouts**: Generous spacing, elegant component hierarchy
- **Polished Interactions**: Smooth animations, hover states, micro-interactions
- **Data Visualization**: Recharts-powered charts with custom theming

## Tech Stack

- **Frontend**: React 18.2 with Hooks
- **Animations**: Framer Motion for fluid UI transitions
- **Charts**: Recharts for professional data visualization
- **Data Processing**: PapaParse for CSV parsing
- **Build Tool**: Vite for lightning-fast development
- **Styling**: Custom CSS with CSS variables for theming

## Project Structure

```
vc-dashboard/
├── src/
│   ├── components/
│   │   ├── KPICard.jsx              # Metric display cards
│   │   ├── SectorHeatmap.jsx        # Sector performance matrix
│   │   ├── EfficiencyMatrix.jsx     # LTV/CAC vs Magic Number
│   │   ├── RunwayAnalysis.jsx       # Burn rate & runway visualization
│   │   ├── ValuationChart.jsx       # Revenue multiple scatter
│   │   ├── StartupTable.jsx         # Interactive comparison table
│   │   └── FileUpload.jsx           # CSV upload interface
│   ├── utils/
│   │   ├── analytics.js             # Core metrics calculation engine
│   │   └── csvParser.js             # Data parsing & validation
│   ├── App.jsx                      # Main application component
│   ├── App.css                      # Premium dark theme styling
│   └── main.jsx                     # React entry point
├── public/
│   └── startups.csv                 # Sample portfolio data
├── package.json
├── vite.config.js
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dashboard will be available at `http://localhost:3000`

## Usage

### Loading Data

**Default Portfolio**: The dashboard loads with sample Indian startup data on first launch.

**Custom Data**: Click "Upload New CSV" to load your own portfolio data.

### CSV Format

Required columns:
- `Startup` - Company name
- `Revenue_Monthly` - Monthly revenue (₹)
- `Users` - Total user count
- `New_Customers_Monthly` - New customers per month
- `CAC` - Customer acquisition cost (₹)
- `Expenses` - Monthly expenses (₹)
- `ARR` - Annual recurring revenue (₹)
- `LTV` - Customer lifetime value (₹)
- `Burn_Rate` - Monthly burn rate (₹, negative = burning)

Optional columns:
- `CAC_LTV_Ratio` - Will be calculated if not provided

Example CSV structure:
```csv
Startup,Revenue_Monthly,Users,New_Customers_Monthly,CAC,Expenses,ARR,LTV,Burn_Rate
Acme SaaS,5000000,10000,200,1500,4000000,60000000,450000,-1000000
```

### Navigation

- **Overview**: Portfolio snapshot, sector heatmap, valuation analysis
- **Performance**: Efficiency metrics, growth analysis, runway monitoring
- **Portfolio**: Detailed company comparison table with sorting and filtering

## Metrics Explained

### Growth Metrics
- **MoM Growth**: Month-over-month revenue growth
- **YoY Growth**: Year-over-year ARR growth
- **Growth Score**: Composite score (0-100) based on growth velocity

### Unit Economics
- **LTV/CAC Ratio**: Lifetime value to customer acquisition cost (target: >3x)
- **CAC Payback**: Months to recover customer acquisition cost
- **ARPU**: Average revenue per user

### Efficiency Metrics
- **Magic Number**: Sales efficiency = (New ARR × 0.15) / (S&M Spend × 0.5)
  - >1.0 = Excellent
  - 0.75-1.0 = Good
  - <0.75 = Needs improvement
- **Burn Multiple**: Capital efficiency = Net Burn / Net New ARR
  - <1.5x = Excellent
  - 1.5-3x = Good
  - >3x = Concerning
- **Rule of 40**: Growth % + Profit Margin %
  - >40 = Excellent
  - 20-40 = Good
  - <20 = Needs work

### Financial Health
- **Runway**: Months of cash remaining at current burn rate
  - >18 months = Healthy
  - 12-18 months = Adequate
  - 6-12 months = Needs attention
  - <6 months = Critical
- **Gross Margin**: (Revenue - COGS) / Revenue
- **Net Margin**: (Revenue - Expenses) / Revenue

### Valuation
- **Revenue Multiple**: Valuation / ARR
  - SaaS: 8-15x (premium for high-growth, efficient)
  - Fintech: 6-12x
  - E-commerce: 2-5x
  - Deep Tech: 12-20x
- **Implied Valuation**: ARR × Sector Multiple × Growth Premium × Margin Premium

### Scoring System
- **Operational Health**: Average of growth, efficiency, and margin scores
- **Investor Score**: Weighted composite
  - 35% Growth Score
  - 30% Efficiency Score
  - 20% Margin Score
  - 15% Runway Score
- **Tier Classification**:
  - Tier 1: Score ≥80 (Top performers)
  - Tier 2: Score 60-79 (Strong)
  - Tier 3: Score <60 (Needs attention)

## Sector Classification

The analytics engine automatically classifies companies:
- **SaaS**: Freshworks, Khatabook, Trupeer
- **Fintech**: Razorpay, CRED, Zerodha, Groww, Zolve
- **EV & Mobility**: Ola Electric, Ather Energy, Bounce, Simple Energy
- **EdTech**: Byju's, UpGrad
- **Food & Delivery**: Swiggy, Licious
- **E-commerce**: Meesho, Urban Ladder, Urban Company, Fynd, Cashify
- **Deep Tech**: LAT Aerospace, Wankel Energy

## Customization

### Theming
Edit CSS variables in `src/App.css`:
```css
:root {
  --bg-primary: #0a0a0b;
  --accent: #4a9eff;
  --success: #34c759;
  /* ... */
}
```

### Metrics Logic
Modify calculation logic in `src/utils/analytics.js`:
- `calculateMetrics()` - Core metric computations
- `determineMultiple()` - Valuation multiple logic
- `classifySector()` - Sector classification rules

### Adding New Charts
1. Create component in `src/components/`
2. Import in `App.jsx`
3. Add to appropriate view section

## Performance Optimization

- **Code Splitting**: Components lazy-loaded where appropriate
- **Memoization**: Expensive calculations cached
- **Virtual Rendering**: Large tables use windowing
- **Debounced Interactions**: Filtering and sorting optimized

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Best Practices

### For Accurate Metrics
- Keep data updated monthly
- Ensure burn rate sign convention (negative = burning)
- Use consistent currency (₹ throughout)
- Validate all required fields

### For Performance
- Limit CSV to <1000 companies
- Use production build for deployment
- Enable gzip compression on server

### For Insights
- Compare companies within same sector
- Monitor runway trends monthly
- Track efficiency metrics quarterly
- Review valuation multiples annually

## Deployment

### Build for Production
```bash
npm run build
```

Outputs to `dist/` directory.

### Deploy Options
- **Vercel**: `vercel --prod`
- **Netlify**: Drag `dist/` folder to Netlify
- **AWS S3**: Upload `dist/` to S3 bucket
- **Docker**: 
  ```dockerfile
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm install
  COPY . .
  RUN npm run build
  EXPOSE 3000
  CMD ["npm", "run", "preview"]
  ```

## Troubleshooting

### CSV Upload Issues
- Verify column names match exactly (case-sensitive)
- Check for extra spaces in headers
- Ensure numeric values don't have commas
- Validate UTF-8 encoding

### Chart Rendering Issues
- Clear browser cache
- Verify all numeric fields are valid numbers
- Check console for error messages

### Performance Issues
- Reduce number of companies in CSV
- Disable animations in `App.css` (comment out `transition` properties)
- Use production build

## Contributing

This is a production-ready template. To customize:
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

MIT License - feel free to use for commercial or personal projects.

## Acknowledgments

- Design inspiration: PitchBook, Stripe, Linear, Carta
- Chart library: Recharts
- Animation library: Framer Motion
- Sample data: Representative Indian startup ecosystem

## Support

For issues or questions:
- Check troubleshooting section
- Review metrics explanation
- Validate CSV format
- Check browser console

---

**Built for institutional investors who demand excellence.**
