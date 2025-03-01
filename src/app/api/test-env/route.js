import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    env: process.env.NODE_ENV,
    plaidEnv: process.env.PLAID_ENV,
    clientId: process.env.PLAID_CLIENT_ID ? 'defined' : 'undefined',
    secret: process.env.PLAID_SECRET ? 'defined' : 'undefined',
    redirectUri: process.env.PLAID_SANDBOX_REDIRECT_URI,
  });
} 