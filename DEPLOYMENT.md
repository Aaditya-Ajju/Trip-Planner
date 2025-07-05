# Deployment Guide - Vercel (Frontend) + Render (Backend)

## Backend Deployment (Render)

### 1. Render Setup
1. Go to [Render.com](https://render.com) and create an account
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `wanderwise-backend` (or your preferred name)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2. Environment Variables (Render Dashboard)
Add these environment variables in Render dashboard:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wanderwise
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project.iam.gserviceaccount.com
FRONTEND_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
```

### 3. MongoDB Atlas Setup
1. Create MongoDB Atlas account
2. Create a new cluster
3. Get connection string and replace in `MONGODB_URI`

### 4. Firebase Admin SDK Setup
1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Copy all the values to environment variables

## Frontend Deployment (Vercel)

### 1. Vercel Setup
1. Go to [Vercel.com](https://vercel.com) and create account
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2. Environment Variables (Vercel Dashboard)
Add these environment variables in Vercel dashboard:

```
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_API_URL=https://your-backend-domain.onrender.com/api
```

### 3. Firebase Web App Setup
1. Go to Firebase Console → Project Settings → General
2. Add web app if not already added
3. Copy configuration values to environment variables

## Post-Deployment Steps

### 1. Update CORS Configuration
After getting your Vercel domain, update the `FRONTEND_URL` in Render environment variables:
```
FRONTEND_URL=https://your-app-name.vercel.app
```

### 2. Test API Communication
1. Visit your Vercel app
2. Open browser dev tools
3. Check Network tab for API calls
4. Verify CORS errors are resolved

### 3. Health Check
Test your backend API:
```
https://your-backend-domain.onrender.com/api/health
```

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` is correctly set in Render
- Check that the URL includes `https://` protocol
- Verify no trailing slashes

### API Connection Issues
- Check if backend is running on Render
- Verify environment variables are set correctly
- Test API endpoints directly

### Build Errors
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check for missing environment variables

## Security Notes

1. **Never commit `.env` files** - they're in `.gitignore`
2. **Use environment variables** for all sensitive data
3. **Enable HTTPS** - both Vercel and Render provide this automatically
4. **Regular security updates** - keep dependencies updated

## Monitoring

### Render Monitoring
- Check logs in Render dashboard
- Monitor resource usage
- Set up alerts for downtime

### Vercel Monitoring
- Check deployment status
- Monitor performance metrics
- Review error logs

## Cost Optimization

### Render
- Free tier: 750 hours/month
- Auto-sleep after 15 minutes of inactivity
- Upgrade for 24/7 availability

### Vercel
- Free tier: 100GB bandwidth/month
- Automatic scaling
- Global CDN included 