import { NextResponse } from 'next/server';
import { getToolsAndExecute } from '@/utils/toolhouse';

export async function POST(request: Request) {
  try {
    // Parse the JSON request body
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Get response from Toolhouse
    const response = await getToolsAndExecute(query);

    // Return the response
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in Toolhouse API:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
} 