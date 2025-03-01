/**
 * LoopMessage API utility functions
 */

const BASE_URL = 'https://server.loopmessage.com/api';

interface SendMessageParams {
  to: string | string[];
  message: string;
  mediaUrl?: string;
}

interface MessageResponse {
  id: string;
  status: string;
  message: string;
}

/**
 * Safely parse response as JSON with fallback
 */
async function safelyParseJson(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      return { message: await response.text() };
    }
  } else {
    // Not JSON, return text with fallback message
    const text = await response.text();
    return { 
      message: text || `Server returned ${response.status} ${response.statusText}`
    };
  }
}

/**
 * Send a message using LoopMessage API
 */
export async function sendMessage({ to, message, mediaUrl }: SendMessageParams): Promise<MessageResponse> {
  try {
    const recipients = Array.isArray(to) ? to : [to];
    
    const response = await fetch(`${BASE_URL}/v1/message/send/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.LOOPMESSAGE_AUTH_KEY || '',
        'Loop-Secret-Key': process.env.LOOPMESSAGE_SECRET_KEY || '',
      },
      body: JSON.stringify({
        recipient: recipients[0], // LoopMessage API expects 'recipient' field
        text: message,
        ...(mediaUrl && { media_url: mediaUrl }),
      }),
    });

    if (!response.ok) {
      const errorData = await safelyParseJson(response);
      throw new Error(errorData.message || `Failed to send message (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message via LoopMessage:', error);
    throw error;
  }
}

/**
 * Get message status using LoopMessage API
 */
export async function getMessageStatus(messageId: string): Promise<MessageResponse> {
  try {
    const response = await fetch(`${BASE_URL}/v1/message/status/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.LOOPMESSAGE_AUTH_KEY || '',
        'Loop-Secret-Key': process.env.LOOPMESSAGE_SECRET_KEY || '',
      },
      body: JSON.stringify({
        message_id: messageId,
      }),
    });

    if (!response.ok) {
      const errorData = await safelyParseJson(response);
      throw new Error(errorData.message || `Failed to get message status (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting message status via LoopMessage:', error);
    throw error;
  }
}

/**
 * Test the LoopMessage API connection
 */
export async function testLoopMessageConnection(): Promise<{ success: boolean; message: string }> {
  try {
    // Check if API keys are set
    const apiKey = process.env.LOOPMESSAGE_AUTH_KEY;
    const secretKey = process.env.LOOPMESSAGE_SECRET_KEY;
    
    if (!apiKey || !secretKey) {
      return {
        success: false,
        message: 'LoopMessage API keys are not configured',
      };
    }
    
    // Simple request to test connection - will use status endpoint
    const response = await fetch(`${BASE_URL}/v1/message/status/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey,
        'Loop-Secret-Key': secretKey,
      },
      body: JSON.stringify({
        message_id: 'test-connection',
      }),
    });

    // Even if we get an error about invalid message ID, the connection works
    // We just want to check if the API is reachable and credentials are valid
    if (response.status !== 404 && !response.ok) {
      const errorData = await safelyParseJson(response);
      throw new Error(errorData.message || `Failed to connect to LoopMessage API (${response.status})`);
    }

    return {
      success: true,
      message: 'Successfully connected to LoopMessage API',
    };
  } catch (error) {
    console.error('Error testing LoopMessage connection:', error);
    return {
      success: false,
      message: (error as Error).message || 'Failed to connect to LoopMessage API',
    };
  }
} 