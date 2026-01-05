#!/bin/bash

# ============================================
# Arafat Chat - Cloudflare Tunnel Starter
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}   Arafat Chat - Tunnel Starter${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo -e "${RED}Error: cloudflared is not installed${NC}"
    echo "Install it with: brew install cloudflared"
    exit 1
fi

# Check if config exists
CONFIG_FILE="$HOME/.cloudflared/config.yml"
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}Error: Cloudflare tunnel config not found at $CONFIG_FILE${NC}"
    exit 1
fi

# Check if tunnel is already running
if pgrep -x "cloudflared" > /dev/null; then
    echo -e "${YELLOW}Tunnel is already running!${NC}"
    echo ""
    echo -e "To stop it: ${GREEN}pkill cloudflared${NC}"
    echo -e "To view logs: ${GREEN}tail -f /tmp/cloudflared.log${NC}"
    exit 0
fi

# Extract hostname from config
HOSTNAME=$(grep "hostname:" "$CONFIG_FILE" | head -1 | awk '{print $2}')
PORT=$(grep "service:" "$CONFIG_FILE" | head -1 | grep -oE '[0-9]+$')

echo -e "${GREEN}Starting Cloudflare Tunnel...${NC}"
echo ""
echo -e "  Hostname: ${BLUE}https://$HOSTNAME${NC}"
echo -e "  Backend:  ${BLUE}http://localhost:$PORT${NC}"
echo ""

# Check if backend is running
if ! lsof -i :$PORT > /dev/null 2>&1; then
    echo -e "${YELLOW}Warning: No service detected on port $PORT${NC}"
    echo -e "Make sure your backend API is running before using the tunnel."
    echo ""
fi

# Start tunnel in background
echo -e "${GREEN}Launching tunnel...${NC}"
nohup cloudflared tunnel run > /tmp/cloudflared.log 2>&1 &

# Wait for tunnel to connect
sleep 3

# Check if tunnel started successfully
if pgrep -x "cloudflared" > /dev/null; then
    echo ""
    echo -e "${GREEN}============================================${NC}"
    echo -e "${GREEN}  Tunnel is running!${NC}"
    echo -e "${GREEN}============================================${NC}"
    echo ""
    echo -e "  Access your app at: ${BLUE}https://$HOSTNAME${NC}"
    echo ""
    echo -e "  View logs:  ${YELLOW}tail -f /tmp/cloudflared.log${NC}"
    echo -e "  Stop tunnel: ${YELLOW}pkill cloudflared${NC}"
    echo ""
else
    echo -e "${RED}Failed to start tunnel. Check logs:${NC}"
    echo "cat /tmp/cloudflared.log"
    exit 1
fi
