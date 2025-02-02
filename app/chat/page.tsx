"use client"

import { useState } from 'react';

export default function ChatComponent() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      const data = await res.json();
      setResponse(data.reply);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4 h-32 resize-none text-slate-500"
            placeholder="Type your message here..."
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        {response && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-2 text-slate-500">Response:</h2>
            <p className="whitespace-pre-wrap text-slate-500">{response}</p>
          </div>

        )}
      </div>
    </div>
  );
}