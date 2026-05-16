interface AnalysisResultProps {
  text: string;
  analysis: string;
}

export default function AnalysisResult({ text, analysis }: AnalysisResultProps) {
  // Parse the analysis to extract sentiment type
  const getSentimentType = () => {
    const lowerAnalysis = analysis.toLowerCase();
    if (lowerAnalysis.includes('positive')) return 'positive';
    if (lowerAnalysis.includes('negative')) return 'negative';
    if (lowerAnalysis.includes('neutral')) return 'neutral';
    if (lowerAnalysis.includes('mixed')) return 'mixed';
    return 'unknown';
  };
  
  const getSentimentColor = () => {
    const type = getSentimentType();
    switch (type) {
      case 'positive': return 'bg-green-100 border-green-500';
      case 'negative': return 'bg-red-100 border-red-500';
      case 'neutral': return 'bg-gray-100 border-gray-500';
      case 'mixed': return 'bg-yellow-100 border-yellow-500';
      default: return 'bg-blue-100 border-blue-500';
    }
  };
  
  return (
    <div className={`rounded-lg border-l-4 p-6 mb-6 ${getSentimentColor()}`}>
      <h3 className="text-lg font-semibold mb-2">Analysis Result</h3>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-black mb-1">Original Text:</h4>
        <p className="text-gray-800 bg-white p-3 rounded border border-gray-200">{text}</p>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-black mb-1">Sentiment Analysis:</h4>
        <div className="bg-white p-3 rounded border border-gray-200 text-black whitespace-pre-line">
          {analysis}
        </div>
      </div>
    </div>
  );
}
