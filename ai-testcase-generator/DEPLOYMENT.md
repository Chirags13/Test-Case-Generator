# Deployment Guide - AI Test Case Generator

This guide covers multiple options for hosting your AI Test Case Generator online, from simple free hosting to professional production deployments.

## 📋 Table of Contents

1. [Quick Deploy Options](#quick-deploy-options)
2. [Option 1: Render (Easiest - Free Tier)](#option-1-render-easiest)
3. [Option 2: Railway (Simple - Free Trial)](#option-2-railway)
4. [Option 3: Vercel + Railway (Recommended)](#option-3-vercel--railway)
5. [Option 4: AWS (Production Grade)](#option-4-aws)
6. [Option 5: Google Cloud Platform](#option-5-google-cloud-platform)
7. [Option 6: DigitalOcean (Best Value)](#option-6-digitalocean)
8. [Environment Variables](#environment-variables)
9. [Custom Domain Setup](#custom-domain-setup)
10. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Quick Deploy Options

| Platform | Cost | Difficulty | Best For |
|----------|------|------------|----------|
| Render | Free tier available | ⭐ Easy | Testing, demos |
| Railway | $5/month after trial | ⭐⭐ Easy | Small teams |
| Vercel + Railway | $5/month | ⭐⭐ Medium | Recommended |
| DigitalOcean | $12/month | ⭐⭐⭐ Medium | Best value |
| AWS | $20-50/month | ⭐⭐⭐⭐ Hard | Enterprise |
| GCP | $20-50/month | ⭐⭐⭐⭐ Hard | Enterprise |

---

## Option 1: Render (Easiest)

**Free tier available | Perfect for testing**

### Step 1: Prepare Repository

```bash
# Create a GitHub repository
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/ai-testcase-generator.git
git push -u origin main
```

### Step 2: Add Render Configuration

Create `render.yaml` in project root:

```yaml
services:
  # Backend
  - type: web
    name: ai-testcase-backend
    env: python
    buildCommand: "cd backend && pip install -r requirements.txt"
    startCommand: "cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: PYTHON_VERSION
        value: 3.11
      - key: GEMINI_API_KEY
        sync: false

  # Frontend
  - type: web
    name: ai-testcase-frontend
    env: node
    buildCommand: "cd frontend && npm install && npm run build"
    startCommand: "cd frontend && npm run preview -- --host 0.0.0.0 --port $PORT"
    envVars:
      - key: NODE_VERSION
        value: 18
```

### Step 3: Deploy on Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Blueprint"
4. Connect your repository
5. Render will auto-detect `render.yaml`
6. Add your Gemini API key in environment variables
7. Click "Apply"

**Result**: 
- Backend: `https://ai-testcase-backend.onrender.com`
- Frontend: `https://ai-testcase-frontend.onrender.com`

### Step 4: Update CORS

Edit `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-testcase-frontend.onrender.com"  # Add your frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 5: Update Frontend API URL

Edit `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ai-testcase-backend.onrender.com';
```

Add `.env` to frontend:

```bash
VITE_API_URL=https://ai-testcase-backend.onrender.com
```

**⚠️ Note**: Free tier sleeps after 15 minutes of inactivity. First request may be slow.

---

## Option 2: Railway (Simple)

**$5/month after trial | Auto-scaling**

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
railway login
```

### Step 2: Deploy Backend

```bash
cd backend
railway init
railway up
railway variables set GEMINI_API_KEY=your_key_here
```

### Step 3: Deploy Frontend

```bash
cd ../frontend
railway init
railway up
railway variables set VITE_API_URL=https://your-backend-url.railway.app
```

### Step 4: Get URLs

```bash
railway domain
```

**Pros**:
- Easy deployment
- Auto-scaling
- Good free trial

**Cons**:
- Costs after trial
- Less control

---

## Option 3: Vercel + Railway (Recommended)

**Best developer experience | ~$5/month**

### Backend on Railway

```bash
cd backend
railway init
railway up
railway variables set GEMINI_API_KEY=your_key_here
railway domain  # Get your backend URL
```

### Frontend on Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy frontend:
```bash
cd frontend
vercel
```

3. Add environment variable:
```bash
vercel env add VITE_API_URL production
# Enter: https://your-backend.railway.app
```

4. Redeploy:
```bash
vercel --prod
```

**Result**:
- Frontend: `https://your-app.vercel.app` (fast, global CDN)
- Backend: `https://your-backend.railway.app` (auto-scaling)

**This is the recommended setup for most users!**

---

## Option 4: AWS (Production Grade)

**$20-50/month | Enterprise-ready**

### Architecture

- **Frontend**: S3 + CloudFront
- **Backend**: EC2 or ECS
- **Database**: RDS (if needed later)

### Step 1: Backend on EC2

1. **Launch EC2 Instance**:
   - AMI: Ubuntu 22.04
   - Instance type: t3.small ($15/month)
   - Security group: Allow ports 22, 80, 443, 8000

2. **SSH and setup**:
```bash
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Python
sudo apt install python3-pip python3-venv -y

# Clone repository
git clone https://github.com/yourusername/ai-testcase-generator.git
cd ai-testcase-generator/backend

# Install dependencies
pip3 install -r requirements.txt

# Install process manager
pip3 install gunicorn

# Create systemd service
sudo nano /etc/systemd/system/testcase-backend.service
```

3. **Systemd Service** (`/etc/systemd/system/testcase-backend.service`):
```ini
[Unit]
Description=AI Test Case Generator Backend
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/ai-testcase-generator/backend
Environment="GEMINI_API_KEY=your_key_here"
ExecStart=/usr/local/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000

[Install]
WantedBy=multi-user.target
```

4. **Start service**:
```bash
sudo systemctl daemon-reload
sudo systemctl start testcase-backend
sudo systemctl enable testcase-backend
sudo systemctl status testcase-backend
```

5. **Install Nginx**:
```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/testcase-backend
```

6. **Nginx config** (`/etc/nginx/sites-available/testcase-backend`):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

7. **Enable site**:
```bash
sudo ln -s /etc/nginx/sites-available/testcase-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 2: Frontend on S3 + CloudFront

1. **Build frontend**:
```bash
cd frontend
npm install
npm run build
```

2. **Create S3 Bucket**:
```bash
aws s3 mb s3://ai-testcase-frontend
aws s3 sync dist/ s3://ai-testcase-frontend --acl public-read
```

3. **Configure bucket for static hosting**:
```bash
aws s3 website s3://ai-testcase-frontend --index-document index.html
```

4. **Create CloudFront distribution**:
- Go to AWS Console → CloudFront
- Create distribution
- Origin: Your S3 bucket
- Default root object: index.html
- Wait for deployment (~15 minutes)

5. **Update API URL**:
Edit `frontend/.env.production`:
```bash
VITE_API_URL=https://api.your-domain.com
```

Rebuild and redeploy.

### Step 3: SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

## Option 5: Google Cloud Platform

**$20-50/month | Similar to AWS**

### Backend on Cloud Run

1. **Install gcloud CLI**
2. **Containerize backend**:

Create `backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

3. **Deploy**:
```bash
cd backend
gcloud run deploy ai-testcase-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key_here
```

### Frontend on Firebase Hosting

```bash
cd frontend
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## Option 6: DigitalOcean (Best Value)

**$12/month | Simple & Reliable**

### Step 1: Create Droplet

1. Go to [digitalocean.com](https://digitalocean.com)
2. Create Droplet:
   - Ubuntu 22.04
   - Regular Intel ($12/month)
   - Datacenter near your users

### Step 2: Initial Setup

```bash
ssh root@your-droplet-ip

# Update system
apt update && apt upgrade -y

# Install dependencies
apt install python3-pip python3-venv nginx nodejs npm git -y

# Install PM2 for process management
npm install -g pm2
```

### Step 3: Deploy Backend

```bash
# Clone repository
cd /var/www
git clone https://github.com/yourusername/ai-testcase-generator.git
cd ai-testcase-generator/backend

# Install Python dependencies
pip3 install -r requirements.txt

# Start with PM2
pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name testcase-backend
pm2 save
pm2 startup
```

### Step 4: Deploy Frontend

```bash
cd /var/www/ai-testcase-generator/frontend

# Update API URL in .env
echo "VITE_API_URL=https://api.your-domain.com" > .env

# Build
npm install
npm run build

# Serve with PM2
pm2 serve dist 3000 --name testcase-frontend --spa
pm2 save
```

### Step 5: Configure Nginx

Create `/etc/nginx/sites-available/testcase`:

```nginx
# Backend
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Frontend
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/testcase /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 6: Add SSL

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d your-domain.com -d www.your-domain.com -d api.your-domain.com
```

### Step 7: Set Environment Variables

```bash
# Backend environment
pm2 restart testcase-backend --update-env
pm2 set testcase-backend GEMINI_API_KEY your_key_here
```

**Done! Your app is now live at:**
- Frontend: `https://your-domain.com`
- Backend: `https://api.your-domain.com`

---

## Environment Variables

### Required Environment Variables

**Backend**:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

**Frontend**:
```bash
VITE_API_URL=https://api.your-domain.com
```

### Setting Environment Variables

**Render**:
- Dashboard → Service → Environment → Add Variable

**Railway**:
```bash
railway variables set GEMINI_API_KEY=your_key
```

**Vercel**:
```bash
vercel env add VITE_API_URL production
```

**PM2** (DigitalOcean/VPS):
```bash
pm2 restart app-name --update-env
pm2 set app-name KEY=value
```

**Systemd** (Linux service):
Edit service file and add:
```ini
Environment="KEY=value"
```

---

## Custom Domain Setup

### 1. Point Domain to Your Server

**For Static Hosting (Vercel, Netlify)**:
- Add CNAME record: `www` → `cname.vercel-dns.com`
- Add A record: `@` → Vercel IP

**For VPS (DigitalOcean, AWS EC2)**:
- Add A record: `@` → Your server IP
- Add A record: `www` → Your server IP
- Add A record: `api` → Your server IP

### 2. Update CORS in Backend

```python
allow_origins=[
    "https://your-domain.com",
    "https://www.your-domain.com",
    "http://localhost:5173"  # Keep for local development
]
```

### 3. Update Frontend API URL

```bash
VITE_API_URL=https://api.your-domain.com
```

### 4. Enable SSL

**Automated (Let's Encrypt)**:
```bash
certbot --nginx -d your-domain.com -d www.your-domain.com
```

**Platform-managed**:
- Vercel: Automatic
- Render: Automatic
- Railway: Automatic

---

## Monitoring & Maintenance

### Health Checks

Add to backend (`main.py`):
```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }
```

### Logging

**PM2 Logs**:
```bash
pm2 logs testcase-backend
pm2 logs testcase-frontend
```

**Systemd Logs**:
```bash
journalctl -u testcase-backend -f
```

### Monitoring Services

- **UptimeRobot**: Free uptime monitoring
- **Better Uptime**: Advanced monitoring
- **Sentry**: Error tracking
- **LogRocket**: User session replay

### Backup Strategy

**DigitalOcean**:
- Enable automated backups ($2.40/month)
- Take snapshots before updates

**AWS**:
- Use AMI snapshots
- S3 versioning for frontend

### Updates

```bash
# Pull latest code
git pull origin main

# Backend
cd backend
pip install -r requirements.txt
pm2 restart testcase-backend

# Frontend
cd ../frontend
npm install
npm run build
pm2 restart testcase-frontend
```

---

## Troubleshooting

### Backend Issues

**Service won't start**:
```bash
# Check logs
pm2 logs testcase-backend
# or
journalctl -u testcase-backend -n 50
```

**Port already in use**:
```bash
sudo lsof -i :8000
sudo kill -9 PID
```

**Permission issues**:
```bash
sudo chown -R $USER:$USER /var/www/ai-testcase-generator
```

### Frontend Issues

**Build fails**:
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

**API connection fails**:
- Check CORS settings
- Verify API URL in .env
- Check firewall rules

### SSL Issues

**Certificate renewal**:
```bash
certbot renew --dry-run
certbot renew
```

---

## Cost Comparison

| Platform | Monthly Cost | Free Tier | Auto-scaling |
|----------|-------------|-----------|--------------|
| Render Free | $0 | ✅ Yes | ❌ No |
| Railway | $5+ | Trial | ✅ Yes |
| Vercel + Railway | $5+ | Frontend free | ✅ Yes |
| DigitalOcean | $12 | ❌ No | ❌ No |
| AWS EC2 | $15-30 | 1 year | ❌ No |
| AWS ECS | $30-50 | ❌ No | ✅ Yes |

---

## Recommended Setup by Use Case

**Personal Project / Demo**:
- ✅ Render (Free tier)
- ✅ Railway (Free trial)

**Small Team (1-10 users)**:
- ✅ Vercel + Railway ($5/month)
- ✅ DigitalOcean ($12/month)

**Growing Business (10-100 users)**:
- ✅ DigitalOcean ($24/month for 2 droplets)
- ✅ Railway ($20/month)

**Enterprise (100+ users)**:
- ✅ AWS with auto-scaling
- ✅ Google Cloud Platform
- ✅ Azure

---

## Next Steps

1. Choose your deployment platform
2. Set up version control (GitHub/GitLab)
3. Deploy following the guide above
4. Configure custom domain
5. Enable SSL
6. Set up monitoring
7. Configure backups

**Need help?** Check the specific platform documentation or raise an issue in the GitHub repository.

---

## Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] CORS properly configured
- [ ] Environment variables secured (not in code)
- [ ] API key protected
- [ ] Firewall configured (only ports 80, 443, 22 open)
- [ ] Regular security updates enabled
- [ ] Backup strategy in place
- [ ] Rate limiting configured (if needed)
- [ ] Monitoring alerts set up

---

**You're ready to deploy! Choose your platform and follow the steps above. Good luck! 🚀**
