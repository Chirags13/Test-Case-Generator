# 🚀 Quick Deployment Cheat Sheet

Choose your deployment method and follow the commands below.

## 🐳 Docker (Easiest - 5 minutes)

**Local Testing:**
```bash
cp .env.docker.example .env
# Edit .env with your Gemini API key
docker-compose up -d
# Access at http://localhost
```

**Production (VPS):**
```bash
# 1. SSH to your server
ssh root@your-server-ip

# 2. Install Docker
curl -fsSL https://get.docker.com | sh
apt install docker-compose -y

# 3. Clone and deploy
git clone https://github.com/yourusername/ai-testcase-generator.git
cd ai-testcase-generator
nano .env  # Add GEMINI_API_KEY
docker-compose up -d

# 4. Setup SSL (optional)
apt install nginx certbot -y
certbot --nginx -d yourdomain.com
```

**That's it! 🎉**

---

## ☁️ Render.com (Free Tier)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Deploy"
git remote add origin https://github.com/yourusername/repo.git
git push -u origin main

# 2. Go to render.com
# - Sign up with GitHub
# - New → Blueprint
# - Connect repository
# - Add GEMINI_API_KEY environment variable
# - Deploy
```

**URLs:**
- Backend: `https://your-app-backend.onrender.com`
- Frontend: `https://your-app.onrender.com`

---

## 🚂 Railway ($5/month)

```bash
npm install -g @railway/cli
railway login

# Backend
cd backend
railway init
railway up
railway variables set GEMINI_API_KEY=your_key
railway domain  # Get backend URL

# Frontend  
cd ../frontend
railway init
railway variables set VITE_API_URL=https://backend-url.railway.app
railway up
railway domain  # Get frontend URL
```

---

## ▲ Vercel + Railway (Recommended)

**Backend (Railway):**
```bash
cd backend
railway init
railway up
railway variables set GEMINI_API_KEY=your_key
railway domain  # Copy this URL
```

**Frontend (Vercel):**
```bash
npm install -g vercel
cd ../frontend
vercel
vercel env add VITE_API_URL production
# Paste Railway backend URL
vercel --prod
```

**Perfect setup! Frontend on CDN, backend auto-scales.**

---

## 💧 DigitalOcean ($12/month)

```bash
# 1. Create Droplet (Ubuntu 22.04, $12/month)

# 2. SSH and install
ssh root@droplet-ip
curl -fsSL https://get.docker.com | sh
apt install docker-compose nginx certbot -y

# 3. Deploy
git clone https://github.com/yourusername/ai-testcase-generator.git
cd ai-testcase-generator
nano .env  # Add GEMINI_API_KEY
docker-compose up -d

# 4. Setup domain
certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

---

## ⚡ Environment Variables Quick Reference

**.env (Docker):**
```bash
GEMINI_API_KEY=your_gemini_api_key
VITE_API_URL=http://localhost:8000  # or https://api.yourdomain.com
```

**Backend:**
- `GEMINI_API_KEY` - Your Gemini API key (required)

**Frontend:**
- `VITE_API_URL` - Backend URL (required)

---

## 🔧 Common Commands

**Docker:**
```bash
docker-compose up -d          # Start
docker-compose down           # Stop
docker-compose logs -f        # View logs
docker-compose restart        # Restart
docker-compose up -d --build  # Rebuild
```

**Railway:**
```bash
railway up                    # Deploy
railway logs                  # View logs
railway variables             # List env vars
railway domain                # Get URL
```

**Vercel:**
```bash
vercel                        # Deploy preview
vercel --prod                 # Deploy production
vercel logs                   # View logs
vercel env ls                 # List env vars
```

---

## 🌍 Update CORS After Deployment

Edit `backend/main.py`:
```python
allow_origins=[
    "http://localhost:5173",           # Local dev
    "https://your-domain.com",         # Production
    "https://your-app.vercel.app",     # Vercel
]
```

Redeploy backend after changing CORS.

---

## 📊 Cost Summary

| Platform | Monthly Cost | Setup Time | Best For |
|----------|-------------|------------|----------|
| Docker (local) | $0 | 5 min | Testing |
| Render | $0 (free tier) | 10 min | Demos |
| Railway | $5 | 5 min | Small teams |
| Vercel + Railway | $5 | 10 min | **Recommended** |
| DigitalOcean | $12 | 15 min | Best value |
| AWS | $30+ | 30 min | Enterprise |

---

## 🆘 Troubleshooting

**Frontend can't reach backend:**
```bash
# 1. Check backend is running
curl http://localhost:8000/health

# 2. Check CORS in backend/main.py
# 3. Check VITE_API_URL in frontend .env
# 4. Rebuild frontend:
docker-compose up -d --build frontend
```

**Port already in use:**
```bash
# Find and kill process
lsof -i :8000
kill -9 PID

# Or change port in docker-compose.yml
```

**SSL certificate issues:**
```bash
# Renew certificate
certbot renew
systemctl restart nginx
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend health check works: `/health`
- [ ] Frontend loads and displays UI
- [ ] Can submit requirements
- [ ] AI interpretation works (check API key)
- [ ] Test cases generate successfully
- [ ] Excel export works
- [ ] SSL certificate installed (production)
- [ ] Domain configured (production)
- [ ] Monitoring setup (optional)

---

## 📚 Full Guides

- **Complete options:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Docker details:** [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)
- **Local setup:** [README.md](README.md)

---

**Pick your platform and deploy in minutes! 🎉**
