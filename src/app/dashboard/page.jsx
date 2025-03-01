'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InvestmentAnalysis from '../components/InvestmentAnalysis';

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
    return <div className="p-4 dark:text-white">Loading account information...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500 dark:text-red-400">{error}</div>;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Your Dashboard</h1>
      
      {/* Bank Accounts Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3 dark:text-white">Bank Accounts</h2>
        {accounts && accounts.accounts && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accounts.accounts.map((account) => (
              <div key={account.account_id} className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
                <h3 className="text-lg font-semibold dark:text-white">{account.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{account.official_name}</p>
                <p className="text-gray-600 dark:text-gray-300">Type: {account.type} / {account.subtype}</p>
                <p className="mt-2 dark:text-white">
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
          <p className="dark:text-white">No bank accounts found. Please connect your bank account.</p>
        )}
      </div>
      
      {/* 401k Investment Section */}
      {investmentData && investmentData.has_investments && investmentData.plaid_401k && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 dark:text-white">401k Investments</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold dark:text-white">{investmentData.plaid_401k.account_name}</h3>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {formatCurrency(investmentData.plaid_401k.account_value)}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Account Type: {investmentData.plaid_401k.account_type}</p>
            
            {/* Holdings Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Security</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ticker</th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Quantity</th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Price</th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {investmentData.plaid_401k.holdings.map((holding, index) => (
                    <tr key={`${holding.security_id}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {holding.security_name}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {holding.ticker_symbol || 'N/A'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">
                        {holding.quantity}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">
                        {formatCurrency(holding.institution_price)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-right">
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
      
      {/* IRA Investment Section */}
      {investmentData && investmentData.has_investments && investmentData.plaid_ira && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 dark:text-white">IRA Investments</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold dark:text-white">{investmentData.plaid_ira.account_name}</h3>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {formatCurrency(investmentData.plaid_ira.account_value)}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Account Type: {investmentData.plaid_ira.account_type}</p>
            
            {/* Holdings Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Security</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ticker</th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Quantity</th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Price</th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {investmentData.plaid_ira.holdings.map((holding, index) => (
                    <tr key={`${holding.security_id}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {holding.security_name}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {holding.ticker_symbol || 'N/A'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">
                        {holding.quantity}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">
                        {formatCurrency(holding.institution_price)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-right">
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
      
      {/* AI Investment Analysis */}
      {investmentData && investmentData.has_investments && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 dark:text-white">AI Portfolio Analysis</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <InvestmentAnalysis 
              holdings={investmentData.has_investments ? 
                [
                  ...(investmentData.plaid_401k?.holdings || []),
                  ...(investmentData.plaid_ira?.holdings || [])
                ] : []
              }
              chatId="6a9fafd6-48d0-42d5-bf70-770169c5f46f"
            />
          </div>
        </div>
      )}
      
      <button 
        onClick={() => router.push('/')}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
      >
        Connect Another Account
      </button>
    </div>
  );
} 