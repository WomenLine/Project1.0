# 🤖 AI Services Integration Guide

## Overview
This guide covers the integration of two AI services into your Womenline application:
- **AI Moderator Service**: `https://womenline-moderator-2.onrender.com`
- **AI Service**: `https://womenline-ai.onrender.com`

## 🔗 Service URLs

### AI Moderator Service
- **Base URL**: `https://womenline-moderator-2.onrender.com`
- **Health Check**: `/`
- **Moderation Endpoint**: `/moderate`
- **History Endpoint**: `/moderation-history`
- **Settings Endpoint**: `/settings`

### AI Service
- **Base URL**: `https://womenline-ai.onrender.com`
- **Health Check**: `/`
- **Generation Endpoint**: `/generate`
- **Analysis Endpoint**: `/analyze`
- **Insights Endpoint**: `/insights`
- **Training Endpoint**: `/train`

## 🚀 What's Been Integrated

### 1. **API Functions Added** (`src/api.js`)
- ✅ AI Moderator health check and content moderation
- ✅ AI Service health check and response generation
- ✅ Separate API helper for AI services
- ✅ Comprehensive error handling and logging
- ✅ Authentication token support

### 2. **Enhanced API Tester** (`ApiTester.jsx`)
- ✅ Categorized testing (Main API, AI Moderator, AI Service)
- ✅ Individual and category-based testing
- ✅ Real-time results and statistics
- ✅ Comprehensive endpoint coverage

### 3. **Error Handling & Debugging**
- ✅ Detailed logging for all AI service calls
- ✅ User-friendly error messages
- ✅ Console debugging information
- ✅ Network request monitoring

## 🧪 How to Test the AI Services

### Step 1: Access the Enhanced API Tester
Navigate to: `https://your-vercel-domain.vercel.app/api-tester`

### Step 2: Test AI Services
The API Tester now has three categories:

#### **Main API Tests**
- Health Check, Registration, Login, Journals, etc.

#### **AI Moderator Tests**
- AI Moderator Health Check
- Content Moderation
- Moderation History
- Settings Update

#### **AI Service Tests**
- AI Service Health Check
- Response Generation
- User Input Analysis
- AI Insights
- Model Training

### Step 3: Run Tests
- **Run All Tests**: Tests every endpoint systematically
- **Test by Category**: Test specific service categories
- **Individual Tests**: Test specific endpoints

## 🔧 API Functions Available

### AI Moderator Functions
```javascript
import { 
  aiModeratorHealthCheck,
  moderateContent,
  getModerationHistory,
  updateModerationSettings
} from '../api';

// Check if AI moderator is accessible
await aiModeratorHealthCheck();

// Moderate user content
await moderateContent({ content: "User message" }, userToken);

// Get moderation history
await getModerationHistory(userToken);

// Update moderation settings
await updateModerationSettings({ autoModerate: true }, userToken);
```

### AI Service Functions
```javascript
import { 
  aiServiceHealthCheck,
  generateAIResponse,
  analyzeUserInput,
  getAIInsights,
  trainAIModel
} from '../api';

// Check if AI service is accessible
await aiServiceHealthCheck();

// Generate AI response
await generateAIResponse({ prompt: "User question" }, userToken);

// Analyze user input
await analyzeUserInput({ input: "User message" }, userToken);

// Get AI insights
await getAIInsights({ data: "User data" }, userToken);

// Train AI model
await trainAIModel({ trainingData: "Training data" }, userToken);
```

## 📊 Expected Test Results

### ✅ **Should Work (Public Endpoints)**
- AI Moderator Health Check
- AI Service Health Check

### ⚠️ **May Fail (Protected Endpoints)**
- Content Moderation (requires auth)
- AI Response Generation (requires auth)
- Model Training (requires auth)

### 🔍 **What to Look For**
- **Success**: Green success messages with response data
- **Auth Errors**: 401/403 errors for protected endpoints
- **Network Errors**: Connection issues or CORS problems
- **Service Errors**: Backend implementation issues

