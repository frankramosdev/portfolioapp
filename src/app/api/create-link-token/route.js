import { NextResponse } from 'next/server';
import { plaidClient } from '../../lib/plaid';

export async function POST() {
  try {
    console.log('PLAID_CLIENT_ID:', process.env.PLAID_CLIENT_ID);
    console.log('PLAID_ENV:', process.env.PLAID_ENV);
    console.log('PLAID_SANDBOX_REDIRECT_URI:', process.env.PLAID_SANDBOX_REDIRECT_URI);
    
    const tokenResponse = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'user-id-' + Date.now() },
      client_name: "Portfolio App",
      language: 'en',
      products: ['auth', 'transactions'],
      country_codes: ['US'],
      redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
    });

    console.log('Token created successfully');
    return NextResponse.json(tokenResponse.data);
  } catch (error) {
    console.error('Error creating link token:', error);
    
    // Extract more detailed error information from Plaid
    let detailedError = 'Unknown error';
    if (error.response && error.response.data) {
      detailedError = JSON.stringify(error.response.data);
      console.error('Plaid API error details:', error.response.data);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create link token', 
        details: detailedError,
        message: error.message 
      },
      { status: 500 }
    );
  }
} 