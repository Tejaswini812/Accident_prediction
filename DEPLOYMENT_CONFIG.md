# Production Deployment Configuration for Hostinger

## Environment Variables for Production

Create a `.env` file in the backend folder with these variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration - MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://villagecounty:StartupVillage2025@cluster0.mongodb.net/startup-village-county?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-for-production-change-this
JWT_EXPIRE=7d

# Frontend URL (for CORS) - Update with your actual domain
FRONTEND_URL=https://yourdomain.com

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Custom Domain Configuration
CUSTOM_DOMAIN=yourdomain.com
BASE_URL=https://yourdomain.com
```

## Data Persistence

All data is stored permanently in MongoDB Atlas:

### User Data (Signup/Login)
- **Collection**: `users`
- **Fields**: name, email, phone, password (hashed), address, documents
- **Persistence**: Permanent storage in cloud database

### Form Data (All 6 Features)
- **Properties**: `properties` collection
- **Events**: `events` collection  
- **Land Properties**: `landproperties` collection
- **Products**: `products` collection
- **Packages**: `packages` collection
- **Cars**: `cars` collection

### File Uploads
- **Location**: `uploads/` directory on server
- **Subdirectories**: 
  - `uploads/properties/`
  - `uploads/events/`
  - `uploads/land-properties/`
  - `uploads/products/`
  - `uploads/packages/`
  - `uploads/cars/`
- **Persistence**: Files stored on server disk

## Deployment Steps

1. **Backend Deployment**:
   - Upload backend folder to Hostinger
   - Install dependencies: `npm install`
   - Create `.env` file with production variables
   - Start server: `npm start`

2. **Frontend Deployment**:
   - Build React app: `npm run build`
   - Upload `dist` folder to Hostinger
   - Update API URLs in frontend to point to your domain

3. **Database**:
   - MongoDB Atlas is already configured
   - No additional setup needed
   - Data persists automatically

## API Endpoints

All data is accessible via these endpoints:
- `GET /api/properties` - Get all properties
- `GET /api/events` - Get all events
- `GET /api/land-properties` - Get all land properties
- `GET /api/products` - Get all products
- `GET /api/packages` - Get all packages
- `GET /api/cars` - Get all cars

## Data Flow

1. User signs up/logs in → Data stored in `users` collection
2. User fills form → Data stored in respective collection
3. Images uploaded → Stored in `uploads/` directory
4. Landing page displays → Fetches data from MongoDB
5. All data persists permanently across deployments
