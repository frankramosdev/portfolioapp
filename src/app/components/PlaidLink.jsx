'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useRouter } from 'next/navigation';

export default function PlaidLinkButton() {
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const response = await fetch('/api/create-link-token', {
          method: 'POST',
        });
        
        if (!response.ok) {
          throw new Error('Failed to create link token');
        }
        
        const data = await response.json();
        setToken(data.link_token);
      } catch (error) {
        console.error('Error creating link token:', error);
      }
    };
    
    createLinkToken();
  }, []);

  const onSuccess = useCallback(async (publicToken) => {
    try {
      const response = await fetch('/api/exchange-public-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_token: publicToken }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to exchange public token');
      }
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error exchanging public token:', error);
    }
  }, [router]);

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
  });

  return (
    <button 
      onClick={() => open()} 
      disabled={!ready}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
    >
      Connect your bank account
    </button>
  );
} 