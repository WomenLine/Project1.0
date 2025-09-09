# Womenline 2.0 Deployment Guide

## 🚀 Deployment to Render.com

### Current Deployment URL
**Production:** https://team5555-womenline-03.onrender.com

### 🛠️ Deployment Configuration

#### 1. Render.com Configuration
- **Service Type:** Static Site
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `build`
- **Node Version:** 18.17.0

#### 2. Environment Variables
```bash
NODE_VERSION=18.17.0
REACT_APP_API_URL=https://team5555-womenline-03.onrender.com
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
```

#### 3. Build Configuration
The application is configured to:
- Build as a static React app
- Serve from the `build` directory
- Handle client-side routing with fallback to index.html
- Connect to the backend API at the specified URL

### 🔧 Local Development

#### Prerequisites
- Node.js 18.17.0 or higher
- npm or yarn

#### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start
```

#### Available Scripts
- `npm start` - Start development server on port 8000
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run deploy` - Build and serve locally

### 🌐 API Integration

#### Backend API
- **Base URL:** https://team5555-womenline-03.onrender.com
- **Authentication:** JWT Bearer tokens
- **Endpoints:** 
  - `/api/auth/*` - Authentication
  - `/api/journals` - Journal entries
  - `/api/upload/*` - File uploads
  - `/api/rewards/*` - Reward system

#### Features Integrated
- ✅ User authentication (login/signup)
- ✅ Journal/mood tracking
- ✅ Period tracking
- ✅ Mental wellness tracking
- ✅ Health summary PDF generation
- ✅ File uploads
- ✅ Reward system
- ✅ Multi-language support

### 📱 Application Features

#### Core Features
1. **Authentication System**
   - User registration and login
   - JWT token-based authentication
   - Protected routes

2. **Health Tracking**
   - Period tracker with calendar view
   - Mental wellness mood tracking
   - Health data management
   - Health summary PDF generator

3. **Safety & Education**
   - Safety tutorials
   - Educational content
   - Emergency information

4. **Reward System**
   - Coin earning mechanism
   - Achievement tracking
   - Progress visualization

#### New Features (Recently Added)
- **Health Summary PDF Generator**
  - Comprehensive form for gynecologist visits
  - Real-time preview
  - PDF download functionality
  - Responsive design

### 🔄 Deployment Process

#### Automatic Deployment
1. Connect your GitHub repository to Render.com
2. Configure the build settings:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`
   - **Node Version:** 18.17.0

#### Manual Deployment
```bash
# Build the application
npm run build

# The build folder will be created with static files
# Upload the contents of the build folder to your hosting service
```

### 🐛 Troubleshooting

#### Common Issues
1. **Build Failures**
   - Ensure Node.js version is 18.17.0
   - Check all dependencies are installed
   - Verify API endpoints are accessible

2. **API Connection Issues**
   - Verify the BASE_URL in `src/api.js`
   - Check CORS configuration on backend
   - Ensure authentication tokens are valid

3. **Routing Issues**
   - Configure fallback routes for SPA
   - Ensure all routes redirect to index.html

### 📊 Performance Optimization

#### Build Optimizations
- Source maps disabled for production
- Static file compression
- Optimized bundle splitting
- Lazy loading for components

#### API Optimizations
- Cached API responses
- Optimistic updates
- Error handling and retry logic
- Offline capability for basic features

### 🔒 Security Considerations

#### Frontend Security
- Environment variables for sensitive data
- HTTPS enforcement
- XSS protection
- CSRF token handling

#### API Security
- JWT token authentication
- Secure file uploads
- Input validation
- Rate limiting

### 📈 Monitoring & Analytics

#### Health Checks
- API endpoint monitoring
- Build status tracking
- Error logging and reporting
- Performance metrics

#### User Analytics
- Feature usage tracking
- Error reporting
- Performance monitoring
- User engagement metrics

---

## 🎯 Quick Start

1. **Clone the repository**
2. **Install dependencies:** `npm install`
3. **Start development:** `npm start`
4. **Build for production:** `npm run build`
5. **Deploy to Render.com** using the configuration above

The application will be available at: https://team5555-womenline-03.onrender.com 