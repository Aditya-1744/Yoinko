"use client";

import { useEffect, useState } from 'react';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { database } from '@/app/lib/firebase';
import { useAuth } from '@/app/context/AuthContext';

interface HistoryItem {
  id: string;
  text: string;
  analysis: string;
  timestamp: number;
}

export default function AnalysisHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    // Use a more specific path to ensure data persistence
    const historyRef = query(
      ref(database, `users/${user.uid}/history`),
      orderByChild('timestamp'),
      limitToLast(20) // Increased limit to show more history items
    );
    
    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          text: value.text,
          analysis: value.analysis,
          timestamp: value.timestamp
        }));
        
        // Sort by timestamp (newest first)
        setHistory(items.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setHistory([]);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [user]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (history.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-black mb-4">Analysis History</h2>
        <p className="text-black text-center py-4">No analysis history found. Try analyzing some content!</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-black mb-4">Analysis History</h2>
      
      <div className="space-y-4 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2">
        {history.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-md p-4 bg-white">
            <p className="text-sm text-gray-500 mb-2">
              {new Date(item.timestamp).toLocaleString()}
            </p>
            <p className="text-black mb-2 font-medium">{item.text}</p>
            <div className="bg-gray-50 p-3 rounded text-sm text-black whitespace-pre-line">
              {item.analysis}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
