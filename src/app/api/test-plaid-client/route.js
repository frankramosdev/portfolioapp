import { NextResponse } from 'next/server';
import { plaidClient } from '../../lib/plaid';

export async function GET() {
  try {
    console.log('Testing Plaid client connection...');
    
    // Try to fetch institutions as a simple test
    const response = await plaidClient.institutionsGet({
      count: 1,
      offset: 0,
      country_codes: ['US'],
      options: {
        include_optional_metadata: false
      }
    });
    
    console.log('Plaid client test successful!');
    
    return NextResponse.json({
      success: true,
      message: 'Plaid client is working correctly',
      institution: response.data.institutions[0].name
    });
  } catch (error) {
    console.error('Error testing Plaid client:', error);
    
    let errorDetails = 'Unknown error';
    if (error.response && error.response.data) {
      errorDetails = JSON.stringify(error.response.data);
      console.error('Plaid API error details:', error.response.data);
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to test Plaid client',
      message: error.message,
      details: errorDetails
    }, { status: 500 });
  }
} 