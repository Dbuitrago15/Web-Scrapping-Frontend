#!/bin/bash

################################################################################
# Production Deployment Script
# 
# This script automates the deployment of the Web Scraping Frontend
# to a production environment on Ubuntu/Debian servers.
#
# Usage:
#   chmod +x deploy-production.sh
#   ./deploy-production.sh
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
NODE_MIN_VERSION="18.17.0"
PORT=4500

################################################################################
# Helper Functions
################################################################################

print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

################################################################################
# Check System Requirements
################################################################################

check_requirements() {
    print_header "Checking System Requirements"
    
    # Check OS
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        print_info "Operating System: $NAME $VERSION"
    fi
    
    # Check Node.js
    if ! command_exists node; then
        print_error "Node.js is not installed"
        print_info "Installing Node.js 20 LTS..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    
    NODE_VERSION=$(node --version | sed 's/v//')
    print_success "Node.js $NODE_VERSION installed"
    
    # Check npm
    if ! command_exists npm; then
        print_error "npm is not installed"
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    print_success "npm $NPM_VERSION installed"
    
    echo ""
}

################################################################################
# Setup Environment Variables
################################################################################

setup_environment() {
    print_header "Setting Up Environment Variables"
    
    if [ -f ".env.local" ]; then
        print_info "File .env.local already exists"
        read -p "Do you want to overwrite it? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Keeping existing .env.local"
            return
        fi
    fi
    
    echo ""
    echo "Enter your Backend API URL:"
    echo "  Example (local):  http://localhost:3000/api/v1"
    echo "  Example (remote): http://192.168.1.100:3000/api/v1"
    echo ""
    read -p "Backend URL [http://localhost:3000/api/v1]: " BACKEND_URL
    BACKEND_URL=${BACKEND_URL:-http://localhost:3000/api/v1}
    
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=$BACKEND_URL
NODE_ENV=production
PORT=$PORT
EOF
    
    print_success "Environment file created successfully"
    print_info "Backend URL: $BACKEND_URL"
    echo ""
}

################################################################################
# Install Dependencies
################################################################################

install_dependencies() {
    print_header "Installing Dependencies"
    
    cd "$PROJECT_DIR"
    
    if [ ! -d "node_modules" ]; then
        print_info "Installing npm packages..."
        npm install
    else
        print_info "Dependencies already installed"
    fi
    
    if [ -f "node_modules/.bin/next" ]; then
        print_success "Dependencies installed successfully"
        NEXT_VERSION=$(npx next --version)
        print_info "Next.js $NEXT_VERSION"
    else
        print_error "Next.js installation failed"
        exit 1
    fi
    
    echo ""
}

################################################################################
# Build for Production
################################################################################

build_project() {
    print_header "Building Project for Production"
    
    cd "$PROJECT_DIR"
    
    print_info "Running npm run build..."
    npm run build
    
    print_success "Build completed successfully"
    echo ""
}

################################################################################
# Create Systemd Service
################################################################################

create_systemd_service() {
    print_header "Creating Systemd Service"
    
    SERVICE_FILE="/etc/systemd/system/web-scraping-frontend.service"
    
    if [ -f "$SERVICE_FILE" ]; then
        print_info "Service already exists"
        read -p "Do you want to recreate it? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Keeping existing service"
            return
        fi
    fi
    
    print_info "Creating systemd service..."
    
    sudo bash -c "cat > $SERVICE_FILE" << EOF
[Unit]
Description=Web Scraping Frontend - Next.js Application
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$PROJECT_DIR
Environment=NODE_ENV=production
Environment=PORT=$PORT
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=web-scraping-frontend

[Install]
WantedBy=multi-user.target
EOF
    
    sudo systemctl daemon-reload
    print_success "Systemd service created"
    echo ""
}

################################################################################
# Start Service
################################################################################

start_service() {
    print_header "Starting Service"
    
    # Enable service
    print_info "Enabling auto-start on boot..."
    sudo systemctl enable web-scraping-frontend
    
    # Start service
    print_info "Starting service..."
    sudo systemctl restart web-scraping-frontend
    
    sleep 2
    
    # Check status
    if sudo systemctl is-active --quiet web-scraping-frontend; then
        print_success "Service is running"
    else
        print_error "Service failed to start"
        print_info "Check logs with: sudo journalctl -u web-scraping-frontend -f"
        exit 1
    fi
    
    echo ""
}

################################################################################
# Display Final Information
################################################################################

show_final_info() {
    LOCAL_IP=$(hostname -I | awk '{print $1}')
    
    print_header "✅ Deployment Completed Successfully!"
    
    echo ""
    echo -e "${GREEN}🌐 Access URLs:${NC}"
    echo "  Local:   http://localhost:$PORT"
    echo "  Network: http://$LOCAL_IP:$PORT"
    echo ""
    
    echo -e "${GREEN}📝 Useful Commands:${NC}"
    echo "  View status:  ${YELLOW}sudo systemctl status web-scraping-frontend${NC}"
    echo "  View logs:    ${YELLOW}sudo journalctl -u web-scraping-frontend -f${NC}"
    echo "  Restart:      ${YELLOW}sudo systemctl restart web-scraping-frontend${NC}"
    echo "  Stop:         ${YELLOW}sudo systemctl stop web-scraping-frontend${NC}"
    echo ""
    
    echo -e "${GREEN}💡 Next Steps:${NC}"
    echo "  1. Open browser: http://$LOCAL_IP:$PORT"
    echo "  2. Monitor logs for any issues"
    echo "  3. Verify backend connectivity"
    echo ""
    
    print_header "Recent Logs"
    echo ""
    sudo journalctl -u web-scraping-frontend -n 20 --no-pager
    echo ""
}

################################################################################
# Main Execution
################################################################################

main() {
    clear
    
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                                                                ║${NC}"
    echo -e "${BLUE}║      🚀 PRODUCTION DEPLOYMENT - WEB SCRAPING FRONTEND 🚀      ║${NC}"
    echo -e "${BLUE}║                                                                ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    check_requirements
    setup_environment
    install_dependencies
    build_project
    create_systemd_service
    start_service
    show_final_info
}

# Run main function
main
