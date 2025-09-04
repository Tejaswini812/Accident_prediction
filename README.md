# Startup Village County - React.js + Node.js

A modern, full-stack web application for property management, events, and e-commerce built with React.js and Node.js, designed for deployment on Hostinger MERN stack VPS.

## 🚀 Features

- **Property Management**: List and manage properties for rent/sale
- **Event Management**: Create and manage community events
- **E-commerce**: Product listing and management
- **User Authentication**: Secure user registration and login
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Chat**: User connection and communication
- **Dashboard**: Comprehensive admin dashboard

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - Modern UI library
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
startup-village-county/
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── context/           # React context
│   ├── styles/            # CSS files
│   └── main.jsx           # Entry point
├── backend/               # Node.js backend
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── server.js          # Server entry point
├── public/                # Static assets
└── dist/                  # Production build
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- MongoDB
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd startup-village-county
```

2. **Install dependencies**
```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Or install separately
npm install                    # Frontend dependencies
cd backend && npm install      # Backend dependencies
```

3. **Environment Setup**
```bash
# Copy environment file
cp backend/env.example backend/.env

# Edit the .env file with your configuration
nano backend/.env
```

4. **Start Development Server**
```bash
# Start both frontend and backend
npm start

# Or start separately
npm run dev                    # Frontend (port 3000)
npm run server:dev            # Backend (port 5000)
```

## 🌐 Production Deployment (Hostinger VPS)

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install MongoDB
sudo apt install -y mongodb

# Install Nginx
sudo apt install -y nginx
```

### 2. Deploy Application

```bash
# Clone repository
git clone <repository-url>
cd startup-village-county

# Install dependencies
npm run install:all

# Build frontend
npm run build

# Start backend with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 3. Configure Nginx

```bash
# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/startup-village
sudo ln -s /etc/nginx/sites-available/startup-village /etc/nginx/sites-enabled/

# Copy built files
sudo cp -r dist/* /var/www/html/

# Restart nginx
sudo systemctl restart nginx
```

### 4. SSL Certificate (Optional)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

## 🔧 Configuration

### Environment Variables

Create `backend/.env` file:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/startup-village-county
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://yourdomain.com
```

### Database Setup

```bash
# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create database
mongo
use startup-village-county
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify token

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/:id` - Get single hotel
- `POST /api/hotels` - Create hotel
- `PUT /api/hotels/:id` - Update hotel
- `DELETE /api/hotels/:id` - Delete hotel

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Accessories
- `GET /api/accessories` - Get all accessories
- `GET /api/accessories/:id` - Get single accessory
- `POST /api/accessories` - Create accessory
- `PUT /api/accessories/:id` - Update accessory
- `DELETE /api/accessories/:id` - Delete accessory

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

## 🎨 Customization

### Styling
- Edit `src/styles/components.css` for custom styles
- Modify Tailwind classes in components
- Update color scheme in CSS variables

### Features
- Add new components in `src/components/`
- Create new pages in `src/pages/`
- Add API routes in `backend/routes/`

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation
- Helmet security headers

## 📊 Performance

- React code splitting
- Image optimization
- Gzip compression
- Static asset caching
- Database indexing

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
```bash
# Kill process on port 5000
sudo lsof -ti:5000 | xargs kill -9
```

2. **MongoDB connection error**
```bash
# Start MongoDB service
sudo systemctl start mongodb
```

3. **Build errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

For support and questions:
- Email: connect01@startupvillagecounty.in
- WhatsApp: +91 7676558020

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first CSS
- MongoDB for the flexible database
- Hostinger for the reliable hosting platform

---

**Built with ❤️ for Startup Village County**
