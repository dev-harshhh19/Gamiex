# 🚀 Gaming Store Deployment Guide

## Overview
This guide covers deploying the Gaming Store application using:
- **Backend**: PM2 (Process Manager) on VPS/Cloud Server
- **Frontend**: Vercel (Static Hosting with CDN)

---

## 📋 Prerequisites

### Required Software
- Node.js 18+ 
- PM2 (`npm install -g pm2`)
- Git
- MongoDB Atlas account (or self-hosted MongoDB)

### Required Accounts
- Vercel account (free tier available)
- VPS/Cloud server (DigitalOcean, AWS, etc.)
- Domain name (optional but recommended)

---

## 🖥️ Backend Deployment (PM2)

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Git
sudo apt install git -y
```

### 2. Deploy Backend

```bash
# Clone repository
git clone https://github.com/yourusername/gaming-store.git
cd gaming-store/backend

# Install dependencies
npm install

# Create production environment file
cp .env.example .env
nano .env
```

### 3. Configure Environment Variables

Edit `.env` file with production values:

```bash
NODE_ENV=production
PORT=5000
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/gaming_store
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters-long
JWT_EXPIRE=30d
FRONTEND_URL=https://your-vercel-domain.vercel.app
BCRYPT_ROUNDS=12
```

### 4. Start with PM2

```bash
# Import game data
npm run data:import

# Start with PM2
npm run pm2:start

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
# Follow the instructions provided by the command above
```

### 5. PM2 Management Commands

```bash
# Check status
npm run pm2:status

# View logs
npm run pm2:logs

# Restart application
npm run pm2:restart

# Monitor performance
npm run pm2:monit

# Stop application
npm run pm2:stop
```

---

## 🌐 Frontend Deployment (Vercel)

### 1. Prepare Frontend

```bash
cd gaming-store/frontend

# Install Vercel CLI
npm install -g vercel

# Create production environment
cp .env.example .env.local
```

### 2. Configure Environment

Edit `.env.local`:

```bash
REACT_APP_API_URL=https://your-backend-domain.com/api
GENERATE_SOURCEMAP=false
```

### 3. Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name: gaming-store-frontend
# - Directory: ./
# - Override settings? No
```

### 4. Configure Vercel Environment Variables

In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add:
   - `REACT_APP_API_URL`: `https://your-backend-domain.com/api`
   - `GENERATE_SOURCEMAP`: `false`

### 5. Redeploy with Environment Variables

```bash
vercel --prod
```

---

## 🔧 Domain Configuration

### Backend Domain Setup

1. **Point domain to your server IP**
   ```
   A record: api.yourdomain.com → YOUR_SERVER_IP
   ```

2. **Install SSL certificate (Let's Encrypt)**
   ```bash
   sudo apt install certbot nginx -y
   sudo certbot --nginx -d api.yourdomain.com
   ```

3. **Configure Nginx reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl;
       server_name api.yourdomain.com;
       
       ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Frontend Domain Setup

1. **Add custom domain in Vercel**
   - Go to Vercel Dashboard → Project → Settings → Domains
   - Add your domain: `yourdomain.com`
   - Follow DNS configuration instructions

---

## 📊 Monitoring & Maintenance

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Memory usage
pm2 show gaming-store-api

# Restart if memory usage is high
pm2 restart gaming-store-api
```

### Log Management

```bash
# View logs
pm2 logs gaming-store-api

# Clear logs
pm2 flush

# Rotate logs
pm2 install pm2-logrotate
```

### Database Backup

```bash
# MongoDB Atlas automatic backups are enabled by default
# For manual backup:
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/gaming_store"
```

---

## 🔄 Updates & Deployment

### Backend Updates

```bash
cd gaming-store/backend
git pull origin main
npm install
npm run pm2:reload  # Zero-downtime reload
```

### Frontend Updates

```bash
cd gaming-store/frontend
git pull origin main
npm install
npm run build
vercel --prod
```

---

## 🚨 Troubleshooting

### Common Issues

1. **PM2 app not starting**
   ```bash
   pm2 logs gaming-store-api
   # Check for environment variable issues
   ```

2. **CORS errors**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check Vercel domain configuration

3. **Database connection issues**
   - Verify MongoDB Atlas IP whitelist
   - Check connection string format

4. **Build failures**
   ```bash
   npm run build
   # Check for missing environment variables
   ```

---

## 📈 Performance Optimization

### Backend
- PM2 cluster mode (already configured)
- MongoDB indexing
- Redis caching (optional)

### Frontend
- Vercel CDN (automatic)
- Image optimization
- Code splitting (already implemented)

---

## 🔐 Security Checklist

- ✅ Environment variables secured
- ✅ HTTPS enabled
- ✅ Security headers configured
- ✅ Rate limiting implemented
- ✅ CORS properly configured
- ✅ JWT secrets secured

---

## 📞 Support

For deployment issues:
1. Check logs: `pm2 logs gaming-store-api`
2. Verify environment variables
3. Check server resources: `htop`
4. Review Vercel deployment logs

**Your Gaming Store is now ready for production! 🎮✨**
