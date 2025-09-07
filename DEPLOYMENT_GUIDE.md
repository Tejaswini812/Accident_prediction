# Deployment Guide - Startup Village County

## Database Configuration for Production

To ensure data persistence when deployed, you need to set up a cloud database. Here are the steps:

### Option 1: MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**:
   - Go to https://www.mongodb.com/atlas
   - Sign up for a free account
   - Create a new cluster

2. **Get Connection String**:
   - In Atlas dashboard, click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

3. **Set Environment Variables**:
   Create a `.env` file in the `backend` folder with:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/startup-village-county?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
PORT=5000
   ```

### Option 2: Railway/Render Database

1. **Railway**:
   - Deploy to Railway
   - Add MongoDB service
   - Use the provided connection string

2. **Render**:
   - Deploy to Render
   - Add MongoDB service
   - Use the provided connection string

## Frontend Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

## Backend Deployment

### Railway
1. Connect your GitHub repository
2. Set root directory: `backend`
3. Add environment variables
4. Deploy

### Render
1. Create new Web Service
2. Connect GitHub repository
3. Set root directory: `backend`
4. Add environment variables
5. Deploy

## Environment Variables for Production

Create these environment variables in your deployment platform:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/startup-village-county
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
```

## Testing After Deployment

1. **Test Signup**: Create a new account
2. **Test Login**: Login with the created account
3. **Test Data Persistence**: Refresh the page and verify data is still there
4. **Test All Features**: Ensure all sections work properly

## Troubleshooting

### Data Not Persisting
- Check MongoDB connection string
- Verify environment variables are set
- Check database permissions

### Login Issues
- Verify JWT_SECRET is set
- Check if user exists in database
- Verify password hashing

### CORS Issues
- Set FRONTEND_URL environment variable
- Check CORS configuration in server.js

## Current Configuration

The project is now configured to:
- Use MongoDB Atlas by default
- Fallback to local MongoDB if cloud fails
- Persist all user data, signups, and logins
- Work in both development and production

Your data will now persist when deployed! 🚀