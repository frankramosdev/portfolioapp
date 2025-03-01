'use client';

import { useState, useEffect } from 'react';

export default function TestPlaid() {
  const [envData, setEnvData] = useState(null);
  const [envLoading, setEnvLoading] = useState(true);
  const [envError, setEnvError] = useState(null);
  
  const [clientTest, setClientTest] = useState(null);
  const [clientLoading, setClientLoading] = useState(true);
  const [clientError, setClientError] = useState(null);
  
  const [linkToken, setLinkToken] = useState(null);
  const [linkLoading, setLinkLoading] = useState(true);
  const [linkError, setLinkError] = useState(null);

  // Test environment variables
  useEffect(() => {
    const testEnv = async () => {
      try {
        setEnvLoading(true);
        const response = await fetch('/api/test-env');
        const data = await response.json();
        setEnvData(data);
      } catch (error) {
        console.error('Error testing env:', error);
        setEnvError(error.message);
      } finally {
        setEnvLoading(false);
      }
    };
    
    testEnv();
  }, []);

  // Test Plaid client connection
  useEffect(() => {
    const testPlaidClient = async () => {
      try {
        setClientLoading(true);
        const response = await fetch('/api/test-plaid-client');
        const data = await response.json();
        setClientTest(data);
      } catch (error) {
        console.error('Error testing Plaid client:', error);
        setClientError(error.message);
      } finally {
        setClientLoading(false);
      }
    };
    
    testPlaidClient();
  }, []);

  // Test link token creation
  useEffect(() => {
    const testLinkToken = async () => {
      try {
        setLinkLoading(true);
        const response = await fetch('/api/create-link-token', {
          method: 'POST',
        });
        const data = await response.json();
        setLinkToken(data);
      } catch (error) {
        console.error('Error creating link token:', error);
        setLinkError(error.message);
      } finally {
        setLinkLoading(false);
      }
    };
    
    testLinkToken();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Plaid Integration Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
        {envLoading ? (
          <p>Loading environment data...</p>
        ) : envError ? (
          <p className="text-red-500">{envError}</p>
        ) : (
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(envData, null, 2)}
          </pre>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Plaid Client Test</h2>
        {clientLoading ? (
          <p>Testing Plaid client connection...</p>
        ) : clientError ? (
          <p className="text-red-500">{clientError}</p>
        ) : (
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(clientTest, null, 2)}
          </pre>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Link Token Creation</h2>
        {linkLoading ? (
          <p>Creating link token...</p>
        ) : linkError ? (
          <p className="text-red-500">{linkError}</p>
        ) : (
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(linkToken, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
} 