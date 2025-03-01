'use client';

import { useState } from 'react';
import PlaidLinkButton from '../components/PlaidLink';
import InvestmentHoldings from '../components/InvestmentHoldings';
import InvestmentTransactions from '../components/InvestmentTransactions';

export default function TestInvestmentsPage() {
  const [accessToken, setAccessToken] = useState('');
  const [selectedTab, setSelectedTab] = useState('holdings');
  
  // This would typically be set after the Plaid Link flow
  // or retrieved from your backend where you store the tokens
  const handleAccessTokenChange = (e) => {
    setAccessToken(e.target.value);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Investment Data Test Page
        </h1>
        <p className="text-lg text-gray-600">
          This page allows you to test Plaid's investment data functionality.
        </p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Connect Investment Account</h2>
        <PlaidLinkButton />
        
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-medium mb-3">
            Manual Testing (with existing access token)
          </h3>
          <div className="mb-4">
            <label 
              htmlFor="access_token" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Access Token (paste from your backend)
            </label>
            <input
              type="text"
              id="access_token"
              value={accessToken}
              onChange={handleAccessTokenChange}
              placeholder="access-sandbox-..."
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <p className="mt-1 text-sm text-gray-500">
              For testing, you can use a sandbox token where you've connected to an institution with investment accounts.
            </p>
          </div>
        </div>
      </div>
      
      {accessToken && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px" aria-label="Tabs">
              <button
                onClick={() => setSelectedTab('holdings')}
                className={`px-6 py-4 text-sm font-medium ${
                  selectedTab === 'holdings'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Holdings
              </button>
              <button
                onClick={() => setSelectedTab('transactions')}
                className={`px-6 py-4 text-sm font-medium ${
                  selectedTab === 'transactions'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Transactions
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {selectedTab === 'holdings' ? (
              <InvestmentHoldings accessToken={accessToken} />
            ) : (
              <InvestmentTransactions accessToken={accessToken} />
            )}
          </div>
        </div>
      )}
      
      <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Using Plaid Sandbox</h3>
        <p className="text-blue-700">
          For testing with Plaid Sandbox, use the following credentials:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-blue-700">
          <li>Username: <code className="bg-blue-100 px-1 rounded">user_good</code></li>
          <li>Password: <code className="bg-blue-100 px-1 rounded">pass_good</code></li>
          <li>Phone: <code className="bg-blue-100 px-1 rounded">1234567890</code></li>
          <li>
            Use institutions like <code className="bg-blue-100 px-1 rounded">Fidelity</code> or <code className="bg-blue-100 px-1 rounded">Vanguard</code> to test investment data
          </li>
        </ul>
      </div>
    </div>
  );
} 