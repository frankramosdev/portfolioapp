import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get environment variables
    const plaidEnv = process.env.PLAID_ENV || 'undefined';
    const clientId = process.env.PLAID_CLIENT_ID || 'undefined';
    const secretLength = process.env.PLAID_SECRET ? process.env.PLAID_SECRET.length : 0;
    const redirectUri = process.env.PLAID_SANDBOX_REDIRECT_URI || 'undefined';
    
    // Check if they're actually defined
    const envStatus = {
      PLAID_ENV: {
        defined: !!process.env.PLAID_ENV,
        value: plaidEnv
      },
      PLAID_CLIENT_ID: {
        defined: !!process.env.PLAID_CLIENT_ID,
        value: clientId
      },
      PLAID_SECRET: {
        defined: !!process.env.PLAID_SECRET,
        length: secretLength,
        // Don't return the actual secret, just whether it's defined and its length
        note: secretLength > 0 ? "Secret is defined" : "Secret is missing"
      },
      PLAID_SANDBOX_REDIRECT_URI: {
        defined: !!process.env.PLAID_SANDBOX_REDIRECT_URI,
        value: redirectUri
      }
    };
    
    return NextResponse.json({
      success: true,
      message: 'Environment variables retrieved',
      envStatus
    });
  } catch (error) {
    console.error('Error testing environment variables:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to test environment variables',
      message: error.message
    }, { status: 500 });
  }
} 