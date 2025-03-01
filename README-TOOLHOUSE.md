# Toolhouse Investment Analysis Integration

This integration allows your portfolio app to use Toolhouse AI to analyze investment holdings and provide insights.

## Features

- AI-powered analysis of your investment holdings
- Uses the specified Toolhouse Agent Run with chat ID: `6a9fafd6-48d0-42d5-bf70-770169c5f46f`
- Extracts `security_name`, `security_type`, and `ticker_symbol` from your holdings
- Real-time status updates of the analysis
- View results directly in the dashboard

## How It Works

1. **Dashboard Integration**: The Investment Analysis component is displayed in the dashboard when investment data is available.
2. **Data Flow**:
   - The component extracts holding data from your Plaid-connected investment accounts
   - When you click "Analyze My Portfolio", it:
     - Creates a new Toolhouse Agent Run
     - Sends your investment data to the agent
     - Polls for status updates until complete
     - Displays the results directly in the dashboard
3. **Technical Components**:
   - `src/utils/toolhouse.ts`: Utility functions for Toolhouse API integration
   - `src/app/api/toolhouse/analyze-investments/route.ts`: API endpoint for creating and checking agent runs
   - `src/app/components/InvestmentAnalysis.tsx`: UI component for analysis
   - UI components in `src/app/components/ui/`

## Configuration

The integration uses the following environment variables:

- `TOOLHOUSE_API_KEY`: Your Toolhouse API key (already set in .env.local)
- `OPENAI_API_KEY`: Your OpenAI API key (already set in .env.local)
  
## Customization

To customize the analysis:

1. **Change the Agent**: Replace the default chat ID with your own Toolhouse chat ID:
   - Update in `src/app/components/InvestmentAnalysis.tsx`
   - Or pass a different chatId prop when using the component

2. **Modify Data Format**: Adjust how investment data is formatted by editing:
   - `src/utils/toolhouse.ts` - The `continueAgentRunWithInvestmentData` function
   
3. **Enhance UI**: The component uses basic UI elements that you can enhance:
   - Add additional UI to display more detailed analysis
   - Modify the loading states or error handling

## Adding to Other Pages

You can use the InvestmentAnalysis component on any page:

```jsx
import InvestmentAnalysis from '@/app/components/InvestmentAnalysis';

// Then in your component:
<InvestmentAnalysis 
  holdings={yourHoldingsArray} 
  chatId="your-custom-chat-id" // Optional
/>
``` 