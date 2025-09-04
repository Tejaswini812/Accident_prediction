# Startup Village County - Backend API

## Overview
This is the backend API for Startup Village County, a platform for property hosting, event management, and community building.

## Features
- User authentication and authorization
- Government proof verification system
- Admin approval workflow via email
- Property management (CRUD operations)
- Event management (CRUD operations)
- File upload handling
- Email notifications
- MongoDB integration

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/startup-village-county

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration (Gmail)
EMAIL_USER=villagecounty2025@gmail.com
EMAIL_PASS=Startup@12345

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads
```

### 3. Database Setup
Make sure MongoDB is running on your system:
```bash
# Start MongoDB (if installed locally)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env file
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Properties
- `POST /api/properties` - Create property (protected)
- `GET /api/properties` - Get all approved properties
- `GET /api/properties/:id` - Get single property
- `GET /api/properties/my-properties` - Get user's properties (protected)
- `PUT /api/properties/:id` - Update property (protected)
- `DELETE /api/properties/:id` - Delete property (protected)

### Events
- `POST /api/events` - Create event (protected)
- `GET /api/events` - Get all approved events
- `GET /api/events/:id` - Get single event
- `GET /api/events/my-events` - Get user's events (protected)
- `PUT /api/events/:id` - Update event (protected)
- `DELETE /api/events/:id` - Delete event (protected)
- `POST /api/events/:id/book` - Book event (protected)

### Admin
- `GET /api/admin/pending-users` - Get pending users
- `POST /api/admin/approve/:userId` - Approve user
- `POST /api/admin/reject/:userId` - Reject user
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get dashboard statistics

## Authentication Flow

1. **User Registration**: User fills out signup form with government proof
2. **Email Notification**: Admin receives email with approval/rejection links
3. **Admin Approval**: Admin reviews documents and approves/rejects user
4. **User Login**: Approved users can log in and access protected features
5. **Protected Actions**: Users can host properties and create events

## File Uploads

The API handles file uploads for:
- Government proof documents (images/PDFs)
- Property images
- Event images

Files are stored in the `uploads/` directory with the following structure:
```
uploads/
├── documents/     # Government proof documents
├── properties/    # Property images
└── events/        # Event images
```

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- File upload validation
- Input validation and sanitization

## Email Integration

The system uses Gmail SMTP for sending emails:
- User registration confirmation
- Admin approval notifications
- User approval/rejection notifications

## Database Models

### User
- Personal information
- Government proof details
- Approval status
- Associated properties and events

### Property
- Property details
- Location information
- Pricing and amenities
- Owner reference
- Approval status

### Event
- Event details
- Date and time
- Location information
- Organizer reference
- Booking capacity
- Approval status

## Error Handling

The API includes comprehensive error handling:
- Validation errors
- Authentication errors
- File upload errors
- Database errors
- Email sending errors

## Development

### Running in Development Mode
```bash
npm run dev
```

This will start the server with nodemon for automatic restarts on file changes.

### Testing
```bash
# Run tests (when implemented)
npm test
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Configure production MongoDB URI
4. Set up proper file storage (AWS S3, etc.)
5. Configure production email service
6. Set up proper logging and monitoring

## Support

For support or questions, contact the development team at villagecounty2025@gmail.com
