#!/bin/bash

# ANPR System Simplified Deployment Script
# This script uses a simpler Docker setup to avoid build issues

set -e

echo "🚀 Starting ANPR System Simplified Deployment..."

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

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if .env file exists
check_env() {
    print_status "Checking environment configuration..."
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from template..."
        if [ -f env.example ]; then
            cp env.example .env
            print_warning "Please update .env file with your production values before continuing."
            print_warning "Key variables to update:"
            print_warning "  - MONGODB_URI"
            print_warning "  - JWT_SECRET"
            print_warning "  - NEXTAUTH_SECRET"
            read -p "Press Enter after updating .env file..."
        else
            print_error "env.example file not found. Please create .env file manually."
            exit 1
        fi
    else
        print_success ".env file found"
    fi
}

# Build and start services with simplified setup
deploy_services() {
    print_status "Building and starting services with simplified setup..."
    
    # Stop existing containers
    print_status "Stopping existing containers..."
    docker-compose -f docker-compose.simple.yml down --remove-orphans 2>/dev/null || true
    
    # Build images with simplified Dockerfile
    print_status "Building Docker images with simplified setup..."
    docker-compose -f docker-compose.simple.yml build --no-cache
    
    # Start services
    print_status "Starting services..."
    docker-compose -f docker-compose.simple.yml up -d
    
    print_success "Services started successfully"
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for MongoDB
    print_status "Waiting for MongoDB..."
    timeout=60
    counter=0
    while ! docker-compose -f docker-compose.simple.yml exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
        sleep 1
        counter=$((counter + 1))
        if [ $counter -ge $timeout ]; then
            print_error "MongoDB failed to start within $timeout seconds"
            exit 1
        fi
    done
    print_success "MongoDB is ready"
    
    # Wait for application
    print_status "Waiting for application..."
    timeout=120
    counter=0
    while ! curl -f http://localhost:3000/api/vehicles > /dev/null 2>&1; do
        sleep 2
        counter=$((counter + 2))
        if [ $counter -ge $timeout ]; then
            print_error "Application failed to start within $timeout seconds"
            exit 1
        fi
    done
    print_success "Application is ready"
}

# Initialize database
init_database() {
    print_status "Initializing database..."
    
    # Create default users
    print_status "Creating default users..."
    curl -X POST http://localhost:3000/api/auth/seed
    
    # Load sample data (optional)
    read -p "Do you want to load sample vehicle data? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Loading sample data..."
        curl -X POST http://localhost:3000/api/seed-data
        print_success "Sample data loaded"
    fi
}

# Show deployment status
show_status() {
    print_status "Deployment Status:"
    echo
    
    # Show running containers
    print_status "Running containers:"
    docker-compose -f docker-compose.simple.yml ps
    
    echo
    
    # Show application URLs
    print_success "Application URLs:"
    echo "  - Main Application: http://localhost:3000"
    echo "  - API Endpoints: http://localhost:3000/api"
    echo "  - MongoDB: localhost:27017"
    
    echo
    
    # Show default credentials
    print_warning "Default credentials:"
    echo "  - Manager: username=manager, password=manager123"
    echo "  - Client: username=client, password=client123"
    
    echo
    
    print_success "Deployment completed successfully! 🎉"
}

# Main deployment function
main() {
    echo "=========================================="
    echo "    ANPR System Simplified Deployment"
    echo "=========================================="
    echo
    
    check_docker
    check_env
    deploy_services
    wait_for_services
    init_database
    show_status
}

main "$@"