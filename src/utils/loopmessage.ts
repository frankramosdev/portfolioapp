/**
 * LoopMessage API utility functions
 */

const BASE_URL = 'https://api.loopmessage.com';

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
    
    const response = await fetch(`${BASE_URL}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LOOPMESSAGE_AUTH_KEY}`,
        'X-API-Secret': process.env.LOOPMESSAGE_SECRET_KEY || '',
      },
      body: JSON.stringify({
        recipients,
        content: message,
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
    const response = await fetch(`${BASE_URL}/v1/messages/${messageId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.LOOPMESSAGE_AUTH_KEY}`,
        'X-API-Secret': process.env.LOOPMESSAGE_SECRET_KEY || '',
      },
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
    // Simple ping request to test connection
    const response = await fetch(`${BASE_URL}/v1/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.LOOPMESSAGE_AUTH_KEY}`,
        'X-API-Secret': process.env.LOOPMESSAGE_SECRET_KEY || '',
      },
    });

    if (!response.ok) {
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