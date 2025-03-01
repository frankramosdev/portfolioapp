# portfolioapp
Portfolio App

A Next.js application for managing and tracking your investments using Plaid's API.

## Features

- Connect bank accounts and investment portfolios via Plaid
- View account balances and transactions
- Track investment holdings and transactions
- View 401k and IRA investments
- Send messages with LoopMessage integration

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your environment variables in `.env.local`:
   - Plaid API credentials
   - LoopMessage API keys
4. Run the development server: `npm run dev`

## LoopMessage Integration

This project includes integration with LoopMessage for sending messages to users. LoopMessage provides a simple API for sending SMS and media messages.

### Setting Up LoopMessage

1. Make sure you have the LoopMessage API keys in your `.env.local` file:
   ```
   LOOPMESSAGE_AUTH_KEY=your-auth-key
   LOOPMESSAGE_SECRET_KEY=your-secret-key
   ```

2. The LoopMessage form component is integrated into the homepage, allowing you to send messages to your users.

### Testing LoopMessage

You can test the LoopMessage integration by visiting `/api/loopmessage/test`, which will check if your LoopMessage API keys are working correctly.

## Plaid Integration

This application uses Plaid to securely connect to users' financial accounts, including:

- Bank accounts
- Investment accounts
- Retirement accounts (401k, IRA)

## Tech Stack

- Next.js
- TypeScript
- Plaid API
- LoopMessage API
- Tailwind CSS

### [Austin AI Community Hackathon](https://lu.ma/atx-ai-hackathon) -  Hosted by AITX & webAI