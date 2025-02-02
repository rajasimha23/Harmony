#!/bin/bash

# Variables
APP_DIR=/home/ubuntu/chatroom-app

# Create application directory on EC2 instance
ssh -o StrictHostKeyChecking=no -i "$1" ubuntu@"$2" << EOF
rm -R /home/ubuntu/chatroom-app 
mkdir -p $APP_DIR
EOF


tar --exclude='node_modules' -czf client.tar.gz ./client
tar --exclude='node_modules' -czf server.tar.gz ./server

scp -i "$1" client.tar.gz ubuntu@"$2":"$APP_DIR"
scp -i "$1" server.tar.gz ubuntu@"$2":"$APP_DIR"

ssh -i "$1" ubuntu@"$2" "tar -xzf $APP_DIR/client.tar.gz -C $APP_DIR"
ssh -i "$1" ubuntu@"$2" "tar -xzf $APP_DIR/server.tar.gz -C $APP_DIR"

# Install packages: npm, pm2, nodemon, nginx
ssh -o StrictHostKeyChecking=no -i "$1" ubuntu@"$2" << EOF

sudo apt update
sudo apt install npm -y
npm --version
node --version
npm install -g pm2 -y
pm2 --version

sudo apt install nginx -y
sudo nginx -t          
sudo systemctl daemon-reload 
sudo systemctl reload nginx

EOF

# Install dependencies and restart the backend:
ssh -o StrictHostKeyChecking=no -i "$1" ubuntu@"$2" << EOF

pm2 delete all

cd $APP_DIR/client
rm -rf node_modules package-lock.json
npm install --include=dev
pm2 stop all || true  
pm2 start npm --name "frontend" -- run dev

cd $APP_DIR/server
rm -rf node_modules package-lock.json
npm install --include=dev
pm2 start node --name "backend" -- index.js

EOF
