import { NextRequest, NextResponse } from 'next/server';
import { sendMessage } from '@/utils/loopmessage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, message, mediaUrl } = body;

    if (!to || !message) {
      return NextResponse.json(
        { error: 'Recipients (to) and message are required' },
        { status: 400 }
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
    return NextResponse.json(
      { 
        success: false,
        error: (error as Error).message || 'Failed to send message' 
      },
      { status: 500 }
    );
  }
} 