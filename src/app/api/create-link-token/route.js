import { NextResponse } from 'next/server';
import { plaidClient } from '../../lib/plaid';
import { getPlaidRedirectUri } from '../../lib/utils';

export async function POST(request) {
  try {
    // Parse the request body to get the phone number if provided
    let phoneNumber = null;
    try {
      const body = await request.json();
      phoneNumber = body.phone_number;
    } catch {
      // If request parsing fails, continue without phone number
      console.log('No phone number provided in request body');
    }
    
    // Get the appropriate redirect URI based on environment
    const redirectUri = getPlaidRedirectUri(request);
    
    console.log('PLAID_CLIENT_ID:', process.env.PLAID_CLIENT_ID);
    console.log('PLAID_ENV:', process.env.PLAID_ENV);
    console.log('Using redirect URI:', redirectUri);
    
    // Create a unique client user ID
    const clientUserId = 'user-id-' + Date.now();
    
    // Base configuration for link token
    const tokenConfig = {
      user: { 
        client_user_id: clientUserId,
      },
      client_name: "Portfolio App",
      language: 'en',
      products: ['auth', 'transactions', 'investments'],
      country_codes: ['US'],
    };
    
    // Add phone number if provided - use E.164 format (e.g., +1XXXXXXXXXX)
    if (phoneNumber) {
      console.log('Using provided phone number for pre-filling');
      tokenConfig.user.phone_number = phoneNumber;
    }
    
    // Add redirect URI for OAuth flows, using our dynamic utility
    // This will use the appropriate URI based on whether we're
    // running locally or on Vercel
    tokenConfig.redirect_uri = redirectUri;
    
    console.log('Creating link token with config:', JSON.stringify(tokenConfig));
    const tokenResponse = await plaidClient.linkTokenCreate(tokenConfig);

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