## 🐛 Troubleshooting AI Services

### Common Issues

#### 1. **Service Unreachable**
- **Symptoms**: Network errors, timeouts
- **Cause**: Service down or network issues
- **Solution**: Check service status and network connectivity

#### 2. **Authentication Failures**
- **Symptoms**: 401/403 errors
- **Cause**: Invalid or missing auth tokens
- **Solution**: Verify token generation and validation

#### 3. **CORS Errors**
- **Symptoms**: Cross-origin request blocked
- **Cause**: Backend CORS configuration
- **Solution**: Update CORS settings on AI services

#### 4. **Service Errors**
- **Symptoms**: 500 errors, service-specific error messages
- **Cause**: Backend implementation issues
- **Solution**: Check AI service logs and implementation

### Debug Steps

1. **Check Service Health**
   - Test health check endpoints first
   - Verify services are running and accessible

2. **Monitor Network Requests**
   - Use browser DevTools Network tab
   - Check request/response details
   - Look for CORS or authentication errors

3. **Check Console Logs**
   - Detailed logging for all AI service calls
   - Request/response information
   - Error details and stack traces

4. **Test with Postman/curl**
   - Test endpoints directly
   - Verify authentication requirements
   - Check response formats

## 🎯 Use Cases

### AI Moderator Service
- **Content Filtering**: Moderate forum posts, comments, messages
- **Safety Checks**: Ensure user-generated content is appropriate
- **Automated Moderation**: Reduce manual content review workload
- **Policy Enforcement**: Apply community guidelines automatically

### AI Service
- **User Support**: Generate helpful responses to user questions
- **Content Analysis**: Analyze user input for sentiment, intent
- **Personalized Insights**: Provide AI-generated health insights
- **Model Training**: Continuously improve AI responses

## 📱 Integration Examples

### Content Moderation in Forum
```javascript
// Before posting forum content
const moderationResult = await moderateContent({
  content: userPost,
  contentType: 'forum-post',
  userId: currentUser.id
}, userToken);

if (moderationResult.approved) {
  // Post content
  await createForumPost(userPost, userToken);
} else {
  // Show moderation feedback
  showModerationWarning(moderationResult.reason);
}
```

### AI-Powered User Support
```javascript
// Generate AI response to user question
const aiResponse = await generateAIResponse({
  prompt: userQuestion,
  context: 'mental-health-support',
  userId: currentUser.id
}, userToken);

// Display AI response
displayAIResponse(aiResponse.message);
```

## 🚀 Next Steps

### Immediate Actions
1. **Deploy the updated code** to Vercel
2. **Test AI services** using the enhanced API Tester
3. **Verify service connectivity** and health checks
4. **Test authentication flow** for protected endpoints

### Backend Team Actions
1. **Implement AI service endpoints** based on test results
2. **Configure CORS settings** for Vercel domain
3. **Set up authentication** for protected endpoints
4. **Test endpoints manually** with Postman/curl

### Frontend Team Actions
1. **Monitor API Tester results** for AI services
2. **Integrate AI functions** into user-facing components
3. **Test end-to-end flows** with AI services
4. **Implement error handling** for AI service failures

## 📞 Support

### Debugging Resources
- **Enhanced API Tester**: `/api-tester` - Test all services
- **Console Logs**: Detailed AI service request/response logs
- **Network Tab**: Monitor HTTP requests to AI services
- **Service Health Checks**: Verify service accessibility

### Documentation
- **API Integration**: `src/api.js` - All available functions
- **Testing Tool**: `ApiTester.jsx` - Comprehensive testing
- **Debugging Guide**: `DEBUGGING_GUIDE.md` - General troubleshooting

### Contact Points
- **AI Moderator Issues**: Check service logs and health
- **AI Service Issues**: Verify endpoint implementation
- **Integration Issues**: Use API Tester and console logs
- **General Issues**: Review this integration guide

---

**Last Updated**: December 2024  
**Status**: AI Services Integrated  
**Priority**: High (AI Functionality) 