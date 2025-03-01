import { NextResponse } from 'next/server';
import { plaidClient } from '../../../lib/plaid';

export async function POST(request) {
  try {
    // Get access token from request body
    const { access_token } = await request.json();
    
    if (!access_token) {
      return NextResponse.json({
        error: 'Missing access_token'
      }, { status: 400 });
    }
    
    console.log('Fetching investment holdings...');
    
    // Fetch holdings data from Plaid
    const holdingsResponse = await plaidClient.investmentsHoldingsGet({
      access_token
    });
    
    // Fetch account data to get account names
    const accountsResponse = await plaidClient.accountsGet({
      access_token
    });
    
    // Process and combine the data
    const holdings = holdingsResponse.data.holdings;
    const securities = holdingsResponse.data.securities;
    const accounts = accountsResponse.data.accounts;
    
    // Enrich holdings with security and account information
    const enrichedHoldings = holdings.map(holding => {
      const security = securities.find(sec => sec.security_id === holding.security_id) || {};
      const account = accounts.find(acc => acc.account_id === holding.account_id) || {};
      
      return {
        ...holding,
        security_name: security.name || 'Unknown',
        security_type: security.type || 'Unknown',
        ticker_symbol: security.ticker_symbol || null,
        account_name: account.name || 'Unknown Account',
        account_type: account.type || 'Unknown',
        account_subtype: account.subtype || 'Unknown',
      };
    });
    
    // Group holdings by account
    const holdingsByAccount = accounts
      .filter(account => account.type === 'investment')
      .map(account => {
        const accountHoldings = enrichedHoldings.filter(
          holding => holding.account_id === account.account_id
        );
        
        const accountValue = accountHoldings.reduce(
          (sum, holding) => sum + holding.institution_value, 
          0
        );
        
        return {
          account_id: account.account_id,
          account_name: account.name,
          account_type: account.subtype,
          account_value: accountValue,
          holdings: accountHoldings
        };
      });
    
    return NextResponse.json({
      accounts: holdingsByAccount,
      holdings: enrichedHoldings,
      securities
    });
    
  } catch (error) {
    console.error('Error fetching investment holdings:', error);
    
    let errorMessage = error.message;
    let errorDetails = 'Unknown error';
    
    if (error.response && error.response.data) {
      errorDetails = JSON.stringify(error.response.data);
      console.error('Plaid API error details:', error.response.data);
    }
    
    return NextResponse.json({
      error: 'Failed to fetch investment holdings',
      message: errorMessage,
      details: errorDetails
    }, { status: 500 });
  }
} 