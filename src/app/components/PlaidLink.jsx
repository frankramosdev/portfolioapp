'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useRouter } from 'next/navigation';

export default function PlaidLinkButton() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoadingToken, setIsLoadingToken] = useState(false);
  const router = useRouter();

  const createLinkToken = async (phoneNum = null) => {
    try {
      setIsLoadingToken(true);
      setError(null);
      setErrorDetails(null);
      
      console.log('Fetching link token...');
      const requestBody = {};
      
      // Add phone number to request if available
      if (phoneNum) {
        // Format phone number to E.164 format if it doesn't already have a country code
        let formattedPhone = phoneNum;
        if (phoneNum.startsWith('+')) {
          // Already has country code
          formattedPhone = phoneNum;
        } else if (phoneNum.length === 10) {
          // US number without country code
          formattedPhone = '+1' + phoneNum;
        }
        
        requestBody.phone_number = formattedPhone;
        console.log('Using phone number:', formattedPhone);
      }
      
      const response = await fetch('/api/create-link-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
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
    } finally {
      setIsLoadingToken(false);
    }
  };

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

  const handleStartLinking = () => {
    if (token) {
      // If we already have a token, open the Plaid Link
      open();
    } else {
      // Otherwise, fetch a new token with the phone number
      createLinkToken(phoneNumber);
    }
  };

  const handlePhoneNumberChange = (e) => {
    // Strip non-digit characters for consistency
    const cleaned = e.target.value.replace(/\D/g, '');
    setPhoneNumber(cleaned);
  };

  // When token is received, automatically open Plaid Link
  useEffect(() => {
    if (token && ready) {
      open();
    }
  }, [token, ready, open]);

  return (
    <div className="flex flex-col gap-3">
      {!token && (
        <div className="flex flex-col gap-2">
          <label htmlFor="phone_number" className="text-sm font-medium">
            Phone Number (for faster verification)
          </label>
          <input
            id="phone_number"
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="10-digit phone number (e.g., 3109852847)"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500">
            For Plaid sandbox, try using simple numbers like "1234567890"
          </p>
        </div>
      )}
      
      <button 
        onClick={handleStartLinking} 
        disabled={isLoadingToken || (token && !ready)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isLoadingToken ? 'Loading...' : 
         token ? 'Open Plaid Link' : 'Connect your bank account'}
      </button>
      
      {error && (
        <div className="text-red-500 text-sm">
          <p>{error}</p>
          {errorDetails && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
              <pre>{errorDetails}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 