import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

// Debug environment variables
console.log('PLAID_ENV:', process.env.PLAID_ENV);
console.log('PLAID_CLIENT_ID:', process.env.PLAID_CLIENT_ID);
console.log('PLAID_SECRET length:', process.env.PLAID_SECRET ? process.env.PLAID_SECRET.length : 0);

// Ensure we have a valid environment, default to sandbox
const plaidEnv = process.env.PLAID_ENV || 'sandbox';
console.log('Using Plaid environment:', plaidEnv);

// Construct the Plaid client
const clientConfig = {
  basePath: PlaidEnvironments[plaidEnv],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
};

console.log('Plaid client config:', {
  basePath: clientConfig.basePath,
  headers: {
    'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
    'PLAID-SECRET': process.env.PLAID_SECRET ? '(secret is set)' : '(secret is missing)',
  }
});

const plaidClient = new PlaidApi(new Configuration(clientConfig));

const sessionOptions = {
  cookieName: 'portfolioapp_session',
  password: 'complex_password_at_least_32_characters_long_for_iron_session',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export { plaidClient, sessionOptions }; 