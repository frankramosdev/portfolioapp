import { NextRequest, NextResponse } from 'next/server';
import { sendMessage } from '@/utils/loopmessage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, message, mediaUrl } = body;

    if (!to || !message) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Recipients (to) and message are required' 
        },
        { status: 400 }
      );
    }

    // Check if API keys are configured
    if (!process.env.LOOPMESSAGE_AUTH_KEY || !process.env.LOOPMESSAGE_SECRET_KEY) {
      console.error('LoopMessage API keys not configured');
      return NextResponse.json(
        {
          success: false,
          error: 'LoopMessage API is not properly configured',
          details: 'Missing API keys in environment variables'
        },
        { status: 500 }
      );
    }
    
    const result = await sendMessage({ to, message, mediaUrl });

    return NextResponse.json({
      success: true,
      messageId: result.id,
      status: result.status,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Error in LoopMessage send API:', error);
    
    // Extract more details if available
    const errorMessage = (error as Error).message || 'Failed to send message';
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: errorMessage.includes('<!DOCTYPE') 
          ? 'Server returned HTML instead of JSON. Check API credentials and URL.'
          : undefined
      },
      { status: 500 }
    );
  }
} 