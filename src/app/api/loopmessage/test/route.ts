import { NextResponse } from 'next/server';
import { testLoopMessageConnection } from '@/utils/loopmessage';

export async function GET() {
  try {
    const result = await testLoopMessageConnection();
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      apiKey: process.env.LOOPMESSAGE_AUTH_KEY ? 'Configured' : 'Missing',
      secretKey: process.env.LOOPMESSAGE_SECRET_KEY ? 'Configured' : 'Missing',
    });
  } catch (error) {
    console.error('Error in LoopMessage test API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: (error as Error).message || 'An error occurred while testing LoopMessage', 
        message: 'Failed to test LoopMessage connection',
      },
      { status: 500 }
    );
  }
} 