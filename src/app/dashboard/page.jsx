'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [accounts, setAccounts] = useState(null);
  const [investmentData, setInvestmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch regular accounts
        const accountsResponse = await fetch('/api/accounts');
        
        if (accountsResponse.status === 401) {
          router.push('/');
          return;
        }
        
        if (!accountsResponse.ok) {
          throw new Error('Failed to fetch accounts');
        }
        
        const accountsData = await accountsResponse.json();
        setAccounts(accountsData);
        
        // Fetch investment data
        try {
          const investmentResponse = await fetch('/api/dashboard/investments');
          if (investmentResponse.ok) {
            const investmentData = await investmentResponse.json();
            setInvestmentData(investmentData);
          }
        } catch (investError) {
          console.error('Error fetching investment data:', investError);
          // Don't fail the whole dashboard if investment data fails
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setError('Failed to fetch account information. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [router]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  if (loading) {
    return <div className="p-4">Loading account information...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Dashboard</h1>
      
      {/* Bank Accounts Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Bank Accounts</h2>
        {accounts && accounts.accounts && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accounts.accounts.map((account) => (
              <div key={account.account_id} className="border rounded-lg p-4 shadow-sm bg-white">
                <h3 className="text-lg font-semibold">{account.name}</h3>
                <p className="text-gray-600">{account.official_name}</p>
                <p className="text-gray-600">Type: {account.type} / {account.subtype}</p>
                <p className="mt-2">
                  <span className="font-medium">Balance: </span>
                  <span className="font-bold">
                    ${account.balances.available || account.balances.current || 0}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
        
        {(!accounts || !accounts.accounts || accounts.accounts.length === 0) && (
          <p>No bank accounts found. Please connect your bank account.</p>
        )}
      </div>
      
      {/* 401k Investment Section */}
      {investmentData && investmentData.has_investments && investmentData.plaid_401k && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">401k Investments</h2>
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">{investmentData.plaid_401k.account_name}</h3>
              <div className="text-lg font-bold text-green-600">
                {formatCurrency(investmentData.plaid_401k.account_value)}
              </div>
            </div>
            <p className="text-gray-600 mb-4">Account Type: {investmentData.plaid_401k.account_type}</p>
            
            {/* Holdings Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Security</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ticker</th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {investmentData.plaid_401k.holdings.map((holding, index) => (
                    <tr key={`${holding.security_id}-${index}`} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {holding.security_name}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {holding.ticker_symbol || 'N/A'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                        {holding.quantity}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                        {formatCurrency(holding.institution_price)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(holding.institution_value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => router.push('/')}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Connect Another Account
      </button>
    </div>
  );
} 