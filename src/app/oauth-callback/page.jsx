'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// This component uses the useSearchParams hook
function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Processing your bank connection...');
  
  useEffect(() => {
    // Get OAuth state and public_token from URL
    const oauthState = searchParams.get('oauth_state_id');
    const publicToken = searchParams.get('public_token');
    
    async function handleOAuthRedirect() {
      try {
        // Check if we have the necessary parameters
        if (!oauthState || !publicToken) {
          setStatus('Missing OAuth parameters. Redirecting back to dashboard...');
          setTimeout(() => router.push('/dashboard'), 2000);
          return;
        }
        
        setStatus('Completing bank connection...');
        
        // Call your API endpoint to exchange the public token
        const response = await fetch('/api/exchange-public-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            public_token: publicToken,
            oauth_state_id: oauthState
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to exchange token');
        }
        
        const data = await response.json();
        
        setStatus('Successfully connected! Redirecting to dashboard...');
        setTimeout(() => router.push('/dashboard'), 1500);
      } catch (error) {
        console.error('Error in OAuth callback:', error);
        setStatus('Error connecting your account. Please try again.');
        setTimeout(() => router.push('/'), 2000);
      }
    }
    
    handleOAuthRedirect();
  }, [searchParams, router]);
  
  return (
    <div className="max-w-md w-full p-6 text-center">
      <div className="mb-8">
        <div className="mx-auto w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 border-l-blue-500 border-r-blue-700 rounded-full animate-spin"></div>
      </div>
      <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
        {status}
      </h1>
      <p className="text-gray-500 dark:text-gray-400">
        Please don't close this window.
      </p>
    </div>
  );
}

// Loading fallback for suspense
function LoadingFallback() {
  return (
    <div className="max-w-md w-full p-6 text-center">
      <div className="mb-8">
        <div className="mx-auto w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 border-l-blue-500 border-r-blue-700 rounded-full animate-spin"></div>
      </div>
      <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
        Loading...
      </h1>
    </div>
  );
}

// Main component that wraps the content in Suspense
export default function OAuthCallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
      <Suspense fallback={<LoadingFallback />}>
        <OAuthCallbackContent />
      </Suspense>
    </div>
  );
} 