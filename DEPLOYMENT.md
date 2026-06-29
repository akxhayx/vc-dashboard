# Deployment Guide - Venture Intelligence Platform

## Quick Deploy Options

### Option 1: Local Development (Fastest)

```bash
# Navigate to project directory
cd vc-dashboard

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000` in your browser.

### Option 2: Production Build + Local Preview

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Open `http://localhost:4173` in your browser.

### Option 3: Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd vc-dashboard
vercel --prod
```

3. Follow prompts. Your dashboard will be live in ~60 seconds.

### Option 4: Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build and deploy:
```bash
cd vc-dashboard
npm run build
netlify deploy --prod --dir=dist
```

### Option 5: Deploy to AWS S3 + CloudFront

1. Build the project:
```bash
npm run build
```

2. Create S3 bucket:
```bash
aws s3 mb s3://vc-dashboard-your-name
```

3. Upload files:
```bash
aws s3 sync dist/ s3://vc-dashboard-your-name --acl public-read
```

4. Enable static website hosting in S3 console.

5. (Optional) Create CloudFront distribution for HTTPS and CDN.

### Option 6: Docker Deployment

1. Build Docker image:
```bash
docker build -t vc-dashboard .
```

2. Run container:
```bash
docker run -p 3000:3000 vc-dashboard
```

Dockerfile:
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

## Environment Configuration

### Development Environment
- Hot module replacement enabled
- Source maps for debugging
- Development server on port 3000

### Production Environment
- Minified and optimized bundle
- Code splitting enabled
- Gzip compression recommended
- Serve over HTTPS

## Server Requirements

### Minimum Specifications
- Node.js 18+ (for build process)
- 512MB RAM
- 100MB disk space

### Recommended Specifications
- Node.js 18+
- 1GB RAM
- 500MB disk space (for logs and temp files)
- CDN for static assets

## Performance Optimization

### Build Optimizations
```bash
# Use production build
npm run build

# Check bundle size
npm run build -- --analyze
```

### Server-Side Optimization
- Enable gzip/brotli compression
- Set cache headers for static assets
- Use CDN for asset delivery
- Enable HTTP/2

### nginx Configuration Example
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/vc-dashboard/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

## Security Best Practices

### Content Security Policy
Add to your server configuration:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com;
```

### HTTPS
Always serve over HTTPS in production. Use Let's Encrypt for free SSL certificates:
```bash
certbot --nginx -d yourdomain.com
```

## Monitoring & Analytics

### Recommended Tools
- **Sentry**: Error tracking and performance monitoring
- **Google Analytics**: User behavior tracking
- **LogRocket**: Session replay and debugging
- **Vercel Analytics**: Built-in if using Vercel

### Health Checks
Create a health check endpoint by adding to your server:
```javascript
// Serve from /health
{ "status": "ok", "version": "1.0.0" }
```

## Backup & Recovery

### Data Backup
- CSV files uploaded by users are client-side only
- No server-side database required
- Users should maintain their own CSV backups

### Version Control
- Keep source code in Git
- Tag releases: `git tag v1.0.0`
- Maintain changelog

## Troubleshooting Deployment

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Memory Issues During Build
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

## Scaling Considerations

### Load Balancing
For high traffic, use:
- AWS ELB
- nginx load balancer
- Cloudflare

### CDN Integration
Recommended CDN providers:
- Cloudflare (free tier available)
- AWS CloudFront
- Fastly

### Horizontal Scaling
Dashboard is stateless - deploy multiple instances behind load balancer.

## Cost Estimates

### Free Tier Hosting
- **Vercel**: Free for hobby projects
- **Netlify**: Free for personal use
- **GitHub Pages**: Free (static hosting)

### Paid Hosting (Est. Monthly)
- **AWS S3 + CloudFront**: $5-20
- **DigitalOcean Droplet**: $6-12
- **AWS EC2 t3.micro**: $8-15
- **Vercel Pro**: $20

## Post-Deployment Checklist

- [ ] HTTPS enabled
- [ ] Custom domain configured
- [ ] Analytics integrated
- [ ] Error tracking setup
- [ ] Performance monitoring active
- [ ] Backup strategy defined
- [ ] Documentation updated
- [ ] Team access granted
- [ ] Health checks configured
- [ ] Cache headers set

## Support & Maintenance

### Regular Maintenance
- Update dependencies monthly: `npm update`
- Security patches: `npm audit fix`
- Monitor error logs weekly
- Review performance metrics monthly

### Version Updates
```bash
# Check for updates
npm outdated

# Update specific package
npm update recharts

# Update all (carefully)
npm update
```

---

**Need help?** Check the main README.md for troubleshooting or open an issue on GitHub.
