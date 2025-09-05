# 🚀 Startup Village County - Deployment Guide

This guide will help you deploy your application to Hostinger VPS using GitHub and fix common hosting issues.

## 📋 Prerequisites

- Hostinger VPS account
- Domain name (optional)
- GitHub repository
- SSH access to your VPS

## 🔧 Initial VPS Setup

### 1. Connect to your VPS
```bash
ssh username@your-vps-ip
```

### 2. Update system packages
```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Install Node.js 18
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 4. Install PM2 globally
```bash
sudo npm install -g pm2
```

### 5. Install MongoDB
```bash
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 6. Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 📁 Project Setup

### 1. Clone your repository
```bash
cd /home/username
git clone https://github.com/yourusername/startup-village-county.git
cd startup-village-county
```

### 2. Install dependencies
```bash
npm run install:all
```

### 3. Create environment file
```bash
cp backend/env.example backend/.env
nano backend/.env
```

### 4. Configure your environment variables
Update the `.env` file with your production values:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/startup-village-county
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=your-super-secret-jwt-key-here
# ... other variables
```

## 🏗️ Build and Deploy

### 1. Build the frontend
```bash
npm run build
```

### 2. Create logs directory
```bash
mkdir -p logs
```

### 3. Start the application with PM2
```bash
npm run deploy
```

### 4. Save PM2 configuration
```bash
pm2 save
pm2 startup
```

## 🌐 Nginx Configuration

### 1. Create Nginx configuration
```bash
sudo nano /etc/nginx/sites-available/startup-village
```

### 2. Add the following configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Frontend (React build files)
    location / {
        root /home/username/startup-village-county/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API routes
    location /api/ {
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
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
}
```

### 3. Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/startup-village /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 🔐 SSL Certificate (Optional)

### 1. Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Get SSL certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 🚀 GitHub Actions Setup

### 1. Add secrets to your GitHub repository
Go to Settings > Secrets and variables > Actions, and add:
- `HOSTINGER_HOST`: Your VPS IP address
- `HOSTINGER_USERNAME`: Your VPS username
- `HOSTINGER_SSH_KEY`: Your private SSH key
- `HOSTINGER_PORT`: SSH port (usually 22)

### 2. Push to master branch
```bash
git add .
git commit -m "Deploy to production"
git push origin master
```

## 🔍 Troubleshooting Common Issues

### Issue 1: Port already in use
```bash
# Check what's using port 5000
sudo lsof -i :5000
# Kill the process
sudo kill -9 PID
```

### Issue 2: MongoDB connection failed
```bash
# Check MongoDB status
sudo systemctl status mongodb
# Restart MongoDB
sudo systemctl restart mongodb
```

### Issue 3: PM2 process not starting
```bash
# Check PM2 logs
pm2 logs startup-village-backend
# Restart the process
pm2 restart startup-village-backend
```

### Issue 4: Nginx configuration error
```bash
# Test Nginx configuration
sudo nginx -t
# Check Nginx status
sudo systemctl status nginx
```

### Issue 5: File permissions
```bash
# Fix file permissions
sudo chown -R username:username /home/username/startup-village-county
chmod -R 755 /home/username/startup-village-county
```

## 📊 Monitoring and Maintenance

### 1. Check application status
```bash
pm2 status
pm2 logs startup-village-backend
```

### 2. Monitor system resources
```bash
htop
df -h
free -h
```

### 3. Update application
```bash
git pull origin main
npm run install:all
npm run build
pm2 restart startup-village-backend
```

## 🔄 Backup Strategy

### 1. Database backup
```bash
mongodump --db startup-village-county --out /backup/mongodb/$(date +%Y%m%d)
```

### 2. Application backup
```bash
tar -czf /backup/app/startup-village-$(date +%Y%m%d).tar.gz /home/username/startup-village-county
```

## 📞 Support

If you encounter any issues:
1. Check the logs: `pm2 logs startup-village-backend`
2. Verify environment variables: `cat backend/.env`
3. Test API endpoints: `curl http://localhost:5000/api/health`
4. Contact: connect01@startupvillagecounty.in

## 🎯 Quick Commands Reference

```bash
# Start application
npm run deploy

# Restart application
npm run restart

# Stop application
npm run stop

# View logs
npm run logs

# Check status
npm run status

# Update and redeploy
git pull && npm run deploy
```

---

**Note**: Replace `yourdomain.com`, `username`, and other placeholders with your actual values.
