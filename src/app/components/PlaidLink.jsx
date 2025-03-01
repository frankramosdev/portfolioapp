'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useRouter } from 'next/navigation';

export default function PlaidLinkButton() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const createLinkToken = async () => {
      try {
        console.log('Fetching link token...');
        const response = await fetch('/api/create-link-token', {
          method: 'POST',
        });
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (!response.ok) {
          console.error('Server error:', data);
          throw new Error(`Failed to create link token: ${response.status} ${response.statusText}`);
        }
        
        if (!data.link_token) {
          console.error('No link_token in response:', data);
          // Check if there's an error message
          if (data.error) {
            setErrorDetails(data.details || data.message || 'Unknown error');
            throw new Error(`Plaid error: ${data.error}`);
          }
          throw new Error('No link_token in response');
        }
        
        console.log('Link token received successfully');
        setToken(data.link_token);
      } catch (error) {
        console.error('Error creating link token:', error);
        setError(error.message);
      }
    };
    
    createLinkToken();
  }, []);

  const onSuccess = useCallback(async (publicToken) => {
    try {
      console.log('Public token received, exchanging...');
      const response = await fetch('/api/exchange-public-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_token: publicToken }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(`Failed to exchange public token: ${response.status} ${response.statusText}`);
      }
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error exchanging public token:', error);
      setError(error.message);
    }
  }, [router]);

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
  });

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => open()} 
          disabled={!ready}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          Connect your bank account
        </button>
        <div className="text-red-500 text-sm">
          <p>{error}</p>
          {errorDetails && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
              <pre>{errorDetails}</pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={() => open()} 
      disabled={!ready}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
    >
      {ready ? 'Connect your bank account' : 'Loading...'}
    </button>
  );
} 