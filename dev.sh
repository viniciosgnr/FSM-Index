#!/bin/bash

# FSM Index — Development Startup Script
# This script starts both the Python Backend (Docker) and the Next.js Frontend.

# Colors for better visibility
GREEN='\033[0;32m'
BLUE='\033[0;34m'
ORANGE='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting FSM Index Development Environment...${NC}"

# Ensure port 3000 is free before starting
while lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; do
    echo -e "${ORANGE}⚠️ Port 3000 is still in use. Cleaning up...${NC}"
    lsof -ti :3000 | xargs kill -9 2>/dev/null || true
    fuser -k 3000/tcp 2>/dev/null || true
    sleep 2
done

# Function to cleanup on exit
cleanup() {
    echo -e "\n${ORANGE}🛑 Stopping services...${NC}"
    # We stop the backend to free up resources, but you can change this to 'down' if preferred
    docker compose stop backend
    exit
}

# Trap Ctrl+C (SIGINT) and SIGTERM
trap cleanup SIGINT SIGTERM

# 1. Start Backend (Docker)
echo -e "${GREEN}📦 Starting Python Backend (Docker)...${NC}"
docker compose up -d backend

# 2. Wait for Backend to be healthy
echo -e "${BLUE}⏳ Waiting for backend to be ready at http://localhost:8001/health...${NC}"
MAX_RETRIES=30
COUNT=0
while ! curl -s http://localhost:8001/health > /dev/null; do
    printf "."
    sleep 1
    COUNT=$((COUNT+1))
    if [ $COUNT -ge $MAX_RETRIES ]; then
        echo -e "\n${ORANGE}⚠️ Backend is taking too long to start. Check 'docker compose logs backend'.${NC}"
        break
    fi
done
echo -e "\n${GREEN}✅ Backend is UP on port 8001${NC}"

# 3. Start Frontend (Next.js)
echo -e "${GREEN}💻 Starting Next.js Frontend on port 3000...${NC}"
npm run dev -- -p 3000
