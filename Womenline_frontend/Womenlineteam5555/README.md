# Womenline 2.0 🌸

A comprehensive women's health and wellness application built with React.

## 🌐 **Live Application**
**Production URL:** https://team5555-womenline-03.onrender.com

## 🚀 **Quick Start**

### **Local Development:**
```bash
# Install dependencies
npm install

# Start development server
npm start

# Access at: http://localhost:8000
```

### **Production Build:**
```bash
# Build for production
npm run build

# The build folder contains static files ready for deployment
```

## 📱 **Features**

### **🔐 Authentication**
- User registration and login
- JWT token management
- Protected routes for authenticated users

### **🏥 Health Tracking**
1. **Period Tracker**
   - Calendar view with cycle tracking
   - Symptom logging
   - Prediction algorithms

2. **Mental Wellness**
   - Mood tracking with emotion themes
   - Journal entries
   - Progress visualization

3. **Health Summary** *(NEW!)*
   - Comprehensive gynecologist visit form
   - Real-time preview
   - PDF generation and download
   - Professional formatting

### **🛡️ Safety & Education**
- Safety tutorials
- Educational content
- Emergency information

### **🪙 Reward System**
- Coin earning mechanism
- Achievement tracking
- Progress visualization

## 🛠️ **Technology Stack**

- **Frontend:** React 18.2.0
- **Routing:** React Router DOM
- **Styling:** CSS3 with custom design system
- **PDF Generation:** jsPDF + html2canvas
- **API Integration:** Fetch API with JWT authentication
- **Deployment:** Render.com

## 📁 **Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── HealthSummaryPDF.jsx    # NEW! Health summary generator
│   ├── PeriodTracker.jsx       # Period tracking component
│   ├── MentalWellnessTracker.jsx # Mental health tracking
│   ├── Navbar.jsx             # Navigation component
│   └── ...
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.jsx # Authentication state
│   └── EmotionContext.jsx # Emotion/mood state
├── i18n/              # Internationalization
└── api.js             # API integration
```

## 🎨 **Design System**

### **Color Palette:**
- **Primary:** Burgundy (#7b3f3f)
- **Secondary:** Light Pink (#f4bcbc)
- **Background:** Pink gradient
- **Text:** White and dark gray

### **Features:**
- ✅ Responsive design (mobile-first)
- ✅ Accessibility compliant
- ✅ Emotion-aware interface
- ✅ Touch-friendly interactions

## 🔧 **API Integration**

### **Backend URL:**
```javascript
const BASE_URL = "https://team5555-womenline-03.onrender.com";
```

### **Endpoints:**
- `/api/auth/*` - Authentication
- `/api/journals` - Journal entries
- `/api/upload/*` - File uploads
- `/api/rewards/*` - Reward system

## 🚀 **Deployment**

### **Render.com Configuration:**
- **Service Type:** Static Site
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `build`
- **Node Version:** 18.17.0

### **Environment Variables:**
```bash
NODE_VERSION=18.17.0
REACT_APP_API_URL=https://team5555-womenline-03.onrender.com
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
```

## 📊 **Performance**

### **Build Optimization:**
- Source maps disabled for production
- Static file compression
- Optimized bundle splitting
- Lazy loading implementation

### **Bundle Sizes:**
- **Main JS:** 248.03 kB (gzipped)
- **CSS:** 3.24 kB (gzipped)
- **Chunks:** Optimized for caching

## 🔒 **Security**

### **Frontend Security:**
- HTTPS enforcement
- XSS protection
- Input validation
- Secure token storage

### **API Security:**
- JWT authentication
- CORS configuration
- Rate limiting
- Secure file uploads

## 📈 **Recent Updates**

### **✅ Latest Features:**
- **Health Summary PDF Generator** - Comprehensive gynecologist visit form with PDF download
- **Enhanced UI/UX** - Improved responsive design and accessibility
- **API Integration** - Full backend connectivity
- **Deployment Ready** - Configured for Render.com deployment

## 🐛 **Troubleshooting**

### **Common Issues:**

#### 1. **Build Failures**
```bash
# Check Node.js version
node --version  # Should be 18.17.0 or higher

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. **API Connection Issues**
- Verify BASE_URL in `src/api.js`
- Check CORS configuration
- Ensure authentication tokens are valid

#### 3. **Routing Issues**
- Ensure all routes redirect to index.html
- Check React Router configuration

## 📞 **Support**

### **Documentation:**
- `DEPLOYMENT.md` - Deployment guide
- `INTEGRATION_GUIDE.md` - Integration details
- `build.sh` - Build script

### **Monitoring:**
- Build status tracking
- API endpoint monitoring
- Error logging and reporting
- Performance metrics

---

## 🎉 **Success Summary**

Your Womenline 2.0 application is now fully integrated and ready for users at:
**https://team5555-womenline-03.onrender.com**

---

**Made with ❤️ for Women's Health & Wellness** 