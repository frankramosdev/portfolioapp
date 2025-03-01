/**
 * Utility functions for the application
 */

/**
 * Determines the appropriate Plaid redirect URI based on the current environment
 * @param {Request} [request] - Optional Request object to get host information
 * @returns {string} The redirect URI to use for Plaid
 */
export function getPlaidRedirectUri(request) {
  // Check if we're running on Vercel production
  if (process.env.VERCEL_ENV === 'production') {
    return `https://${process.env.VERCEL_URL || 'portfolioapp-beryl.vercel.app'}/oauth-callback`;
  }
  
  // Check if we're running on Vercel preview
  if (process.env.VERCEL_ENV === 'preview') {
    return `https://${process.env.VERCEL_URL || 'your-preview.vercel.app'}/oauth-callback`;
  }
  
  // If we have a request object, try to determine hostname dynamically
  if (request) {
    try {
      const host = request.headers.get('host');
      if (host && !host.includes('localhost')) {
        return `https://${host}/oauth-callback`;
      }
    } catch (error) {
      console.error('Error getting host from request:', error);
    }
  }
  
  // Default to localhost for development
  return process.env.PLAID_SANDBOX_REDIRECT_URI || 'http://localhost:3000/oauth-callback';
}

/**
 * Checks if the application is running on Vercel
 * @returns {boolean} True if running on Vercel, false otherwise
 */
export function isRunningOnVercel() {
  return !!process.env.VERCEL_ENV;
} 