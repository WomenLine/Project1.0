import React, { useState } from "react";
import { 
  healthCheck, 
  login, 
  register, 
  getJournals, 
  createJournal, 
  uploadFile, 
  getRewards, 
  getUserCredits,
  aiModeratorHealthCheck,
  moderateContent,
  getModerationHistory,
  updateModerationSettings,
  aiServiceHealthCheck,
  generateAIResponse,
  analyzeUserInput,
  getAIInsights,
  trainAIModel
} from "../api";

const ApiTester = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [testData, setTestData] = useState({
    email: "test@example.com",
    password: "test123",
    firstName: "Test",
    lastName: "User",
    mood: "happy",
    note: "Test journal entry",
    content: "This is a test message for moderation",
    userInput: "I'm feeling anxious today",
    trainingData: "Sample training data for AI model"
  });

  const runTest = async (testName, testFunction) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    setResults(prev => ({ ...prev, [testName]: "Running..." }));

    try {
      const result = await testFunction();
      setResults(prev => ({ 
        ...prev, 
        [testName]: { 
          status: "SUCCESS", 
          data: result,
          timestamp: new Date().toLocaleTimeString()
        } 
      }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [testName]: { 
          status: "ERROR", 
          error: error.message,
          timestamp: new Date().toLocaleTimeString()
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  // Main API tests
  const testHealthCheck = () => healthCheck();
  const testRegister = () => register(testData);
  const testLogin = () => login({ email: testData.email, password: testData.password });
  const testGetJournals = () => getJournals("test-token");
  const testCreateJournal = () => createJournal({ mood: testData.mood, note: testData.note }, "test-token");
  const testGetRewards = () => getRewards("test-token");
  const testGetUserCredits = () => getUserCredits("test-token");

  // AI Moderator tests
  const testAIModeratorHealth = () => aiModeratorHealthCheck();
  const testModerateContent = () => moderateContent({ content: testData.content }, "test-token");
  const testGetModerationHistory = () => getModerationHistory("test-token");
  const testUpdateModerationSettings = () => updateModerationSettings({ autoModerate: true }, "test-token");

  // AI Service tests
  const testAIServiceHealth = () => aiServiceHealthCheck();
  const testGenerateAIResponse = () => generateAIResponse({ prompt: testData.userInput }, "test-token");
  const testAnalyzeUserInput = () => analyzeUserInput({ input: testData.userInput }, "test-token");
  const testGetAIInsights = () => getAIInsights({ data: testData.userInput }, "test-token");
  const testTrainAIModel = () => trainAIModel({ trainingData: testData.trainingData }, "test-token");

  const allTests = [
    // Main API Tests
    { name: "Health Check", func: testHealthCheck, description: "Test if main backend is accessible", category: "Main API" },
    { name: "User Registration", func: testRegister, description: "Test user registration endpoint", category: "Main API" },
    { name: "User Login", func: testLogin, description: "Test user login endpoint", category: "Main API" },
    { name: "Get Journals", func: testGetJournals, description: "Test fetching journals (requires auth)", category: "Main API" },
    { name: "Create Journal", func: testCreateJournal, description: "Test creating journal entry (requires auth)", category: "Main API" },
    { name: "Get Rewards", func: testGetRewards, description: "Test fetching rewards (requires auth)", category: "Main API" },
    { name: "Get User Credits", func: testGetUserCredits, description: "Test fetching user credits (requires auth)", category: "Main API" },
    
    // AI Moderator Tests
    { name: "AI Moderator Health", func: testAIModeratorHealth, description: "Test AI moderator service connectivity", category: "AI Moderator" },
    { name: "Moderate Content", func: testModerateContent, description: "Test content moderation (requires auth)", category: "AI Moderator" },
    { name: "Get Moderation History", func: testGetModerationHistory, description: "Test moderation history retrieval (requires auth)", category: "AI Moderator" },
    { name: "Update Moderation Settings", func: testUpdateModerationSettings, description: "Test moderation settings update (requires auth)", category: "AI Moderator" },
    
    // AI Service Tests
    { name: "AI Service Health", func: testAIServiceHealth, description: "Test AI service connectivity", category: "AI Service" },
    { name: "Generate AI Response", func: testGenerateAIResponse, description: "Test AI response generation (requires auth)", category: "AI Service" },
    { name: "Analyze User Input", func: testAnalyzeUserInput, description: "Test user input analysis (requires auth)", category: "AI Service" },
    { name: "Get AI Insights", func: testGetAIInsights, description: "Test AI insights generation (requires auth)", category: "AI Service" },
    { name: "Train AI Model", func: testTrainAIModel, description: "Test AI model training (requires auth)", category: "AI Service" }
  ];

  const runAllTests = async () => {
    for (const test of allTests) {
      await runTest(test.name, test.func);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const runCategoryTests = async (category) => {
    const categoryTests = allTests.filter(test => test.category === category);
    for (const test of categoryTests) {
      await runTest(test.name, test.func);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  };

  const clearResults = () => {
    setResults({});
  };

  const getCategoryResults = (category) => {
    const categoryTests = allTests.filter(test => test.category === category);
    const categoryResults = categoryTests.map(test => results[test.name]).filter(Boolean);
    return {
      success: categoryResults.filter(r => r.status === 'SUCCESS').length,
      error: categoryResults.filter(r => r.status === 'ERROR').length,
      total: categoryTests.length
    };
  };

  const categories = ["Main API", "AI Moderator", "AI Service"];

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ color: '#7b3f3f', textAlign: 'center', marginBottom: '20px' }}>
        🔧 Comprehensive API Endpoint Tester
      </h2>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '16px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <h4>Test Data</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input
            placeholder="Email"
            value={testData.email}
            onChange={(e) => setTestData(prev => ({ ...prev, email: e.target.value }))}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <input
            placeholder="Password"
            value={testData.password}
            onChange={(e) => setTestData(prev => ({ ...prev, password: e.target.value }))}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <input
            placeholder="First Name"
            value={testData.firstName}
            onChange={(e) => setTestData(prev => ({ ...prev, firstName: e.target.value }))}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <input
            placeholder="Last Name"
            value={testData.lastName}
            onChange={(e) => setTestData(prev => ({ ...prev, lastName: e.target.value }))}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button 
          onClick={runAllTests}
          style={{
            background: '#7b3f3f',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          🚀 Run All Tests
        </button>
        <button 
          onClick={clearResults}
          style={{
            background: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          🗑️ Clear Results
        </button>
      </div>

      {/* Category Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '15px', 
        marginBottom: '20px' 
      }}>
        {categories.map(category => {
          const stats = getCategoryResults(category);
          return (
            <div key={category} style={{ 
              background: '#e3f2fd', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid #bbdefb'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>{category}</h4>
              <div style={{ fontSize: '14px', color: '#1565c0' }}>
                <p><strong>Success:</strong> {stats.success}</p>
                <p><strong>Errors:</strong> {stats.error}</p>
                <p><strong>Total:</strong> {stats.total}</p>
              </div>
              <button 
                onClick={() => runCategoryTests(category)}
                style={{
                  background: '#1976d2',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Test {category}
              </button>
            </div>
          );
        })}
      </div>

      {/* Test Results by Category */}
      {categories.map(category => (
        <div key={category} style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#333', borderBottom: '2px solid #7b3f3f', paddingBottom: '8px' }}>
            {category} Tests
          </h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            {allTests
              .filter(test => test.category === category)
              .map((test) => (
                <div key={test.name} style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  padding: '16px',
                  background: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{test.name}</h4>
                      <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>{test.description}</p>
                    </div>
                    <button 
                      onClick={() => runTest(test.name, test.func)}
                      disabled={loading[test.name]}
                      style={{
                        background: loading[test.name] ? '#6c757d' : '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: loading[test.name] ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {loading[test.name] ? '⏳ Testing...' : '🧪 Test'}
                    </button>
                  </div>
                  
                  {results[test.name] && (
                    <div style={{ 
                      padding: '12px', 
                      borderRadius: '6px',
                      background: results[test.name].status === 'SUCCESS' ? '#d4edda' : '#f8d7da',
                      border: `1px solid ${results[test.name].status === 'SUCCESS' ? '#c3e6cb' : '#f5c6cb'}`
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <strong style={{ 
                          color: results[test.name].status === 'SUCCESS' ? '#155724' : '#721c24' 
                        }}>
                          {results[test.name].status}
                        </strong>
                        <span style={{ fontSize: '12px', color: '#666' }}>
                          {results[test.name].timestamp}
                        </span>
                      </div>
                      
                      {results[test.name].status === 'SUCCESS' ? (
                        <pre style={{ 
                          margin: '0', 
                          fontSize: '12px', 
                          color: '#155724',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}>
                          {JSON.stringify(results[test.name].data, null, 2)}
                        </pre>
                      ) : (
                        <div style={{ color: '#721c24', fontSize: '14px' }}>
                          {results[test.name].error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}

      <div style={{ 
        marginTop: '30px', 
        padding: '16px', 
        background: '#e3f2fd', 
        borderRadius: '8px',
        border: '1px solid #bbdefb'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>📋 Overall Test Results Summary</h4>
        <div style={{ fontSize: '14px', color: '#1565c0' }}>
          <p><strong>Total Success:</strong> {Object.values(results).filter(r => r.status === 'SUCCESS').length}</p>
          <p><strong>Total Errors:</strong> {Object.values(results).filter(r => r.status === 'ERROR').length}</p>
          <p><strong>Total Tests:</strong> {allTests.length}</p>
        </div>
        <p style={{ fontSize: '12px', color: '#666', margin: '10px 0 0 0' }}>
          💡 Check the browser console for detailed API request/response logs. 
          This will help identify exactly where the data flow is breaking.
        </p>
      </div>
    </div>
  );
};

export default ApiTester; 