import { NextResponse } from 'next/server';
import { plaidClient } from '../../lib/plaid';

export async function POST(request) {
  try {
    // Parse the request body to get the phone number if provided
    let phoneNumber = null;
    try {
      const body = await request.json();
      phoneNumber = body.phone_number;
    } catch (e) {
      // If request parsing fails, continue without phone number
      console.log('No phone number provided in request body');
    }
    
    console.log('PLAID_CLIENT_ID:', process.env.PLAID_CLIENT_ID);
    console.log('PLAID_ENV:', process.env.PLAID_ENV);
    console.log('PLAID_SANDBOX_REDIRECT_URI:', process.env.PLAID_SANDBOX_REDIRECT_URI);
    
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
    
    // Only add redirect_uri if you're using OAuth flows (e.g., for European banks)
    // If you're not specifically needing OAuth, you can leave this out
    // Uncomment this if you've configured the redirect URI in your Plaid dashboard:
    /*
    if (process.env.PLAID_SANDBOX_REDIRECT_URI) {
      tokenConfig.redirect_uri = process.env.PLAID_SANDBOX_REDIRECT_URI;
    }
    */
    
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