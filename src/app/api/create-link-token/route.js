import { NextResponse } from 'next/server';
import { plaidClient } from '../../lib/plaid';

export async function POST() {
  try {
    const tokenResponse = await plaidClient.linkTokenCreate({
      user: { client_user_id: process.env.PLAID_CLIENT_ID },
      client_name: "Portfolio App",
      language: 'en',
      products: ['auth', 'transactions'],
      country_codes: ['US'],
      redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
    });

    return NextResponse.json(tokenResponse.data);
  } catch (error) {
    console.error('Error creating link token:', error);
    return NextResponse.json(
      { error: 'Failed to create link token' },
      { status: 500 }
    );
  }
} 