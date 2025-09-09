import React, { useState, useEffect } from "react";
import { 
  healthCheck,
  aiModeratorHealthCheck,
  aiServiceHealthCheck,
  login,
  register,
  getJournals,
  createJournal,
  getRewards,
  getUserCredits,
  uploadFile,
  getSamplePdf,
  sendWhatsApp,
  uploadVoice,
  reportAbuse,
  createForumPost,
  bookAppointment,
  getDoctorChecklist,
  getLeaderboard
} from "../api";

const WebsiteHealthChecker = () => {
  const [overallHealth, setOverallHealth] = useState("UNKNOWN");
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  });

  const testData = {
    email: "healthcheck@womenline.com",
    password: "healthcheck123",
    firstName: "Health",
    lastName: "Checker",
    mood: "neutral",
    note: "Health check test entry",
    content: "Test content for moderation",
    userInput: "Test user input for AI analysis"
  };

  const runTest = async (testName, testFunction, category) => {
    try {
      const result = await testFunction();
      return {
        status: "PASSED",
        data: result,
        timestamp: new Date().toLocaleTimeString(),
        category
      };
    } catch (error) {
      return {
        status: "FAILED",
        error: error.message,
        timestamp: new Date().toLocaleTimeString(),
        category
      };
    }
  };

  const runComprehensiveHealthCheck = async () => {
    setLoading(true);
    setOverallHealth("CHECKING");
    
    const allTests = [
      // Core Backend Health
      { name: "Main Backend Health", func: () => healthCheck(), category: "Core Backend" },
      { name: "AI Moderator Health", func: () => aiModeratorHealthCheck(), category: "AI Services" },
      { name: "AI Service Health", func: () => aiServiceHealthCheck(), category: "AI Services" },
      
      // Authentication System
      { name: "User Registration", func: () => register(testData), category: "Authentication" },
      { name: "User Login", func: () => login({ email: testData.email, password: testData.password }), category: "Authentication" },
      
      // Core Features (with test tokens)
      { name: "Get Journals", func: () => getJournals("test-token"), category: "Core Features" },
      { name: "Create Journal", func: () => createJournal({ mood: testData.mood, note: testData.note }, "test-token"), category: "Core Features" },
      { name: "Get Rewards", func: () => getRewards("test-token"), category: "Core Features" },
      { name: "Get User Credits", func: () => getUserCredits("test-token"), category: "Core Features" },
      
      // Advanced Features
      { name: "File Upload", func: () => uploadFile(new File(["test"], "test.txt"), "test-token"), category: "Advanced Features" },
      { name: "PDF Generation", func: () => getSamplePdf("test-token"), category: "Advanced Features" },
      { name: "WhatsApp Integration", func: () => sendWhatsApp({ message: "Test" }, "test-token"), category: "Advanced Features" },
      { name: "Voice Upload", func: () => uploadVoice({ audio: "test" }, "test-token"), category: "Advanced Features" },
      
      // Safety & Moderation
      { name: "Abuse Reporting", func: () => reportAbuse({ report: "Test report" }, "test-token"), category: "Safety & Moderation" },
      { name: "Forum Post Creation", func: () => createForumPost({ title: "Test", content: "Test content" }, "test-token"), category: "Safety & Moderation" },
      
      // Healthcare Features
      { name: "Appointment Booking", func: () => bookAppointment({ date: "2024-12-25", type: "checkup" }, "test-token"), category: "Healthcare" },
      { name: "Doctor Checklist", func: () => getDoctorChecklist("test-token"), category: "Healthcare" },
      { name: "Leaderboard", func: () => getLeaderboard("test-token"), category: "Healthcare" }
    ];

    const results = {};
    
    for (const test of allTests) {
      console.log(`Running test: ${test.name}`);
      results[test.name] = await runTest(test.name, test.func, test.category);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setTestResults(results);
    
    // Calculate summary
    const total = allTests.length;
    const passed = Object.values(results).filter(r => r.status === "PASSED").length;
    const failed = Object.values(results).filter(r => r.status === "FAILED").length;
    const warnings = total - passed - failed;
    
    setSummary({ total, passed, failed, warnings });
    
    // Determine overall health
    if (failed === 0 && passed > 0) {
      setOverallHealth("HEALTHY");
    } else if (failed <= 2) {
      setOverallHealth("WARNING");
    } else {
      setOverallHealth("CRITICAL");
    }
    
    setLoading(false);
  };

  const getHealthColor = (status) => {
    switch (status) {
      case "HEALTHY": return "#28a745";
      case "WARNING": return "#ffc107";
      case "CRITICAL": return "#dc3545";
      case "CHECKING": return "#17a2b8";
      default: return "#6c757d";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PASSED": return "#28a745";
      case "FAILED": return "#dc3545";
      case "WARNING": return "#ffc107";
      default: return "#6c757d";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Core Backend": return "🏗️";
      case "AI Services": return "🤖";
      case "Authentication": return "🔐";
      case "Core Features": return "⭐";
      case "Advanced Features": return "🚀";
      case "Safety & Moderation": return "🛡️";
      case "Healthcare": return "🏥";
      default: return "📋";
    }
  };

  const categories = ["Core Backend", "AI Services", "Authentication", "Core Features", "Advanced Features", "Safety & Moderation", "Healthcare"];

  const getCategoryResults = (category) => {
    const categoryTests = Object.entries(testResults).filter(([_, result]) => result.category === category);
    return {
      total: categoryTests.length,
      passed: categoryTests.filter(([_, result]) => result.status === "PASSED").length,
      failed: categoryTests.filter(([_, result]) => result.status === "FAILED").length
    };
  };

  useEffect(() => {
    // Auto-run health check on component mount
    runComprehensiveHealthCheck();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ color: '#7b3f3f', textAlign: 'center', marginBottom: '20px' }}>
        🏥 Website Health Checker - Complete Integration Monitor
      </h2>

      {/* Overall Health Status */}
      <div style={{ 
        background: getHealthColor(overallHealth), 
        color: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>
          Overall Website Health: {overallHealth}
        </h3>
        <div style={{ fontSize: '18px' }}>
          <span style={{ marginRight: '20px' }}>✅ Passed: {summary.passed}</span>
          <span style={{ marginRight: '20px' }}>❌ Failed: {summary.failed}</span>
          <span style={{ marginRight: '20px' }}>⚠️ Warnings: {summary.warnings}</span>
          <span>📊 Total: {summary.total}</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button 
          onClick={runComprehensiveHealthCheck}
          disabled={loading}
          style={{
            background: '#7b3f3f',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '8px',
            marginRight: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? '🔄 Running Health Check...' : '🔍 Run Complete Health Check'}
        </button>
      </div>

      {/* Category Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '15px', 
        marginBottom: '30px' 
      }}>
        {categories.map(category => {
          const stats = getCategoryResults(category);
          if (stats.total === 0) return null;
          
          return (
            <div key={category} style={{ 
              background: '#f8f9fa', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
                {getCategoryIcon(category)} {category}
              </h4>
              <div style={{ fontSize: '14px', color: '#666' }}>
                <p style={{ margin: '5px 0' }}>✅ Passed: {stats.passed}</p>
                <p style={{ margin: '5px 0' }}>❌ Failed: {stats.failed}</p>
                <p style={{ margin: '5px 0' }}>📊 Total: {stats.total}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Test Results by Category */}
      {categories.map(category => {
        const categoryTests = Object.entries(testResults).filter(([_, result]) => result.category === category);
        if (categoryTests.length === 0) return null;

        return (
          <div key={category} style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              color: '#333', 
              borderBottom: `3px solid ${getHealthColor(overallHealth)}`, 
              paddingBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              {getCategoryIcon(category)} {category} Tests
            </h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {categoryTests.map(([testName, result]) => (
                <div key={testName} style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  padding: '16px',
                  background: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{testName}</h4>
                      <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                        Category: {result.category}
                      </p>
                    </div>
                    <div style={{ 
                      background: getStatusColor(result.status), 
                      color: 'white', 
                      padding: '6px 12px', 
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {result.status}
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: '12px', 
                    borderRadius: '6px',
                    background: result.status === 'PASSED' ? '#d4edda' : '#f8d7da',
                    border: `1px solid ${result.status === 'PASSED' ? '#c3e6cb' : '#f5c6cb'}`
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <strong style={{ 
                        color: result.status === 'PASSED' ? '#155724' : '#721c24' 
                      }}>
                        {result.status === 'PASSED' ? '✅ Test Passed' : '❌ Test Failed'}
                      </strong>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {result.timestamp}
                      </span>
                    </div>
                    
                    {result.status === 'PASSED' ? (
                      <pre style={{ 
                        margin: '0', 
                        fontSize: '12px', 
                        color: '#155724',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}>
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    ) : (
                      <div style={{ color: '#721c24', fontSize: '14px' }}>
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Health Recommendations */}
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        background: '#e3f2fd', 
        borderRadius: '8px',
        border: '1px solid #bbdefb'
      }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#1976d2' }}>🏥 Health Recommendations</h4>
        
        {overallHealth === "HEALTHY" && (
          <div style={{ color: '#155724', fontSize: '16px' }}>
            🎉 <strong>Excellent!</strong> Your website is fully healthy and all integrations are working correctly.
          </div>
        )}
        
        {overallHealth === "WARNING" && (
          <div style={{ color: '#856404', fontSize: '16px' }}>
            ⚠️ <strong>Warning:</strong> Some integrations have issues. Review failed tests above and fix critical problems.
          </div>
        )}
        
        {overallHealth === "CRITICAL" && (
          <div style={{ color: '#721c24', fontSize: '16px' }}>
            🚨 <strong>Critical!</strong> Multiple integrations are failing. Immediate attention required to restore functionality.
          </div>
        )}

        <div style={{ marginTop: '15px', fontSize: '14px', color: '#1565c0' }}>
          <p><strong>💡 Tips:</strong></p>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>Check browser console for detailed error logs</li>
            <li>Verify backend services are running and accessible</li>
            <li>Test individual endpoints using the API Tester</li>
            <li>Monitor network requests in browser DevTools</li>
            <li>Review authentication and CORS configurations</li>
          </ul>
        </div>
      </div>

      {/* Performance Metrics */}
      <div style={{ 
        marginTop: '20px', 
        padding: '16px', 
        background: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>📊 Performance Metrics</h4>
        <div style={{ fontSize: '14px', color: '#6c757d' }}>
          <p><strong>Health Score:</strong> {summary.total > 0 ? Math.round((summary.passed / summary.total) * 100) : 0}%</p>
          <p><strong>Success Rate:</strong> {summary.total > 0 ? Math.round((summary.passed / summary.total) * 100) : 0}%</p>
          <p><strong>Failure Rate:</strong> {summary.total > 0 ? Math.round((summary.failed / summary.total) * 100) : 0}%</p>
          <p><strong>Last Check:</strong> {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default WebsiteHealthChecker; 