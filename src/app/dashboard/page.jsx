'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [accounts, setAccounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/accounts');
        
        if (response.status === 401) {
          router.push('/');
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch accounts');
        }
        
        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setError('Failed to fetch account information. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAccounts();
  }, [router]);

  if (loading) {
    return <div className="p-4">Loading account information...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Accounts</h1>
      
      {accounts && accounts.accounts && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.accounts.map((account) => (
            <div key={account.account_id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold">{account.name}</h2>
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
        <p>No accounts found. Please connect your bank account.</p>
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