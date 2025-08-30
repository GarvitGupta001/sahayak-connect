# 🚀 Railway Deployment Guide - ML Model API

## Quick Start (5 minutes)

### 1. Prepare Your Repository
Ensure your `ML-model` folder structure is correct:
```
ML-model/
├── src/
│   ├── app.py              ← Main Flask app
│   ├── embeddings_final.pkl ← Your ML data (4MB)
│   ├── requirements.txt    ← Dependencies
│   └── wsgi.py            ← WSGI entry point
├── Dockerfile              ← Docker configuration
├── railway.json            ← Railway config
└── README.md               ← This file
```

### 2. Deploy to Railway

#### Option A: GitHub Integration (Recommended)
1. **Go to [railway.app](https://railway.app)**
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Select the `ML-model` folder** (not the root)
7. **Click "Deploy"**

#### Option B: Manual Upload
1. **Go to [railway.app](https://railway.app)**
2. **Click "New Project"**
3. **Select "Deploy from Template"**
4. **Choose "Docker"**
5. **Upload your ML-model folder as ZIP**

### 3. Wait for Deployment
- Railway will automatically:
  - Build your Docker image
  - Install dependencies
  - Start your service
  - Run health checks

### 4. Get Your API URL
Once deployed, Railway will show you:
- **Service URL**: `https://your-api-name.railway.app`
- **Health Check**: `https://your-api-name.railway.app/health`

## 🧪 Test Your Deployment

### Health Check
```bash
curl https://your-api-name.railway.app/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "data_loaded": true
}
```

### Test API Endpoint
```bash
curl -X POST https://your-api-name.railway.app/schemes \
  -H "Content-Type: application/json" \
  -d '{"prompt": "I need help with education", "k": 3}'
```

## 🔧 Configuration

### Environment Variables (Optional)
In Railway dashboard, you can add:
```
FLASK_ENV=production
DEBUG=false
PORT=5000
```

### Custom Domain (Optional)
1. Go to project settings
2. Click "Custom Domains"
3. Add your domain (e.g., `api.yourdomain.com`)

## 📊 Monitor Your Service

### View Logs
- **Real-time logs** in Railway dashboard
- **Build logs** for troubleshooting
- **Runtime logs** for API requests

### Health Monitoring
- **Automatic health checks** every 30 seconds
- **Auto-restart** on failures
- **Performance metrics** available

## 🔄 Update Your Vercel App

### Update API Base URL
```javascript
// Before (local development)
const API_URL = 'http://localhost:5000';

// After (Railway production)
const API_URL = 'https://your-api-name.railway.app';

// Example usage
const getSchemes = async (prompt) => {
  try {
    const response = await fetch(`${API_URL}/schemes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, k: 5 })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

### Test Integration
```javascript
// Test the connection
const testAPI = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    const health = await response.json();
    console.log('API Health:', health);
    return health.status === 'healthy';
  } catch (error) {
    console.error('API not reachable:', error);
    return false;
  }
};
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check if `embeddings_final.pkl` exists in `src/` folder
   - Verify Dockerfile syntax
   - Check Railway build logs

2. **Service Won't Start**
   - Check Railway runtime logs
   - Verify port configuration
   - Check memory requirements

3. **API Not Responding**
   - Verify service is running
   - Check health endpoint
   - Review Railway logs

4. **Memory Issues**
   - Your model needs ~2GB RAM
   - Railway free tier: 512MB
   - **Solution**: Upgrade to paid plan

### Performance Tips

- **Cold Start**: First request takes 10-30 seconds (model loading)
- **Warm Requests**: Subsequent requests are fast (100-500ms)
- **Memory**: Model stays loaded in memory
- **Scaling**: Railway auto-scales based on demand

## 💰 Pricing

| Plan | RAM | CPU | Hours/Month | Cost |
|------|-----|-----|-------------|------|
| **Free** | 512MB | 0.5 | 500 | $0 |
| **Starter** | 1GB | 1 | Unlimited | $5 |
| **Standard** | 2GB | 2 | Unlimited | $10 |

**Recommendation**: Start with free tier, upgrade to Starter ($5/month) for production use.

## 🔄 Updates & Maintenance

### Automatic Updates
- **GitHub Integration**: Push to main branch → Auto-deploy
- **Manual Trigger**: Redeploy from Railway dashboard

### Monitoring
- **Uptime**: Check Railway dashboard
- **Performance**: Monitor response times
- **Errors**: Review logs regularly

## 📞 Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Community**: [discord.gg/railway](https://discord.gg/railway)
- **Support**: Available in Railway dashboard

## 🎉 Success Checklist

- [ ] Repository connected to Railway
- [ ] Service deployed successfully
- [ ] Health check passes
- [ ] API endpoint responds
- [ ] Vercel app updated with new API URL
- [ ] Integration tested
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up

---

**Your ML Model API is now ready for production use! 🚀**
