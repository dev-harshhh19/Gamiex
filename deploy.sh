#!/bin/bash

# Gaming Store Deployment Script
# Usage: ./deploy.sh [backend|frontend|both]

set -e

echo "🚀 Gaming Store Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

# Check if argument is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 [backend|frontend|both]"
    exit 1
fi

DEPLOY_TARGET=$1

# Backend deployment function
deploy_backend() {
    print_info "Deploying Backend with PM2..."
    
    cd backend
    
    # Check if .env exists
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from .env.example..."
        cp .env.example .env
        print_error "Please configure your .env file before continuing!"
        exit 1
    fi
    
    # Install dependencies
    print_info "Installing backend dependencies..."
    npm install
    
    # Import data if needed
    print_info "Importing game data..."
    npm run data:import || print_warning "Data import failed or data already exists"
    
    # Start with PM2
    print_info "Starting application with PM2..."
    npm run pm2:start
    
    # Save PM2 configuration
    pm2 save
    
    print_success "Backend deployed successfully!"
    print_info "Use 'npm run pm2:status' to check status"
    print_info "Use 'npm run pm2:logs' to view logs"
    
    cd ..
}

# Frontend deployment function
deploy_frontend() {
    print_info "Deploying Frontend to Vercel..."
    
    cd frontend
    
    # Check if .env.local exists
    if [ ! -f .env.local ]; then
        print_warning ".env.local file not found. Creating from .env.example..."
        cp .env.example .env.local
        print_warning "Please configure your .env.local file with production API URL!"
    fi
    
    # Install dependencies
    print_info "Installing frontend dependencies..."
    npm install
    
    # Build for production
    print_info "Building for production..."
    npm run build
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_info "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Deploy to Vercel
    print_info "Deploying to Vercel..."
    vercel --prod
    
    print_success "Frontend deployed successfully!"
    print_info "Your application is now live on Vercel!"
    
    cd ..
}

# Main deployment logic
case $DEPLOY_TARGET in
    "backend")
        deploy_backend
        ;;
    "frontend")
        deploy_frontend
        ;;
    "both")
        deploy_backend
        echo ""
        deploy_frontend
        ;;
    *)
        print_error "Invalid argument. Use: backend, frontend, or both"
        exit 1
        ;;
esac

echo ""
print_success "Deployment completed! 🎮✨"
echo ""
print_info "Next steps:"
echo "1. Configure your domain names"
echo "2. Set up SSL certificates"
echo "3. Configure monitoring"
echo "4. Test all functionality"
echo ""
print_info "For detailed instructions, see DEPLOYMENT.md"
