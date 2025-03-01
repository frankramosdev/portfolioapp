import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { plaidClient } from '../../lib/plaid';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../lib/plaid';

export async function POST(request) {
  try {
    const session = await getIronSession(cookies(), sessionOptions);
    const { public_token } = await request.json();

    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    session.access_token = exchangeResponse.data.access_token;
    session.item_id = exchangeResponse.data.item_id;
    await session.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    return NextResponse.json(
      { error: 'Failed to exchange public token' },
      { status: 500 }
    );
  }
} 