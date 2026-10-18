'use client';
import React, { useState } from 'react';
import { apiRequest } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface ResearchChatProps {
  context: string;
}

export default function ResearchChat({ context }: ResearchChatProps) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = message;
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const data = await apiRequest('/api/research/chat', {
        method: 'POST',
        body: JSON.stringify({ context, message: userMsg }),
      });
      setChatHistory(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (err: any) {
      toast.error(err.message || 'Failed to get response from AI');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h4 className="mb-3 text-sm font-semibold text-gray-700">Deep Dive Analysis</h4>
      <div className="mb-4 max-h-60 overflow-y-auto space-y-3">
        {chatHistory.map((chat, i) => (
          <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
              chat.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-200'
            }`}>
              {chat.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-white px-3 py-2 text-sm text-gray-500 border border-gray-200 italic">
              AI is thinking...
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a follow-up question..."
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-300"
        >
          Send
        </button>
      </div>
    </div>
  );
}
