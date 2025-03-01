import { Toolhouse } from '@toolhouseai/sdk';
import OpenAI from 'openai';
import type { ChatCompletionTool } from 'openai/resources/chat/completions';

// Initialize Toolhouse with API key from environment
export const toolhouse = new Toolhouse({
  apiKey: process.env.TOOLHOUSE_API_KEY || '',
});

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Function to get tools from Toolhouse and use them with OpenAI
export async function getToolsAndExecute(query: string) {
  try {
    // Get tools from Toolhouse - using correct types
    const tools = await toolhouse.getTools("openai/gpt-4");

    // Execute the query with OpenAI using Toolhouse tools
    // The tools from Toolhouse are already in the correct format for OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: query }],
      tools: tools as ChatCompletionTool[], // Use proper OpenAI type
    });

    return response;
  } catch (error) {
    console.error('Error using Toolhouse:', error);
    throw error;
  }
}

/**
 * Toolhouse API utility functions for investment analysis
 */

// Types for investment data
interface SecurityInfo {
  security_name: string;
  security_type: string;
  ticker_symbol: string | null;
}

interface AgentRunResponse {
  data: {
    id: string;
    chat_id: string;
    status: string;
    results?: any[];
    created_at: string;
    updated_at: string;
    bundle: string;
    toolhouse_id: string;
  };
}

/**
 * Create a Toolhouse Agent Run using the specified chat ID
 * @param chatId The Toolhouse chat ID to use for the agent run
 * @returns The created agent run data
 */
export async function createInvestmentAgentRun(chatId: string): Promise<AgentRunResponse | null> {
  try {
    const url = 'https://api.toolhouse.ai/v1/agent-runs';
    const headers = {
      'Authorization': `Bearer ${process.env.TOOLHOUSE_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const body = JSON.stringify({
      'chat_id': chatId,
      'metadata': {
        'dataType': 'investmentData'
      }
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Agent Run created successfully:', data);
      return data;
    } else {
      console.error('Failed to create Agent Run:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return null;
    }
  } catch (error) {
    console.error('An error occurred creating agent run:', error);
    return null;
  }
}

/**
 * Continue an existing agent run with investment data
 * @param runId The ID of the agent run to continue
 * @param investmentData Array of security information
 * @returns The updated agent run data
 */
export async function continueAgentRunWithInvestmentData(
  runId: string, 
  investmentData: SecurityInfo[]
): Promise<AgentRunResponse | null> {
  try {
    const url = `https://api.toolhouse.ai/v1/agent-runs/${runId}`;
    const headers = {
      'Authorization': `Bearer ${process.env.TOOLHOUSE_API_KEY}`,
      'Content-Type': 'application/json',
    };

    // Format the investment data into a readable message
    let message = "Here's my investment portfolio data:\n\n";
    investmentData.forEach((security, index) => {
      message += `${index + 1}. ${security.security_name} (${security.ticker_symbol || 'No ticker'}) - Type: ${security.security_type}\n`;
    });
    
    message += "\n\nPlease analyze this data and provide insights on my portfolio composition, potential risks, and any recommendations for diversification or rebalancing.";

    const body = JSON.stringify({
      'message': message
    });

    const response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: body,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Successfully sent investment data to Agent Run:', data);
      return data;
    } else {
      console.error('Failed to continue Agent Run:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return null;
    }
  } catch (error) {
    console.error('An error occurred continuing agent run:', error);
    return null;
  }
}

/**
 * Extract relevant security information from investment holdings
 * @param holdings Array of investment holdings
 * @returns Simplified array of security information
 */
export function extractInvestmentData(holdings: any[]): SecurityInfo[] {
  return holdings.map(holding => ({
    security_name: holding.security_name || 'Unknown',
    security_type: holding.security_type || 'Unknown',
    ticker_symbol: holding.ticker_symbol || null
  }));
}

/**
 * Check the status of an agent run
 * @param runId The ID of the agent run to check
 * @returns The current agent run data
 */
export async function checkAgentRunStatus(runId: string): Promise<AgentRunResponse | null> {
  try {
    const url = `https://api.toolhouse.ai/v1/agent-runs/${runId}`;
    const headers = {
      'Authorization': `Bearer ${process.env.TOOLHOUSE_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Failed to check Agent Run status:', response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('An error occurred checking agent run status:', error);
    return null;
  }
} 