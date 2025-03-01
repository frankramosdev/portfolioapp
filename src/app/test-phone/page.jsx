'use client';

import { useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';

export default function TestPhonePage() {
  const [phoneNumber, setPhoneNumber] = useState('1234567890');
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  // Format the display phone number with proper formatting
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    
    // Clean input of all non-digit chars
    const phoneNumber = value.replace(/[^\d]/g, '');
    
    // Apply different formats based on length
    if (phoneNumber.length < 4) return phoneNumber;
    if (phoneNumber.length < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    // Strip non-digit characters for consistency in storage
    const input = e.target.value;
    const cleaned = input.replace(/\D/g, '');
    setPhoneNumber(cleaned);
  };

  const createLinkToken = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Format to E.164 format for Plaid
      const formattedPhone = phoneNumber.length === 10 ? 
        `+1${phoneNumber}` : phoneNumber;
      
      const response = await fetch('/api/create-link-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone_number: formattedPhone 
        }),
      });
      
      const data = await response.json();
      setResponse(data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create link token');
      }
      
      if (data.link_token) {
        setToken(data.link_token);
      } else {
        throw new Error('No link token in response');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error creating link token:', err);
    } finally {
      setLoading(false);
    }
  };

  const { open, ready } = usePlaidLink({
    token,
    onSuccess: (public_token) => {
      setResponse({
        ...response,
        success: true,
        public_token: public_token,
        message: 'Successfully retrieved public token!'
      });
    },
    onExit: (err, metadata) => {
      console.log('Link exited', err, metadata);
      if (err) {
        setError(`Link exited with error: ${err.error_message || err.display_message || JSON.stringify(err)}`);
      }
    },
  });

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Plaid Phone Pre-fill Test</h1>
      
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone Number (for sandbox, try "1234567890")
          </label>
          <input
            id="phone"
            type="tel"
            value={formatPhoneNumber(phoneNumber)}
            onChange={handlePhoneChange}
            placeholder="(123) 456-7890"
            className="w-full px-4 py-2 border rounded-md"
          />
          <p className="text-sm text-gray-500 mt-1">
            This will be sent to Plaid for pre-filling the phone verification step
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={createLinkToken}
            disabled={loading || !phoneNumber || phoneNumber.length < 10}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Link Token'}
          </button>
          
          {token && (
            <button
              onClick={() => open()}
              disabled={!ready}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Open Plaid Link
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
          <h3 className="text-red-700 font-medium">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {response && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">API Response</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 