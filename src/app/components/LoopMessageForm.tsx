'use client';

import { useState } from 'react';

export default function LoopMessageForm() {
  const [recipients, setRecipients] = useState('');
  const [message, setMessage] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [status, setStatus] = useState<{ success?: boolean; message: string; messageId?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipients.trim() || !message.trim()) {
      setStatus({
        success: false,
        message: 'Recipients and message are required',
      });
      return;
    }
    
    // Split recipients by comma and trim spaces
    const recipientList = recipients.split(',').map(r => r.trim()).filter(Boolean);
    
    setLoading(true);
    setStatus(null);
    
    try {
      const response = await fetch('/api/loopmessage/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: recipientList,
          message,
          mediaUrl: mediaUrl.trim() || undefined,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      setStatus({
        success: true,
        message: data.message,
        messageId: data.messageId,
      });
      
      // Clear form on success
      setMessage('');
      setMediaUrl('');
    } catch (error) {
      setStatus({
        success: false,
        message: (error as Error).message || 'An error occurred while sending the message',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-neutral-900 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Send a Message</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="recipients" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Recipients (comma-separated phone numbers)
          </label>
          <input
            id="recipients"
            type="text"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="+1234567890, +0987654321"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
            required
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here..."
            rows={4}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
            required
          />
        </div>
        
        <div>
          <label htmlFor="mediaUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Media URL (optional)
          </label>
          <input
            id="mediaUrl"
            type="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Provide a URL to an image or video to attach to the message
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading || !recipients.trim() || !message.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      
      {status && (
        <div 
          className={`mt-4 p-3 rounded-md ${
            status.success 
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
          }`}
        >
          <p>{status.message}</p>
          {status.messageId && (
            <p className="mt-1 text-sm">
              Message ID: <span className="font-mono">{status.messageId}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
} 