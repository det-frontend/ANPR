# ANPR System Deployment Guide

This guide covers deployment options for different devices and platforms.

## 🖥️ **Local Device Deployment**

### **Prerequisites**

- Node.js 18+ or Docker
- Git (optional)

### **Quick Start (Docker)**

```bash
# 1. Copy project files to target device
# 2. Navigate to project directory
cd project-anpr

# 3. Set up environment
cp env.example .env
# Edit .env with your configuration

# 4. Deploy
./deploy.sh
```

### **Manual Deployment**

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp env.example .env
# Edit .env

# 3. Build and start
npm run build
npm start
```

## 🖥️ **Windows Device**

### **Option 1: Docker Desktop**

1. Install Docker Desktop for Windows
2. Follow Docker deployment steps above

### **Option 2: WSL2 (Recommended)**

```bash
# 1. Install WSL2 with Ubuntu
wsl --install

# 2. In WSL2 terminal, follow Linux deployment steps
```

### **Option 3: Native Windows**

```bash
# 1. Install Node.js from https://nodejs.org
# 2. Install MongoDB from https://mongodb.com
# 3. Follow manual deployment steps
```

## 🖥️ **macOS Device**

### **Option 1: Docker Desktop**

```bash
# Install Docker Desktop for Mac
# Follow Docker deployment steps
```

### **Option 2: Homebrew**

```bash
# 1. Install dependencies
brew install node mongodb/brew/mongodb-community

# 2. Start MongoDB
brew services start mongodb/brew/mongodb-community

# 3. Follow manual deployment steps
```

## 🖥️ **Linux Server (Ubuntu/CentOS)**

### **Automated Deployment**

```bash
# 1. Copy project files to server
# 2. Make script executable
chmod +x deploy-server.sh

# 3. Run deployment
./deploy-server.sh
```

### **Manual Server Setup**

```bash
# 1. Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install MongoDB
sudo apt install -y mongodb

# 3. Install PM2
sudo npm install -g pm2

# 4. Follow manual deployment steps
```

## ☁️ **Cloud Deployment**

### **Vercel (Recommended for Frontend)**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Set environment variables in Vercel dashboard
```

### **Railway**

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login and deploy
railway login
railway init
railway up
```

### **Render**

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables

### **Heroku**

```bash
# 1. Install Heroku CLI
# 2. Create app
heroku create your-anpr-app

# 3. Add MongoDB addon
heroku addons:create mongolab

# 4. Deploy
git push heroku main
```

## 📱 **Mobile Device Access**

### **Local Network Access**

```bash
# 1. Find your device IP
ipconfig  # Windows
ifconfig  # macOS/Linux

# 2. Access from mobile browser
http://YOUR_DEVICE_IP:3000
```

### **Public Access (Port Forwarding)**

1. Configure router port forwarding (port 3000)
2. Use your public IP address
3. Consider using a domain name

## 🔧 **Environment Configuration**

### **Production Environment Variables**

```env
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/anpr_system
JWT_SECRET=your-very-long-secure-jwt-secret
NEXTAUTH_URL=http://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret
```

### **MongoDB Atlas (Cloud Database)**

1. Create MongoDB Atlas account
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## 🔒 **Security Considerations**

### **Firewall Setup**

```bash
# Ubuntu
sudo ufw allow 3000
sudo ufw enable

# CentOS
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

### **SSL/HTTPS Setup**

1. Obtain SSL certificate (Let's Encrypt)
2. Configure Nginx with SSL
3. Update environment variables

## 📊 **Monitoring & Maintenance**

### **PM2 Process Management**

```bash
# View logs
pm2 logs anpr-system

# Restart application
pm2 restart anpr-system

# Monitor processes
pm2 monit
```

### **Database Backup**

```bash
# Backup
mongodump --db anpr_system --out ./backup

# Restore
mongorestore --db anpr_system ./backup/anpr_system
```

## 🚀 **Deployment Checklist**

### **Pre-Deployment**

- [ ] Environment variables configured
- [ ] MongoDB connection tested
- [ ] Build process successful
- [ ] Security settings reviewed

### **Post-Deployment**

- [ ] Application accessible
- [ ] Database connected
- [ ] Authentication working
- [ ] Default users created
- [ ] Sample data loaded (optional)

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Port Already in Use**

   ```bash
   # Find process using port 3000
   lsof -i :3000
   # Kill process
   kill -9 PID
   ```

2. **MongoDB Connection Failed**

   ```bash
   # Check MongoDB status
   sudo systemctl status mongod
   # Start MongoDB
   sudo systemctl start mongod
   ```

3. **Permission Denied**
   ```bash
   # Fix file permissions
   chmod +x deploy.sh
   chmod +x deploy-server.sh
   ```

### **Log Locations**

- Application logs: `pm2 logs anpr-system`
- Nginx logs: `/var/log/nginx/`
- MongoDB logs: `/var/log/mongodb/`

## 📞 **Support**

For deployment issues:

1. Check the troubleshooting section
2. Review logs for error messages
3. Verify environment configuration
4. Test with minimal setup first

---

**Remember**: Always backup your data before deployment and test in a staging environment first!
