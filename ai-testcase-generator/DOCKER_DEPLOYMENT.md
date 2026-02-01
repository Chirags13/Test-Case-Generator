# Docker Deployment Guide

Deploy the AI Test Case Generator using Docker in minutes!

## 🐳 Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (included with Docker Desktop)
- Gemini API key

## 🚀 Quick Start (Local Testing)

### 1. Setup Environment Variables

```bash
# Copy environment template
cp .env.docker.example .env

# Edit .env and add your Gemini API key
nano .env
```

Your `.env` file should look like:
```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
VITE_API_URL=http://localhost:8000
```

### 2. Build and Run

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 3. Access Application

- **Frontend**: http://localhost
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### 4. Stop Services

```bash
# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 🌍 Production Deployment

### Option 1: Single Server Deployment

**Perfect for: Small teams, low-cost hosting**

1. **Rent a VPS** (DigitalOcean, AWS, etc.)
   - Ubuntu 22.04
   - 2GB RAM minimum
   - 1 CPU

2. **Install Docker**:
```bash
# SSH into your server
ssh root@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y
```

3. **Deploy Application**:
```bash
# Clone repository
git clone https://github.com/yourusername/ai-testcase-generator.git
cd ai-testcase-generator

# Create .env file
nano .env
# Add:
# GEMINI_API_KEY=your_key
# VITE_API_URL=https://api.yourdomain.com

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f
```

4. **Setup Nginx Reverse Proxy**:
```bash
# Install Nginx
apt install nginx certbot python3-certbot-nginx -y

# Create config
nano /etc/nginx/sites-available/testcase
```

Add this configuration:
```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Backend
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and restart:
```bash
ln -s /etc/nginx/sites-available/testcase /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

5. **Add SSL**:
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

6. **Update Environment**:
```bash
# Update .env
nano .env
# Change VITE_API_URL=https://api.yourdomain.com

# Rebuild frontend
docker-compose up -d --build frontend
```

**Done! Your app is live at `https://yourdomain.com`**

### Option 2: Docker Registry + Cloud

**Perfect for: Scalability, CI/CD**

1. **Build and Push Images**:
```bash
# Login to Docker Hub
docker login

# Build backend
cd backend
docker build -t yourusername/testcase-backend:latest .
docker push yourusername/testcase-backend:latest

# Build frontend
cd ../frontend
docker build --build-arg VITE_API_URL=https://api.yourdomain.com -t yourusername/testcase-frontend:latest .
docker push yourusername/testcase-frontend:latest
```

2. **Deploy on Cloud**:

**AWS ECS**:
- Create ECS cluster
- Create task definitions using your images
- Create services
- Configure load balancer

**Google Cloud Run**:
```bash
# Deploy backend
gcloud run deploy testcase-backend \
  --image yourusername/testcase-backend:latest \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key

# Deploy frontend
gcloud run deploy testcase-frontend \
  --image yourusername/testcase-frontend:latest \
  --platform managed \
  --allow-unauthenticated
```

**Azure Container Instances**:
```bash
# Create resource group
az group create --name testcase-rg --location eastus

# Deploy backend
az container create \
  --resource-group testcase-rg \
  --name testcase-backend \
  --image yourusername/testcase-backend:latest \
  --dns-name-label testcase-backend \
  --ports 8000 \
  --environment-variables GEMINI_API_KEY=your_key

# Deploy frontend
az container create \
  --resource-group testcase-rg \
  --name testcase-frontend \
  --image yourusername/testcase-frontend:latest \
  --dns-name-label testcase-frontend \
  --ports 80
```

## 🔧 Advanced Configuration

### Custom Ports

Edit `docker-compose.yml`:
```yaml
services:
  backend:
    ports:
      - "3001:8000"  # Change 3001 to your preferred port
  
  frontend:
    ports:
      - "3000:80"    # Change 3000 to your preferred port
```

### Resource Limits

Add to `docker-compose.yml`:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### Auto-Restart

Already configured with `restart: unless-stopped`

### Logging

```bash
# View all logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail 100
```

### Health Checks

Built-in health checks verify:
- Backend responds on `/health` endpoint
- Frontend serves pages

View health status:
```bash
docker-compose ps
```

### Updates

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# Or rebuild specific service
docker-compose up -d --build backend
```

## 🔒 Security Best Practices

### 1. Use Secrets (Production)

Instead of `.env` file, use Docker secrets:

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    environment:
      - GEMINI_API_KEY_FILE=/run/secrets/gemini_key
    secrets:
      - gemini_key

secrets:
  gemini_key:
    external: true
```

Create secret:
```bash
echo "your_api_key" | docker secret create gemini_key -
```

### 2. Use Non-Root User

Already implemented in Dockerfiles

### 3. Scan for Vulnerabilities

```bash
# Scan images
docker scan yourusername/testcase-backend:latest
docker scan yourusername/testcase-frontend:latest
```

### 4. Use Private Registry

For production, use:
- AWS ECR
- Google Container Registry
- Azure Container Registry
- Private Docker Hub

## 📊 Monitoring

### Container Stats

```bash
# Real-time stats
docker stats

# Specific container
docker stats testcase-backend
```

### Health Monitoring

Setup monitoring with:
- **Prometheus + Grafana**: Metrics and dashboards
- **Datadog**: Full observability
- **New Relic**: Application performance

Example Prometheus config:
```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'testcase-backend'
    static_configs:
      - targets: ['backend:8000']
```

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Check specific error
docker-compose logs backend | grep ERROR
```

### Port Already in Use

```bash
# Find process using port
lsof -i :8000

# Kill process
kill -9 PID

# Or change port in docker-compose.yml
```

### Build Fails

```bash
# Clear cache and rebuild
docker-compose build --no-cache

# Remove old images
docker image prune -a
```

### Out of Disk Space

```bash
# Clean up
docker system prune -a --volumes

# Remove unused images
docker image prune -a
```

### Frontend Can't Connect to Backend

1. Check `.env` has correct `VITE_API_URL`
2. Verify backend is running: `docker-compose ps`
3. Check backend CORS settings in `main.py`
4. Rebuild frontend: `docker-compose up -d --build frontend`

## 💰 Cost Estimate (Cloud Hosting)

**Small Setup** (~100 requests/day):
- DigitalOcean Droplet (2GB): $12/month
- Domain: $12/year
- **Total**: ~$13/month

**Medium Setup** (~1000 requests/day):
- DigitalOcean Droplet (4GB): $24/month
- CDN (optional): $5/month
- Domain: $12/year
- **Total**: ~$30/month

**Large Setup** (Enterprise):
- AWS ECS (2 services): $50-100/month
- Load Balancer: $20/month
- Domain + SSL: $20/year
- **Total**: $70-120/month

## 📚 Next Steps

1. ✅ Test locally with `docker-compose up`
2. ✅ Deploy to VPS or cloud platform
3. ✅ Configure domain and SSL
4. ✅ Set up monitoring
5. ✅ Configure automated backups
6. ✅ Set up CI/CD (optional)

## 🔗 Useful Commands Cheat Sheet

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart a service
docker-compose restart backend

# View logs
docker-compose logs -f

# Execute command in container
docker-compose exec backend bash

# Rebuild service
docker-compose up -d --build backend

# Check status
docker-compose ps

# View resource usage
docker stats

# Clean up
docker system prune -a
```

**Happy Deploying! 🚀**
