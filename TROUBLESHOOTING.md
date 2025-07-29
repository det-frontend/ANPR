# ANPR System Troubleshooting Guide

This guide helps resolve common deployment and build issues.

## 🐳 **Docker Build Issues**

### **Issue: ENV Format Warnings**

```
LegacyKeyValueFormat: "ENV key=value" should be used instead of legacy "ENV key value" format
```

**Solution**: ✅ **Fixed** - Updated Dockerfile to use correct ENV syntax:

```dockerfile
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
```

### **Issue: Build Failed - npm run build**

```
ERROR: failed to build: failed to solve: process "/bin/sh -c npm run build" did not complete successfully
```

**Solutions**:

1. **Use Simplified Dockerfile** (Recommended):

   ```bash
   # Use the simplified deployment
   ./deploy-simple.sh
   ```

2. **Check Node.js Version**:

   ```bash
   # Ensure you're using Node.js 18+
   node --version
   ```

3. **Clear Docker Cache**:

   ```bash
   docker system prune -a
   docker builder prune
   ```

4. **Check Available Memory**:
   ```bash
   # Ensure Docker has enough memory (at least 4GB recommended)
   docker system df
   ```

### **Issue: Git Commit Information Warning**

```
WARNING: current commit information was not captured by the build
```

**Solution**: This is just a warning and doesn't affect functionality. You can ignore it or:

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"
```

## 🚀 **Deployment Solutions**

### **Option 1: Simplified Deployment (Recommended)**

```bash
# Use the simplified setup that avoids build issues
./deploy-simple.sh
```

### **Option 2: Manual Docker Build**

```bash
# Build with simplified Dockerfile
docker build -f Dockerfile.simple -t anpr-system .

# Run with docker-compose
docker-compose -f docker-compose.simple.yml up -d
```

### **Option 3: Local Development**

```bash
# Skip Docker entirely for development
npm install
npm run dev
```

## 🔧 **Common Issues & Solutions**

### **Port Already in Use**

```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>

# Or use different port
export PORT=3001
```

### **MongoDB Connection Issues**

```bash
# Check if MongoDB is running
docker-compose ps

# Restart MongoDB
docker-compose restart mongodb

# Check MongoDB logs
docker-compose logs mongodb
```

### **Permission Issues**

```bash
# Fix file permissions
chmod +x deploy.sh
chmod +x deploy-simple.sh
chmod +x deploy-server.sh

# Fix Docker permissions (Linux)
sudo usermod -aG docker $USER
```

### **Memory Issues**

```bash
# Increase Docker memory limit
# In Docker Desktop: Settings > Resources > Memory (set to 4GB+)

# Or use swap (Linux)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 📊 **Debugging Commands**

### **Check Docker Status**

```bash
# Check Docker installation
docker --version
docker-compose --version

# Check running containers
docker ps

# Check container logs
docker-compose logs anpr-app
docker-compose logs mongodb
```

### **Check Application Status**

```bash
# Test API endpoints
curl http://localhost:3000/api/vehicles
curl http://localhost:3000/api/auth/seed

# Check application health
curl -f http://localhost:3000/api/vehicles
```

### **Database Debugging**

```bash
# Connect to MongoDB
docker-compose exec mongodb mongosh

# Check collections
use anpr_system
show collections

# Check users
db.users.find()
```

## 🛠️ **Alternative Deployment Methods**

### **Without Docker (Local)**

```bash
# Install dependencies
npm install

# Set up MongoDB locally
# Install MongoDB from https://mongodb.com

# Set environment variables
cp env.example .env
# Edit .env with local MongoDB URI

# Start application
npm run dev
```

### **With PM2 (Production)**

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "anpr-system" -- start

# Monitor
pm2 monit
pm2 logs anpr-system
```

## 🔍 **Log Analysis**

### **Application Logs**

```bash
# Docker logs
docker-compose logs -f anpr-app

# PM2 logs
pm2 logs anpr-system

# Next.js logs
npm run dev 2>&1 | tee app.log
```

### **Common Error Patterns**

1. **MongoDB Connection Failed**:

   - Check `MONGODB_URI` in `.env`
   - Ensure MongoDB is running
   - Check network connectivity

2. **Build Errors**:

   - Clear `.next` directory: `rm -rf .next`
   - Reinstall dependencies: `npm ci`
   - Check Node.js version

3. **Authentication Issues**:
   - Verify JWT_SECRET is set
   - Check cookie settings
   - Clear browser cookies

## 📞 **Getting Help**

### **Before Asking for Help**

1. Check this troubleshooting guide
2. Review the logs for specific error messages
3. Try the simplified deployment
4. Test with minimal setup

### **Information to Provide**

- Operating system and version
- Docker version
- Node.js version
- Complete error message
- Steps you've already tried

### **Quick Fixes Summary**

```bash
# Most common fixes
docker system prune -a                    # Clear Docker cache
./deploy-simple.sh                       # Use simplified deployment
docker-compose down && docker-compose up # Restart services
npm ci && npm run build                  # Rebuild locally
```

---

**Remember**: The simplified deployment (`./deploy-simple.sh`) is designed to avoid most common build issues!
