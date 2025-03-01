import { NextResponse } from 'next/server';
import { plaidClient } from '../../../lib/plaid';

export async function POST(request) {
  try {
    // Get access token and date range from request body
    const { access_token, start_date, end_date } = await request.json();
    
    if (!access_token) {
      return NextResponse.json({
        error: 'Missing access_token'
      }, { status: 400 });
    }
    
    // Default to last 30 days if dates not provided
    const now = new Date();
    const defaultEndDate = now.toISOString().split('T')[0]; // Today in YYYY-MM-DD
    
    const defaultStartDate = new Date(now);
    defaultStartDate.setDate(now.getDate() - 30);
    const formattedDefaultStartDate = defaultStartDate.toISOString().split('T')[0]; // 30 days ago
    
    const startDate = start_date || formattedDefaultStartDate;
    const endDate = end_date || defaultEndDate;
    
    console.log(`Fetching investment transactions from ${startDate} to ${endDate}...`);
    
    // Fetch transactions data from Plaid
    const txResponse = await plaidClient.investmentsTransactionsGet({
      access_token,
      start_date: startDate,
      end_date: endDate,
    });
    
    // Process and organize the data
    const transactions = txResponse.data.investment_transactions;
    const accounts = txResponse.data.accounts;
    const securities = txResponse.data.securities;
    
    // Enrich transactions with security and account information
    const enrichedTransactions = transactions.map(tx => {
      const security = securities.find(sec => sec.security_id === tx.security_id) || {};
      const account = accounts.find(acc => acc.account_id === tx.account_id) || {};
      
      return {
        ...tx,
        security_name: security.name || 'Unknown',
        ticker_symbol: security.ticker_symbol || null,
        account_name: account.name || 'Unknown Account',
        account_type: account.subtype || 'Unknown',
      };
    });
    
    // Group transactions by account
    const transactionsByAccount = accounts
      .filter(account => account.type === 'investment')
      .map(account => {
        const accountTransactions = enrichedTransactions.filter(
          tx => tx.account_id === account.account_id
        );
        
        return {
          account_id: account.account_id,
          account_name: account.name,
          account_type: account.subtype,
          transactions: accountTransactions
        };
      });
    
    return NextResponse.json({
      accounts: transactionsByAccount,
      transactions: enrichedTransactions,
      securities,
      total_transactions: transactions.length,
      date_range: {
        start_date: startDate,
        end_date: endDate
      }
    });
    
  } catch (error) {
    console.error('Error fetching investment transactions:', error);
    
    let errorMessage = error.message;
    let errorDetails = 'Unknown error';
    
    if (error.response && error.response.data) {
      errorDetails = JSON.stringify(error.response.data);
      console.error('Plaid API error details:', error.response.data);
    }
    
    return NextResponse.json({
      error: 'Failed to fetch investment transactions',
      message: errorMessage,
      details: errorDetails
    }, { status: 500 });
  }
} 