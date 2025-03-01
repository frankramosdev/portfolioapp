import { NextResponse } from 'next/server';
import { toolhouse } from '@/utils/toolhouse';

export async function GET() {
  try {
    // Get available tools to test Toolhouse connection
    const tools = await toolhouse.getTools("openai/gpt-4");
    
    // Return success with tools count
    return NextResponse.json({
      success: true,
      toolsCount: tools.length,
      message: 'Toolhouse is set up correctly!'
    });
  } catch (error) {
    console.error('Error testing Toolhouse connection:', error);
    
    // Return error with detailed message
    return NextResponse.json({
      success: false,
      error: (error as Error).message || 'An error occurred while testing Toolhouse connection',
      message: 'Failed to connect to Toolhouse. Please check your API key and try again.'
    }, { status: 500 });
  }
} 