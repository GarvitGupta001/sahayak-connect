# ML Model Deployment - Government Scheme Recommendation System

This repository contains a machine learning model that provides government scheme recommendations based on user queries using sentence embeddings and cosine similarity.


## 📊 API Endpoints

### Health Check
```
GET /health
```
Returns the health status of the service and whether the model is loaded.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "data_loaded": true
}
```

### Get Scheme Recommendations
```
POST /schemes
```

**Request Body:**
```json
{
  "prompt": "I am a poor farmer looking for financial assistance",
  "k": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "scheme_name": "PM-KISAN",
      "details": "Direct income support to farmers",
      "benefits": "Rs. 6000 per year",
      "schemeCategory": "Agriculture"
    }
  ],
  "query": "I am a poor farmer looking for financial assistance"
}
```

### Alternative Endpoint
```
GET /schemes/{text}
```
Get recommendations using URL parameter instead of POST body.

## 🏗️ Architecture

- **Model**: SentenceTransformer (all-MiniLM-L6-v2)
- **Similarity**: Cosine similarity between embeddings
- **Framework**: Flask with CORS support
- **Deployment**: Railway with Docker container
- **Data**: Pre-computed embeddings stored in pickle format

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (set by Railway)
- `HOST`: Server host (0.0.0.0)
- `DEBUG`: Debug mode (false in production)

### Railway Configuration
- **Auto-scaling** based on demand
- **Health checks** every 30 seconds
- **Auto-restart** on failure
- **Built-in monitoring** and logs

## 📁 Project Structure

```
ML-model/
├── src/
│   ├── app.py              # Main Flask application
│   ├── wsgi.py             # WSGI entry point
│   ├── requirements.txt    # Python dependencies
│   ├── embeddings_final.pkl # Pre-computed embeddings
│   └── getting_schemes.py  # Original implementation
├── Dockerfile              # Docker image definition
├── railway.json            # Railway configuration
├── Procfile                # Heroku compatibility
├── deploy.sh               # Local deployment script
├── deploy.bat              # Windows deployment script
└── README.md               # This file
```

## 🧪 Testing the API

### Using curl
```bash
# Health check
curl https://your-api-name.railway.app/health

# Get recommendations
curl -X POST https://your-api-name.railway.app/schemes \
  -H "Content-Type: application/json" \
  -d '{"prompt": "I need help with education", "k": 3}'
```

### Using Python
```python
import requests

# Health check
response = requests.get('https://your-api-name.railway.app/health')
print(response.json())

# Get recommendations
data = {
    "prompt": "I need help with education",
    "k": 3
}
response = requests.post('https://your-api-name.railway.app/schemes', json=data)
print(response.json())
```

## 🔍 Monitoring and Logs

### View Logs
- **Real-time logs** in Railway dashboard
- **Build logs** for troubleshooting
- **Runtime logs** for API requests

### Health Monitoring
The service includes built-in health checks:
- Railway health check every 30 seconds
- `/health` endpoint for manual monitoring
- Automatic restart on failure

## 🚨 Troubleshooting

### Common Issues

1. **Build fails**
   - Ensure `embeddings_final.pkl` exists in `src/` directory
   - Check Railway build logs
   - Verify Dockerfile syntax

2. **Service won't start**
   - Check Railway runtime logs
   - Verify port configuration
   - Check memory requirements

3. **Memory issues**
   - Your model needs ~2GB RAM
   - Railway free tier: 512MB
   - **Solution**: Upgrade to paid plan ($5/month)

### Performance Tips

- **Cold Start**: First request takes 10-30 seconds (model loading)
- **Warm Requests**: Subsequent requests are fast (100-500ms)
- **Memory**: Model stays loaded in memory
- **Scaling**: Railway auto-scales based on demand

## 💰 Railway Pricing

| Plan | RAM | CPU | Hours/Month | Cost |
|------|-----|-----|-------------|------|
| **Free** | 512MB | 0.5 | 500 | $0 |
| **Starter** | 1GB | 1 | Unlimited | $5 |
| **Standard** | 2GB | 2 | Unlimited | $10 |

**Recommendation**: Start with free tier, upgrade to Starter ($5/month) for production use.

## 🔄 Updates and Maintenance

### Update the Service
- **Automatic**: Railway auto-deploys when you push to GitHub
- **Manual**: Trigger redeploy from Railway dashboard

### Monitoring
- **Uptime**: Check Railway dashboard
- **Performance**: Monitor response times
- **Errors**: Review logs regularly

## 🔒 Security Considerations

- Service runs on Railway's secure infrastructure
- HTTPS enabled by default
- CORS enabled for cross-origin requests
- Non-root user in Docker container

## 📞 Support

For issues or questions:
1. Check Railway logs: `railway logs`
2. Verify health: `curl https://your-api-name.railway.app/health`
3. Check Railway dashboard for service status
4. Railway documentation: [docs.railway.app](https://docs.railway.app)
5. Community Discord: [discord.gg/railway](https://discord.gg/railway)

## 📝 License

This project is part of the Sahayak Connect system.

---

**For detailed deployment instructions, see [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)**
