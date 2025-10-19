# Build & Deployment Guide

## Quick Start - Production Deployment

### Automated Deployment (Recommended)

On your Ubuntu/Debian server:

```bash
# 1. Clone the repository
git clone https://github.com/Dbuitrago15/Web-Scrapping-Frontend.git
cd Web-Scrapping-Frontend

# 2. Make the script executable
chmod +x deploy-production.sh

# 3. Run the deployment script
./deploy-production.sh
```

The script will automatically:
- ✅ Install Node.js (if not present)
- ✅ Configure environment variables
- ✅ Install dependencies
- ✅ Build the project
- ✅ Create systemd service
- ✅ Start the service

---

## Manual Deployment

### 1. Build for Production

```bash
npm run build
```

The project is configured to compile successfully with Next.js 15.0.4.

### 2. Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NODE_ENV=production
PORT=4500
```

### 3. Run in Production

```bash
npm start
```

Server will run on `http://localhost:4500`

---

## Production Service Setup (Linux)

### Create Systemd Service

Create `/etc/systemd/system/web-scraping-frontend.service`:

```ini
[Unit]
Description=Web Scraping Frontend - Next.js Application
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/Web-Scrapping-Frontend
Environment=NODE_ENV=production
Environment=PORT=4500
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

### Enable and Start Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable auto-start on boot
sudo systemctl enable web-scraping-frontend

# Start the service
sudo systemctl start web-scraping-frontend

# Check status
sudo systemctl status web-scraping-frontend

# View logs
sudo journalctl -u web-scraping-frontend -f
```

---

## Service Management Commands

```bash
# View service status
sudo systemctl status web-scraping-frontend

# Restart service (after changes)
sudo systemctl restart web-scraping-frontend

# Stop service
sudo systemctl stop web-scraping-frontend

# View logs (real-time)
sudo journalctl -u web-scraping-frontend -f

# View last 100 log entries
sudo journalctl -u web-scraping-frontend -n 100
```

---

## Troubleshooting

### Build Errors

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

### Port Already in Use

```bash
# Check what's using the port
sudo lsof -i :4500

# Kill the process (replace PID)
sudo kill -9 <PID>

# Or change port in .env.local
PORT=4501
```

### Backend Connection Issues

1. Verify backend URL in `.env.local`
2. Test backend connectivity: `curl http://localhost:3000/api/v1/health`
3. Check firewall settings
4. Review logs: `sudo journalctl -u web-scraping-frontend -f`

---

## Production Checklist

- [ ] Node.js 18+ installed
- [ ] `.env.local` configured with correct backend URL
- [ ] `npm run build` completes successfully
- [ ] Port 4500 available (or alternative configured)
- [ ] Backend API is accessible
- [ ] Systemd service created and enabled
- [ ] Service running: `systemctl status web-scraping-frontend`
- [ ] Accessible via browser: `http://your-server-ip:4500`

---

## Access

Once deployed, access the application:

- **Local (on server):** `http://localhost:4500`
- **Network:** `http://your-server-ip:4500`
- **With domain (if using reverse proxy):** `http://your-domain.com`
