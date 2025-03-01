import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { plaidClient } from '../../lib/plaid';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../lib/plaid';

export async function POST(request) {
  try {
    // Get public token from request body
    const body = await request.json();
    const { public_token, oauth_state_id } = body;
    
    if (!public_token) {
      return NextResponse.json(
        { error: 'Missing public_token in request body' },
        { status: 400 }
      );
    }
    
    // Log the OAuth flow parameters
    console.log('Exchanging public token from OAuth flow');
    console.log('OAuth state ID:', oauth_state_id);
    
    // Exchange public token for access token
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: public_token
    });
    
    // Get the access token and item ID from the response
    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;
    
    console.log('Successfully exchanged public token');
    console.log('Item ID:', itemId);
    
    // Here you would typically store the access_token in your database
    // associated with the current user
    // For example: await db.saveAccessToken(user.id, accessToken, itemId);
    
    // For this example, we'll just return success
    return NextResponse.json({
      success: true,
      item_id: itemId,
      // Don't send the access token to the client for security reasons
    });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    
    // Extract more detailed error information from Plaid
    let detailedError = 'Unknown error';
    if (error.response && error.response.data) {
      detailedError = JSON.stringify(error.response.data);
      console.error('Plaid API error details:', error.response.data);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to exchange public token', 
        details: detailedError,
        message: error.message 
      },
      { status: 500 }
    );
  }
} 