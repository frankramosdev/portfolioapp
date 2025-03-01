import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { plaidClient } from '../../../lib/plaid';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../../lib/plaid';

export async function GET() {
  try {
    const session = await getIronSession(cookies(), sessionOptions);
    
    if (!session.access_token) {
      return NextResponse.json(
        { error: 'No access token found' },
        { status: 401 }
      );
    }

    // Get all accounts
    const accountsResponse = await plaidClient.accountsGet({
      access_token: session.access_token,
    });

    // Check if user has investment accounts
    const investmentAccounts = accountsResponse.data.accounts.filter(
      account => account.type === 'investment'
    );

    if (investmentAccounts.length === 0) {
      return NextResponse.json({
        has_investments: false,
        message: 'No investment accounts found'
      });
    }

    // Fetch holdings data from Plaid
    const holdingsResponse = await plaidClient.investmentsHoldingsGet({
      access_token: session.access_token
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
    const holdingsByAccount = investmentAccounts.map(account => {
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
    
    // Get the 401k account specifically
    const plaid401k = holdingsByAccount.find(
      account => account.account_name.includes('401k') || account.account_subtype === '401k'
    );

    return NextResponse.json({
      has_investments: true,
      all_accounts: holdingsByAccount,
      plaid_401k: plaid401k || null,
      securities
    });

  } catch (error) {
    console.error('Error fetching investment data:', error);
    
    let errorMessage = error.message;
    let errorDetails = 'Unknown error';
    
    if (error.response && error.response.data) {
      errorDetails = JSON.stringify(error.response.data);
      console.error('Plaid API error details:', error.response.data);
    }
    
    return NextResponse.json({
      error: 'Failed to fetch investment data',
      message: errorMessage,
      details: errorDetails
    }, { status: 500 });
  }
} 