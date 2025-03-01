import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { plaidClient } from '../../lib/plaid';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../lib/plaid';

export async function GET() {
  try {
    const session = await getIronSession(cookies(), sessionOptions);
    
    if (!session.access_token) {
      return NextResponse.json(
        { error: 'No access token found' },
        { status: 401 }
      );
    }

    const response = await plaidClient.accountsBalanceGet({
      access_token: session.access_token,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
} 