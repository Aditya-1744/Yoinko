"use client";

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoutes';
import AnalysisForm from '@/components/AnalysisForms';
import AnalysisResult from '@/components/AnalysisResult';
import AnalysisHistory from '@/components/AnalysisHistory';

export default function DashboardPage() {
  const [currentAnalysis, setCurrentAnalysis] = useState<{
    text: string;
    analysis: string;
  } | null>(null);

  const handleAnalysisComplete = (text: string, analysis: string) => {
    setCurrentAnalysis({ text, analysis });
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Sidebar with analysis history on the left */}
        <aside className="w-1/4 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto bg-white rounded-lg shadow-md p-4">
          <AnalysisHistory />
        </aside>

        {/* Main content area with form and result */}
        <main className="flex-1">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          <AnalysisForm onAnalysisComplete={handleAnalysisComplete} />

          {currentAnalysis && (
            <div className="mt-6">
              <AnalysisResult 
                text={currentAnalysis.text} 
                analysis={currentAnalysis.analysis} 
              />
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
