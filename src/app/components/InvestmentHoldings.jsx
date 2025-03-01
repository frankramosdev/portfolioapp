'use client';

import { useState, useEffect } from 'react';

export default function InvestmentHoldings({ accessToken }) {
  const [holdings, setHoldings] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [securities, setSecurities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState('all');

  useEffect(() => {
    if (!accessToken) return;
    
    const fetchHoldings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/investments/holdings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ access_token: accessToken }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch holdings');
        }
        
        setHoldings(data.holdings);
        setAccounts(data.accounts);
        setSecurities(data.securities);
      } catch (err) {
        console.error('Error fetching holdings:', err);
        setError(err.message || 'An error occurred fetching your investment data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHoldings();
  }, [accessToken]);
  
  // Filter holdings based on selected account
  const filteredHoldings = holdings 
    ? selectedAccount === 'all' 
      ? holdings 
      : holdings.filter(holding => holding.account_id === selectedAccount)
    : [];
  
  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  
  // Calculate total portfolio value
  const portfolioValue = accounts.reduce((sum, account) => 
    sum + account.account_value, 0
  );
  
  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-center text-gray-500">Loading investment data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-700 font-medium">Error Loading Investments</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  
  if (!holdings || holdings.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-center text-gray-500">No investment holdings found.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Portfolio Summary</h2>
        <p className="text-2xl font-bold text-green-700">
          {formatCurrency(portfolioValue)}
        </p>
        
        <div className="mt-4">
          <label htmlFor="account-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Account
          </label>
          <select
            id="account-filter"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Accounts</option>
            {accounts.map(account => (
              <option key={account.account_id} value={account.account_id}>
                {account.account_name} ({formatCurrency(account.account_value)})
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Holdings</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Security
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticker
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHoldings.map((holding, index) => (
                <tr key={`${holding.account_id}-${holding.security_id}-${index}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{holding.security_name}</div>
                    <div className="text-sm text-gray-500">{holding.account_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {holding.ticker_symbol || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {holding.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(holding.institution_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(holding.institution_value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 