# 🚀 Hostinger Deployment Guide - MERN Stack

## ✅ Data Persistence Confirmed

Your application is **fully configured for permanent data storage**:

### 🔐 User Data (Signup/Login)
- **Storage**: MongoDB Atlas (Cloud Database)
- **Collection**: `users`
- **Persistence**: ✅ **PERMANENT** - Survives server restarts, deployments, and updates
- **Fields**: name, email, phone, password (encrypted), address, documents

### 📝 Form Data (All 6 Features)
- **Properties**: `properties` collection
- **Events**: `events` collection  
- **Land Properties**: `landproperties` collection
- **Products**: `products` collection
- **Packages**: `packages` collection
- **Cars**: `cars` collection
- **Persistence**: ✅ **PERMANENT** - All data stored in cloud database

### 📁 File Uploads
- **Storage**: Server disk + MongoDB references
- **Location**: `uploads/` directory on your server
- **Persistence**: ✅ **PERMANENT** - Files stored on server disk

---

## 🛠️ Deployment Steps

### Step 1: Prepare Your Domain
1. Get your domain from Hostinger (e.g., `yourdomain.com`)
2. Update the domain in these files:
   - `src/config/api.js` - Change `yourdomain.com` to your actual domain
   - `backend/.env` - Update `FRONTEND_URL`, `CUSTOM_DOMAIN`, `BASE_URL`

### Step 2: Backend Deployment
1. **Upload backend folder** to your Hostinger server
2. **SSH into your server** and navigate to backend folder
3. **Install dependencies**: `npm install`
4. **Create .env file** with these variables:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://villagecounty:StartupVillage2025@cluster0.mongodb.net/startup-village-county?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-for-production-change-this
JWT_EXPIRE=7d
FRONTEND_URL=https://yourdomain.com
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CUSTOM_DOMAIN=yourdomain.com
BASE_URL=https://yourdomain.com
```

5. **Start server**: `npm start`

### Step 3: Frontend Deployment
1. **Build React app**: `npm run build`
2. **Upload `dist` folder contents** to your `public_html` directory
3. **Test your domain** - should show the website

### Step 4: Test Data Persistence
1. **Register a new user** → Check if data appears in MongoDB Atlas
2. **Fill any form** (Property, Event, etc.) → Check if data is saved
3. **Upload images** → Check if files are stored in uploads/ directory
4. **Restart server** → Data should still be there
5. **Check landing page** → Should display your submitted data

---

## 🔧 Quick Commands

```bash
# Build for production
npm run build

# Start backend server
cd backend
npm install
npm start

# Check if server is running
curl https://yourdomain.com/api/health
```

---

## 📊 Data Flow After Deployment

1. **User visits** `https://yourdomain.com`
2. **Clicks dashboard button** → Authentication required modal
3. **Signs up/logs in** → Data stored in MongoDB Atlas
4. **Fills form** → Data stored in respective MongoDB collection
5. **Uploads images** → Files stored in server uploads/ directory
6. **Submits form** → Success message, data appears on landing page
7. **Data persists** → Forever, even after server restarts

---

## 🎯 What Happens After Deployment

- ✅ **All user accounts persist permanently**
- ✅ **All form submissions persist permanently**  
- ✅ **All uploaded images persist permanently**
- ✅ **Landing page shows real data from database**
- ✅ **Authentication works across all features**
- ✅ **Data survives server restarts and updates**

---

## 🆘 Troubleshooting

**If data doesn't persist:**
1. Check MongoDB Atlas connection in backend logs
2. Verify .env file has correct MONGODB_URI
3. Check server uploads/ directory permissions

**If API calls fail:**
1. Update `src/config/api.js` with your actual domain
2. Check CORS settings in backend
3. Verify backend is running on correct port

**If images don't upload:**
1. Check uploads/ directory exists and has write permissions
2. Verify MAX_FILE_SIZE in .env file
3. Check server disk space

---

## 🎉 Success!

Once deployed, your application will have **permanent data storage** and work exactly the same as in development, but with real users and real data that persists forever!
