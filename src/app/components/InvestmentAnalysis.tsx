import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

// Default Toolhouse chat ID for investment analysis
const DEFAULT_CHAT_ID = '6a9fafd6-48d0-42d5-bf70-770169c5f46f';

interface InvestmentAnalysisProps {
  holdings: any[]; // Your holdings data
  chatId?: string; // Optional custom chat ID
}

export default function InvestmentAnalysis({ 
  holdings, 
  chatId = DEFAULT_CHAT_ID 
}: InvestmentAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentRunId, setAgentRunId] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  // Function to trigger the investment analysis
  async function analyzeInvestments() {
    try {
      setLoading(true);
      setError(null);
      setStatusMessage('Starting investment analysis...');
      
      const response = await fetch('/api/toolhouse/analyze-investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          holdings,
          chatId,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze investments');
      }
      
      setAgentRunId(data.agentRunId);
      setAnalyzing(true);
      setStatusMessage('Analysis in progress...');
      
    } catch (err) {
      setError((err as Error).message || 'An error occurred');
      console.error('Error analyzing investments:', err);
    } finally {
      setLoading(false);
    }
  }
  
  // Check the status of the agent run
  useEffect(() => {
    if (!agentRunId || !analyzing) return;
    
    const checkInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/toolhouse/analyze-investments?runId=${agentRunId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to check analysis status');
        }
        
        // Update status message based on agent run status
        if (data.status === 'completed') {
          setAnalyzing(false);
          setStatusMessage('Analysis completed!');
          setAnalysisResults(data.results);
          clearInterval(checkInterval);
        } else if (data.status === 'failed') {
          setAnalyzing(false);
          setError('Analysis failed. Please try again.');
          clearInterval(checkInterval);
        } else {
          setStatusMessage(`Analysis in progress (${data.status})...`);
        }
        
      } catch (err) {
        console.error('Error checking analysis status:', err);
      }
    }, 3000); // Check every 3 seconds
    
    return () => clearInterval(checkInterval);
  }, [agentRunId, analyzing]);
  
  // Render the component
  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Investment Portfolio Analysis
        </CardTitle>
        <CardDescription>
          Use AI to analyze your investment portfolio and get personalized insights
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
            ⚠️ <span>{error}</span>
          </div>
        )}
        
        {!analyzing && !analysisResults && (
          <Button 
            onClick={analyzeInvestments} 
            disabled={loading || !holdings || holdings.length === 0}
            className="w-full"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Starting Analysis...
              </>
            ) : (
              'Analyze My Portfolio'
            )}
          </Button>
        )}
        
        {(analyzing || statusMessage) && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 mb-4">
            {analyzing && <span className="animate-spin mr-2 inline-block">⟳</span>}
            <span>{statusMessage}</span>
          </div>
        )}
        
        {analysisResults && (
          <div className="mt-4 border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Analysis Results</h3>
            
            {/* Display the analysis results */}
            {analysisResults.map((result: any, index: number) => (
              <div key={index} className="mb-4">
                {result.content && (
                  <div dangerouslySetInnerHTML={{ __html: result.content.replace(/\n/g, '<br/>') }} />
                )}
              </div>
            ))}
            
            {/* Button to view detailed results */}
            <div className="mt-4">
              <a 
                href={`https://app.toolhouse.ai/agent-runs/${agentRunId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View detailed analysis in Toolhouse →
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 