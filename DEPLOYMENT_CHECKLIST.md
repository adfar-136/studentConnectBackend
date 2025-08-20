# 🚀 Render Deployment Checklist

## ✅ Pre-Deployment Checklist

- [ ] Server folder has `package.json` with all dependencies
- [ ] `index.js` is properly configured for production
- [ ] Environment variables are documented
- [ ] `.gitignore` excludes sensitive files
- [ ] Health check endpoint `/health` is added
- [ ] CORS is configured for production

## 🔧 Render Configuration

### Environment Variables to Set:
- [ ] `MONGO_URI` - Your MongoDB connection string
- [ ] `JWT_SECRET` - Strong secret for JWT tokens
- [ ] `NODE_ENV` - Set to `production`
- [ ] `CORS_ORIGIN` - Your frontend domain

### Service Settings:
- [ ] **Name**: `iust-university-portal-server`
- [ ] **Environment**: `Node`
- [ ] **Build Command**: `npm install`
- [ ] **Start Command**: `npm start`
- [ ] **Plan**: Free (or paid if needed)

## 📋 Deployment Steps

1. [ ] Push server code to GitHub
2. [ ] Connect GitHub repo to Render
3. [ ] Configure environment variables
4. [ ] Deploy service
5. [ ] Test health endpoint: `/health`
6. [ ] Test API endpoints
7. [ ] Update frontend with new API URL

## 🧪 Post-Deployment Testing

- [ ] Health check endpoint works
- [ ] MongoDB connection successful
- [ ] All API routes respond correctly
- [ ] CORS allows frontend requests
- [ ] Authentication works
- [ ] Database operations function

## 🔍 Troubleshooting Commands

```bash
# Check service status
# View in Render dashboard

# Check logs
# Available in Render dashboard

# Test API locally
curl https://your-service.onrender.com/health

# Test MongoDB connection
# Check logs for connection success
```

## 📞 Support

- Render Documentation: [docs.render.com](https://docs.render.com)
- Check service logs for errors
- Verify environment variables
- Test MongoDB connection locally first

---
**Status**: Ready for deployment! 🎯
