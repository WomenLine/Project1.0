# Vercel Frontend - Render Backend Integration

## Overview
This document describes the integration between the Vercel-deployed frontend and Render-deployed backend for the Womenline 2.0 application.

## Backend URL
- **Production Backend**: `https://team5555-womenline-final.onrender.com`
- **Previous Backend**: `https://team5555-womenline-03.onrender.com` (deprecated)

## Configuration

### API Configuration
The frontend is configured to connect to the Render backend through the `src/api.js` file:

```javascript
const BASE_URL = process.env.REACT_APP_API_URL || "https://team5555-womenline-final.onrender.com";
```

### Environment Variables
To customize the API URL, you can set the `REACT_APP_API_URL` environment variable in your Vercel deployment:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add: `REACT_APP_API_URL` = `https://team5555-womenline-final.onrender.com`

### CORS Configuration
The Render backend should be configured to allow requests from your Vercel domain:
- **Vercel Domain**: `http://women-line-frontend.vercel.app`
- **Local Development**: `http://localhost:8000`

## API Endpoints
The following endpoints are available through the Render backend:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset ⚠️ **Pending Implementation**
- `POST /api/auth/reset-password` - Reset password with token ⚠️ **Pending Implementation**

### Journals
- `GET /api/journals` - Get user journals
- `POST /api/journals` - Create journal entry

### File Upload
- `POST /api/upload/file` - Upload files

### Rewards System
- `GET /api/rewards` - Get available rewards
- `POST /api/rewards/redeem` - Redeem reward
- `GET /api/user-credits` - Get user credits
- `POST /api/earn-credits` - Earn credits

### PDF Generation
- `GET /api/pdf/sample` - Generate sample PDF

## 🔐 Password Reset Functionality

### Current Status
- ✅ **Frontend**: Fully implemented and deployed
- ⚠️ **Backend**: Endpoints pending implementation
- 🔄 **Integration**: Ready for backend completion

### Frontend Features
- Request password reset form (`/reset`)
- Set new password form (`/reset-confirmation`)
- Comprehensive error handling
- Backend unavailable fallback
- Responsive design

### Backend Requirements
The following endpoints need to be implemented on the Render backend:

1. **POST /api/auth/forgot-password** - Send reset email
2. **POST /api/auth/reset-password** - Process password reset

See `PASSWORD_RESET_IMPLEMENTATION.md` for complete implementation details.

## Testing the Integration

### 1. Verify Backend Connectivity
Test if the backend is accessible:
```bash
curl https://team5555-womenline-final.onrender.com/api/health
```

### 2. Test Frontend-Backend Communication
1. Deploy the updated frontend to Vercel
2. Test user registration/login
3. Verify journal creation and retrieval
4. Test file upload functionality
5. Test password reset flow (will show backend unavailable message)

### 3. Monitor Network Requests
Use browser DevTools to monitor API calls and ensure they're going to the correct backend URL.

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure the Render backend allows requests from your Vercel domain
   - Check if the backend is properly configured for cross-origin requests

2. **API Timeout**
   - Render free tier has cold start delays
   - Consider upgrading to a paid plan for better performance

3. **Authentication Issues**
   - Verify JWT token handling
   - Check if tokens are being properly stored and sent

4. **Password Reset Not Working**
   - Frontend is fully functional
   - Backend endpoints need to be implemented
   - Check `PASSWORD_RESET_IMPLEMENTATION.md` for details

### Debug Steps

1. Check browser console for API errors
2. Verify the BASE_URL in the Network tab
3. Test backend endpoints directly with tools like Postman
4. Check Render logs for backend errors
5. For password reset issues, check if backend endpoints exist

## Deployment Checklist

- [x] Update API configuration in `src/api.js`
- [x] Set environment variables in Vercel
- [x] Deploy frontend to Vercel
- [x] Test all major functionality
- [x] Verify backend connectivity
- [x] Monitor for errors in production
- [x] Implement password reset frontend
- [ ] Implement password reset backend endpoints
- [ ] Test complete password reset flow

## Support
For backend issues, check the Render deployment logs.
For frontend issues, check the Vercel deployment logs and browser console.
For password reset implementation, see `PASSWORD_RESET_IMPLEMENTATION.md`. 