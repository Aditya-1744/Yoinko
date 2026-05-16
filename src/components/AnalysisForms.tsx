"use client";

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

interface AnalysisFormProps {
  onAnalysisComplete: (text: string, analysis: string) => void;
}

export default function AnalysisForm({ onAnalysisComplete }: AnalysisFormProps) {
  const [text, setText] = useState(''); // For analysis input
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text,  // Using text state instead of undefined email
          userId: user?.uid 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze text');
      }
      
      const data = await response.json();
      onAnalysisComplete(text, data.analysis);
      setText('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl  text-black font-semibold mb-4">Analyze Social Media Content</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="content" 
            className="block text-black font-medium mb-2"
          >
            Enter text to analyze
          </label>
          <textarea
            id="content"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 border text-black border-black-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Type or paste content to analyze..."
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition"
        >
          {loading ? 'Analyzing...' : 'Analyze Sentiment'}
        </button>
      </form>
    </div>
  );
}
