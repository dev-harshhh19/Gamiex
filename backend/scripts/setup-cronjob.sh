#!/bin/bash

# MongoDB Atlas Keep-Alive Cron Job Setup Script
# This script sets up a cron job to keep MongoDB Atlas alive

echo "🚀 Setting up MongoDB Atlas Keep-Alive Cron Job..."

# Get the current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
KEEP_ALIVE_SCRIPT="$SCRIPT_DIR/keep-atlas-alive.js"

# Check if the keep-alive script exists
if [ ! -f "$KEEP_ALIVE_SCRIPT" ]; then
    echo "❌ Keep-alive script not found at: $KEEP_ALIVE_SCRIPT"
    exit 1
fi

# Make the script executable
chmod +x "$KEEP_ALIVE_SCRIPT"

# Get Node.js path
NODE_PATH=$(which node)
if [ -z "$NODE_PATH" ]; then
    echo "❌ Node.js not found in PATH"
    exit 1
fi

echo "✅ Node.js found at: $NODE_PATH"
echo "✅ Keep-alive script: $KEEP_ALIVE_SCRIPT"

# Create log directory
LOG_DIR="$PROJECT_DIR/logs"
mkdir -p "$LOG_DIR"

# Cron job entry
CRON_JOB="*/20 * * * * cd $PROJECT_DIR && $NODE_PATH $KEEP_ALIVE_SCRIPT >> $LOG_DIR/keep-alive.log 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "keep-atlas-alive.js"; then
    echo "⚠️ Cron job already exists. Removing old entry..."
    crontab -l 2>/dev/null | grep -v "keep-atlas-alive.js" | crontab -
fi

# Add new cron job
echo "📝 Adding cron job..."
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

# Verify cron job was added
if crontab -l 2>/dev/null | grep -q "keep-atlas-alive.js"; then
    echo "✅ Cron job successfully added!"
    echo ""
    echo "📋 Cron Job Details:"
    echo "   Schedule: Every 20 minutes"
    echo "   Script: $KEEP_ALIVE_SCRIPT"
    echo "   Log: $LOG_DIR/keep-alive.log"
    echo ""
    echo "🔍 To view current cron jobs:"
    echo "   crontab -l"
    echo ""
    echo "📊 To monitor logs:"
    echo "   tail -f $LOG_DIR/keep-alive.log"
    echo ""
    echo "🗑️ To remove cron job:"
    echo "   crontab -l | grep -v 'keep-atlas-alive.js' | crontab -"
else
    echo "❌ Failed to add cron job"
    exit 1
fi

echo ""
echo "🎯 MongoDB Atlas will now stay alive with pings every 20 minutes!"
echo "✅ Setup completed successfully!"
