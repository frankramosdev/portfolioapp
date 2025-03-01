import { Toolhouse } from '@toolhouseai/sdk';
import OpenAI from 'openai';

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
      tools: tools as any, // Type assertion to avoid TypeScript errors
    });

    return response;
  } catch (error) {
    console.error('Error using Toolhouse:', error);
    throw error;
  }
} 