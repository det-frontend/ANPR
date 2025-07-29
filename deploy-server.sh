#!/bin/bash

# ANPR System Server Deployment Script
# For Ubuntu/CentOS servers

set -e

echo "🚀 Starting ANPR System Server Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Detect OS
detect_os() {
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    else
        print_error "Cannot detect OS"
        exit 1
    fi
}

# Install dependencies based on OS
install_dependencies() {
    print_status "Installing dependencies for $OS..."
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        # Update package list
        sudo apt update
        
        # Install Node.js 18
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
        
        # Install MongoDB
        wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
        sudo apt update
        sudo apt install -y mongodb-org
        
        # Start MongoDB
        sudo systemctl start mongod
        sudo systemctl enable mongod
        
        # Install PM2
        sudo npm install -g pm2
        
        # Install Nginx
        sudo apt install -y nginx
        
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        # Install Node.js 18
        curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
        sudo yum install -y nodejs
        
        # Install MongoDB
        sudo tee /etc/yum.repos.d/mongodb-org-7.0.repo << EOF
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/\$releasever/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc
EOF
        sudo yum install -y mongodb-org
        
        # Start MongoDB
        sudo systemctl start mongod
        sudo systemctl enable mongod
        
        # Install PM2
        sudo npm install -g pm2
        
        # Install Nginx
        sudo yum install -y nginx
    else
        print_error "Unsupported OS: $OS"
        exit 1
    fi
}

# Setup firewall
setup_firewall() {
    print_status "Setting up firewall..."
    
    if command -v ufw &> /dev/null; then
        # Ubuntu firewall
        sudo ufw allow 22
        sudo ufw allow 80
        sudo ufw allow 443
        sudo ufw allow 3000
        sudo ufw --force enable
    elif command -v firewall-cmd &> /dev/null; then
        # CentOS firewall
        sudo firewall-cmd --permanent --add-port=22/tcp
        sudo firewall-cmd --permanent --add-port=80/tcp
        sudo firewall-cmd --permanent --add-port=443/tcp
        sudo firewall-cmd --permanent --add-port=3000/tcp
        sudo firewall-cmd --reload
    fi
}

# Setup Nginx
setup_nginx() {
    print_status "Setting up Nginx..."
    
    # Create Nginx config
    sudo tee /etc/nginx/sites-available/anpr << EOF
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
    
    # Enable site
    sudo ln -sf /etc/nginx/sites-available/anpr /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test and restart Nginx
    sudo nginx -t
    sudo systemctl restart nginx
    sudo systemctl enable nginx
}

# Setup PM2 ecosystem
setup_pm2() {
    print_status "Setting up PM2..."
    
    # Create PM2 ecosystem file
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'anpr-system',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/anpr',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/anpr-error.log',
    out_file: '/var/log/pm2/anpr-out.log',
    log_file: '/var/log/pm2/anpr-combined.log',
    time: true
  }]
};
EOF
    
    # Create log directory
    sudo mkdir -p /var/log/pm2
    sudo chown $USER:$USER /var/log/pm2
}

# Deploy application
deploy_app() {
    print_status "Deploying application..."
    
    # Create app directory
    sudo mkdir -p /var/www/anpr
    sudo chown $USER:$USER /var/www/anpr
    
    # Copy application files
    cp -r . /var/www/anpr/
    cd /var/www/anpr
    
    # Install dependencies
    npm ci --only=production
    
    # Build application
    npm run build
    
    # Start with PM2
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
}

# Main deployment function
main() {
    echo "=========================================="
    echo "    ANPR System Server Deployment"
    echo "=========================================="
    echo
    
    detect_os
    install_dependencies
    setup_firewall
    setup_nginx
    setup_pm2
    deploy_app
    
    print_success "Deployment completed!"
    echo
    print_status "Application URLs:"
    echo "  - HTTP: http://$(curl -s ifconfig.me)"
    echo "  - Local: http://localhost:3000"
    echo
    print_status "Useful commands:"
    echo "  - View logs: pm2 logs anpr-system"
    echo "  - Restart app: pm2 restart anpr-system"
    echo "  - Stop app: pm2 stop anpr-system"
    echo "  - Nginx logs: sudo tail -f /var/log/nginx/access.log"
}

main "$@"