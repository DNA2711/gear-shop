"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useEnhancedApi } from "@/hooks/useEnhancedApi";
import { tokenManager } from "@/lib/tokenManager";

export default function AuthTestComponent() {
  const { user, isAuthenticated, login, logout, refreshToken } = useAuth();
  const enhancedApi = useEnhancedApi();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTestingAuth, setIsTestingAuth] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testTokenStorage = () => {
    addResult("=== Testing Token Storage ===");
    
    const accessToken = tokenManager.getAccessToken();
    const refreshTokenValue = tokenManager.getRefreshToken();
    const isAuth = tokenManager.isAuthenticated();
    const userInfo = tokenManager.getUserFromToken();
    
    addResult(`Access Token: ${accessToken ? 'Present' : 'Missing'}`);
    addResult(`Refresh Token: ${refreshTokenValue ? 'Present' : 'Missing'}`);
    addResult(`Is Authenticated: ${isAuth}`);
    addResult(`User Info: ${userInfo ? JSON.stringify(userInfo) : 'None'}`);
  };

  const testApiCall = async () => {
    addResult("=== Testing API Call ===");
    
    try {
      const response = await enhancedApi.get('/api/auth/me');
      addResult(`API Call Success: ${JSON.stringify(response)}`);
    } catch (error) {
      addResult(`API Call Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testTokenRefresh = async () => {
    addResult("=== Testing Token Refresh ===");
    
    try {
      const success = await refreshToken();
      addResult(`Token Refresh: ${success ? 'Success' : 'Failed'}`);
      
      if (success) {
        const newToken = tokenManager.getAccessToken();
        addResult(`New Token: ${newToken ? 'Generated' : 'Missing'}`);
      }
    } catch (error) {
      addResult(`Token Refresh Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testFullAuthFlow = async () => {
    setIsTestingAuth(true);
    setTestResults([]);
    
    addResult("=== Starting Full Authentication Flow Test ===");
    
    // Test 1: Check current auth state
    addResult("Step 1: Checking current authentication state");
    testTokenStorage();
    
    // Test 2: API call
    addResult("Step 2: Testing API call");
    await testApiCall();
    
    // Test 3: Token refresh
    if (isAuthenticated) {
      addResult("Step 3: Testing token refresh");
      await testTokenRefresh();
    }
    
    // Test 4: Enhanced API state
    addResult("Step 4: Enhanced API state");
    addResult(`Enhanced API - Is Authenticated: ${enhancedApi.isAuthenticated}`);
    addResult(`Enhanced API - Token Expired: ${enhancedApi.tokenExpired}`);
    addResult(`Enhanced API - User Info: ${enhancedApi.userInfo ? JSON.stringify(enhancedApi.userInfo) : 'None'}`);
    
    addResult("=== Authentication Flow Test Complete ===");
    setIsTestingAuth(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const handleLogout = () => {
    logout();
    addResult("User logged out - tokens cleared");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Authentication Flow Test</h2>
      
      {/* Current Auth Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Current Authentication Status</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}
          </div>
          <div>
            <strong>User:</strong> {user ? user.name || user.username : 'None'}
          </div>
          <div>
            <strong>Role:</strong> {user ? user.role : 'None'}
          </div>
          <div>
            <strong>Enhanced API Auth:</strong> {enhancedApi.isAuthenticated ? '✅ Yes' : '❌ No'}
          </div>
        </div>
      </div>

      {/* Test Controls */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={testTokenStorage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Token Storage
        </button>
        
        <button
          onClick={testApiCall}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test API Call
        </button>
        
        <button
          onClick={testTokenRefresh}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          disabled={!isAuthenticated}
        >
          Test Token Refresh
        </button>
        
        <button
          onClick={testFullAuthFlow}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          disabled={isTestingAuth}
        >
          {isTestingAuth ? 'Testing...' : 'Run Full Test'}
        </button>
        
        <button
          onClick={clearResults}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Results
        </button>
        
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>

      {/* Test Results */}
      <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
        <h3 className="text-white font-bold mb-2">Test Results:</h3>
        {testResults.length === 0 ? (
          <p className="text-gray-400">No test results yet. Click a test button to start.</p>
        ) : (
          testResults.map((result, index) => (
            <div key={index} className="mb-1">
              {result}
            </div>
          ))
        )}
      </div>
      
      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">How to Test:</h4>
        <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
          <li>If not logged in, go to login page and authenticate</li>
          <li>Return to this page and click "Run Full Test"</li>
          <li>Verify all components show consistent authentication state</li>
          <li>Test token refresh functionality</li>
          <li>Test logout to ensure all tokens are cleared</li>
        </ol>
      </div>
    </div>
  );
} 