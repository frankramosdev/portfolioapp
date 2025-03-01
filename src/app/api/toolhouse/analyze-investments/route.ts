import { NextRequest, NextResponse } from 'next/server';
import { createInvestmentAgentRun, continueAgentRunWithInvestmentData, extractInvestmentData } from '@/utils/toolhouse';

export async function POST(request: NextRequest) {
  try {
    // Get the data from the request
    const { holdings, chatId } = await request.json();
    
    if (!holdings || !Array.isArray(holdings) || holdings.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or missing holdings data' },
        { status: 400 }
      );
    }
    
    if (!chatId) {
      return NextResponse.json(
        { error: 'Missing Toolhouse chat ID' },
        { status: 400 }
      );
    }
    
    // Check if Toolhouse API key is configured
    if (!process.env.TOOLHOUSE_API_KEY) {
      return NextResponse.json(
        { error: 'Toolhouse API key not configured' },
        { status: 500 }
      );
    }
    
    // Step 1: Create a new agent run
    const agentRun = await createInvestmentAgentRun(chatId);
    
    if (!agentRun || !agentRun.data || !agentRun.data.id) {
      return NextResponse.json(
        { error: 'Failed to create Toolhouse agent run' },
        { status: 500 }
      );
    }
    
    // Step 2: Extract the relevant investment data
    const investmentData = extractInvestmentData(holdings);
    
    // Step 3: Continue the agent run with the investment data
    const continuedRun = await continueAgentRunWithInvestmentData(
      agentRun.data.id,
      investmentData
    );
    
    if (!continuedRun) {
      return NextResponse.json(
        { error: 'Failed to send investment data to Toolhouse' },
        { status: 500 }
      );
    }
    
    // Return the agent run information
    return NextResponse.json({
      success: true,
      message: 'Investment analysis in progress',
      agentRunId: agentRun.data.id,
      status: continuedRun.data.status
    });
    
  } catch (error) {
    console.error('Error in Toolhouse investment analysis:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze investment data',
        message: (error as Error).message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// API route to check the status of an agent run
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const runId = searchParams.get('runId');
    
    if (!runId) {
      return NextResponse.json(
        { error: 'Missing agent run ID' },
        { status: 400 }
      );
    }
    
    // Import the check function
    const { checkAgentRunStatus } = await import('@/utils/toolhouse');
    
    const status = await checkAgentRunStatus(runId);
    
    if (!status) {
      return NextResponse.json(
        { error: 'Failed to check agent run status' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      agentRunId: runId,
      status: status.data.status,
      results: status.data.results || []
    });
    
  } catch (error) {
    console.error('Error checking agent run status:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to check agent run status',
        message: (error as Error).message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 