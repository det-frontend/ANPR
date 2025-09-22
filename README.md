# ANPR Vehicle Management System

A comprehensive Automatic Number Plate Recognition (ANPR) system for vehicle entry tracking and management in logistics and industrial environments.

## 🚀 Features

- **Vehicle Plate Recognition**: Manual input and CCTV simulation
- **Vehicle Registration**: Comprehensive form with validation
- **Real-time Dashboard**: Analytics, statistics, and filtering
- **Role-based Access**: Manager and Client roles
- **Data Export**: CSV export functionality
- **Modern UI**: Dark theme with responsive design
- **API-first Architecture**: RESTful API endpoints
- **MongoDB Integration**: Scalable data storage

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: JWT with HTTP-only cookies
- **Deployment**: Docker, Docker Compose, Nginx

## 📋 Prerequisites

- Node.js 18+
- Docker and Docker Compose
- MongoDB (or MongoDB Atlas)

## 🚀 Quick Start

### Option 1: Docker Deployment (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd project-anpr
   ```

2. **Configure environment variables**

   ```bash
   cp env.example .env
   # Edit .env with your production values
   ```

3. **Run deployment script**

   ```bash
   ./deploy.sh
   ```

4. **Access the application**
   - Main App: http://localhost:3000
   - Default Manager: `manager` / `manager123`
   - Default Client: `client` / `client123`

### Option 2: Manual Deployment

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp env.example .env
   # Update .env with your configuration
   ```

3. **Build and start**
   ```bash
   npm run build
   npm start
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/anpr_system

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Production Configuration
NODE_ENV=production
```

### MongoDB Setup

#### Local MongoDB

```bash
# Using Docker
docker run -d --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:7.0
```

#### MongoDB Atlas

1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Update `MONGODB_URI` in `.env`

## 📊 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/seed` - Create default users

### Vehicles

- `POST /api/add-vehicle` - Register new vehicle
- `GET /api/check-plate?plate=TRUCK_NUMBER` - Check vehicle existence
- `GET /api/vehicles` - Get all vehicles
- `POST /api/seed-data` - Load sample data

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services Included

- **ANPR Application**: Next.js app on port 3000
- **MongoDB**: Database on port 27017
- **Nginx**: Reverse proxy on port 80 (optional)

## 🔒 Security Features

- JWT authentication with HTTP-only cookies
- Role-based access control
- Rate limiting on API endpoints
- Security headers (XSS, CSRF protection)
- Input validation and sanitization
- Password hashing with bcrypt

## 📈 Monitoring & Logs

### Application Logs

```bash
# View application logs
docker-compose logs anpr-app

# View MongoDB logs
docker-compose logs mongodb
```

### Health Checks

- Application: `http://localhost:3000/api/vehicles`
- MongoDB: `docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"`

## 🔄 Database Management

### Backup

```bash
# Backup MongoDB data
docker-compose exec mongodb mongodump --out /backup
docker cp anpr-mongodb:/backup ./backup
```

### Restore

```bash
# Restore MongoDB data
docker cp ./backup anpr-mongodb:/backup
docker-compose exec mongodb mongorestore /backup
```

## 🚀 Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/anpr_system
JWT_SECRET=your-very-long-secure-jwt-secret
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret
```

### SSL/HTTPS Setup

1. **Obtain SSL certificates**
2. **Update nginx.conf** with SSL configuration
3. **Uncomment HTTPS server block** in nginx.conf
4. **Update environment variables** with HTTPS URLs

### Scaling

- **Horizontal Scaling**: Use load balancer with multiple app instances
- **Database Scaling**: Use MongoDB Atlas or MongoDB cluster
- **Caching**: Add Redis for session storage and caching

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**

   - Check `MONGODB_URI` in `.env`
   - Ensure MongoDB is running
   - Verify network connectivity

2. **Build Errors**

   - Clear `.next` directory: `rm -rf .next`
   - Reinstall dependencies: `npm ci`
   - Check TypeScript errors: `npm run lint`

3. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check cookie settings
   - Clear browser cookies

### Debug Mode

```bash
# Enable debug logging
NODE_ENV=development npm run dev

# View detailed logs
docker-compose logs -f anpr-app
```

## 📝 Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

### Project Structure

```
project-anpr/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── dashboard/         # Manager dashboard
│   ├── login/            # Authentication
│   └── page.tsx          # Main page
├── components/           # React components
├── contexts/            # React contexts
├── lib/                 # Utility libraries
├── hooks/               # Custom hooks
└── public/              # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**ANPR Vehicle Management System** - Streamlining vehicle entry and tracking for modern logistics operations.
