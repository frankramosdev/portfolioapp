import { NextResponse } from 'next/server';
import { testLoopMessageConnection } from '@/utils/loopmessage';

export async function GET() {
  // First check if API keys are configured at all
  const authKey = process.env.LOOPMESSAGE_AUTH_KEY;
  const secretKey = process.env.LOOPMESSAGE_SECRET_KEY;
  
  const apiKeyStatus = !authKey 
    ? 'Missing' 
    : authKey.startsWith('xxxxxxxxx') 
      ? 'Invalid (placeholder value)' 
      : 'Configured';
      
  const secretKeyStatus = !secretKey 
    ? 'Missing' 
    : secretKey.startsWith('xxxxxxxxx') 
      ? 'Invalid (placeholder value)' 
      : 'Configured';
  
  // If keys are missing, return early with configuration error
  if (!authKey || !secretKey) {
    return NextResponse.json({
      success: false,
      message: 'LoopMessage API keys not fully configured',
      apiKey: apiKeyStatus,
      secretKey: secretKeyStatus,
      configStatus: 'incomplete',
      recommendations: [
        'Make sure LOOPMESSAGE_AUTH_KEY and LOOPMESSAGE_SECRET_KEY are set in your .env.local file',
        'Restart your server after updating environment variables'
      ]
    });
  }
  
  try {
    const result = await testLoopMessageConnection();
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      apiKey: apiKeyStatus,
      secretKey: secretKeyStatus,
      configStatus: result.success ? 'valid' : 'invalid',
      baseUrl: 'https://api.loopmessage.com',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in LoopMessage test API:', error);
    const errorMessage = (error as Error).message || 'An error occurred while testing LoopMessage';
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        message: 'Failed to test LoopMessage connection',
        apiKey: apiKeyStatus,
        secretKey: secretKeyStatus,
        configStatus: 'error',
        recommendations: [
          'Check that your API keys are correct',
          'Ensure your network allows connections to api.loopmessage.com',
          'Check if the LoopMessage service is operational'
        ]
      },
      { status: 500 }
    );
  }
} 