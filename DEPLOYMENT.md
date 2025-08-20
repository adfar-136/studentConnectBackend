# Render Deployment Guide

This guide will help you deploy your IUST University Portal server to Render.

## Prerequisites

1. **GitHub Repository**: Your server code should be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas**: Your cloud MongoDB database should be set up

## Step 1: Prepare Your Server Repository

Make sure your server folder contains these essential files:
- `package.json` ✅
- `index.js` ✅
- `models/` folder ✅
- `routes/` folder ✅
- `controllers/` folder ✅
- `middleware/` folder ✅

## Step 2: Deploy to Render

### 2.1 Connect GitHub Repository

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" and select "Web Service"
3. Connect your GitHub account if not already connected
4. Select your server repository
5. Choose the branch you want to deploy (usually `main` or `master`)

### 2.2 Configure the Service

**Basic Settings:**
- **Name**: `iust-university-portal-server` (or any name you prefer)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (if server is in root) or specify if in subfolder

**Build & Deploy Settings:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or choose paid plan if needed)

### 2.3 Environment Variables

Add these environment variables in Render:

| Key | Value | Description |
|-----|-------|-------------|
| `MONGO_URI` | `mongodb+srv://username:password@cluster.mongodb.net/database` | Your MongoDB connection string |
| `JWT_SECRET` | `your_secret_key_here` | A random string for JWT tokens |
| `NODE_ENV` | `production` | Environment setting |
| `CORS_ORIGIN` | `https://iustportal.netlify.app` | Your frontend URL (Netlify deployment) |

**Important**: 
- Replace `username:password` with your actual MongoDB credentials
- Generate a strong JWT_SECRET (you can use a random string generator)
- CORS_ORIGIN is automatically configured to allow your Netlify frontend

### 2.4 Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your service
3. Wait for the build to complete (usually 2-5 minutes)

## Step 3: Verify Deployment

### 3.1 Check Service Status

- Green status means your service is running
- Check the logs for any errors
- Your service URL will be: `https://your-service-name.onrender.com`

### 3.2 Test the API

Test your API endpoints:
```bash
# Test root endpoint
curl https://your-service-name.onrender.com/

# Test health check
curl https://your-service-name.onrender.com/api/health
```

## Step 4: Update Frontend Configuration

Update your frontend to use the new API URL:

```typescript
// In your frontend API configuration
const API_BASE_URL = 'https://your-service-name.onrender.com/api';
```

**Note**: CORS is automatically configured to allow requests from:
- `https://iustportal.netlify.app` (your deployed frontend)
- `http://localhost:5173` (local development)
- Any URL specified in `CORS_ORIGIN` environment variable

## Step 5: Seed Database (Optional)

If you want to seed your production database:

1. Go to your Render service dashboard
2. Click on "Shell" tab
3. Run the seeding command:
   ```bash
   npm run seed:db
   ```

## Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check if all dependencies are in `package.json`
   - Verify Node.js version compatibility
   - Check build logs for specific errors

2. **Service Won't Start**
   - Verify environment variables are set correctly
   - Check MongoDB connection string
   - Review service logs

3. **CORS Errors**
   - Set `CORS_ORIGIN` to your frontend domain
   - Or temporarily set to `*` for testing

4. **MongoDB Connection Issues**
   - Verify your MongoDB Atlas network access settings
   - Check if your IP is whitelisted (or set to allow all: 0.0.0.0/0)

### Useful Commands:

```bash
# Check service logs
# (Available in Render dashboard)

# Restart service
# (Available in Render dashboard)

# View environment variables
# (Available in Render dashboard)
```

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_URI` | ✅ | None | MongoDB connection string |
| `JWT_SECRET` | ✅ | None | Secret for JWT tokens |
| `NODE_ENV` | ❌ | `production` | Environment setting |
| `CORS_ORIGIN` | ❌ | `http://localhost:5173` | Allowed CORS origin |
| `PORT` | ❌ | `4000` | Server port (Render sets this automatically) |

## Security Notes

1. **Never commit sensitive data** like passwords or API keys
2. **Use environment variables** for all configuration
3. **Set up proper CORS** for production
4. **Use HTTPS** (Render provides this automatically)
5. **Regularly update dependencies** for security patches

## Support

If you encounter issues:
1. Check the Render documentation
2. Review your service logs
3. Verify your environment variables
4. Test your MongoDB connection locally first

## Next Steps

After successful deployment:
1. Update your frontend to use the new API URL
2. Test all API endpoints
3. Monitor your service performance
4. Set up monitoring and alerts if needed
