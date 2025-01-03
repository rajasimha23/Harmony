#!/bin/bash

# Variables
APP_DIR=/home/ec2-user/chatroom-app

# Create application directory on EC2 instance
ssh -o StrictHostKeyChecking=no -i "$1" ec2-user@"$2" "mkdir -p $APP_DIR"

# Transfer server and frontend files to the EC2 instance
scp -o StrictHostKeyChecking=no -i "$1" -r server ec2-user@"$2":"$APP_DIR"/server
scp -o StrictHostKeyChecking=no -i "$1" -r client ec2-user@"$2":"$APP_DIR"/client

# Install dependencies and restart the backend
ssh -o StrictHostKeyChecking=no -i "$1" ec2-user@"$2" << 'EOF'
cd $APP_DIR/server
npm install --include=dev
pm2 stop all || true  
pm2 start server.js --name "chatroom-backend"
EOF
