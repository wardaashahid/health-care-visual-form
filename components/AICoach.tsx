import React, { useState } from 'react';
import { UserProfile, DailyMetric } from '../types';
import { generateHealthAnalysis } from '../services/geminiService';
import { Sparkles, Loader2, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AICoachProps {
  profile: UserProfile;
  metrics: DailyMetric[];
}

export const AICoach: React.FC<AICoachProps> = ({ profile, metrics }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const latest = metrics[metrics.length - 1];
    const result = await generateHealthAnalysis(profile, latest, metrics);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-2xl border border-primary/20 text-center">
        <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">AI Health Coach</h2>
        <p className="text-slate-400 mb-6">
          BioSync uses Google Gemini to analyze your biometric trends, family history, and current symptoms to provide a holistic daily assessment.
        </p>
        
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-primary/25 transition-all flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
          {loading ? 'Analyzing Vitals...' : 'Generate Daily Insights'}
        </button>
      </div>

      {analysis && (
        <div className="bg-card rounded-2xl p-8 border border-slate-700 shadow-2xl animate-fade-in-up">
          <div className="prose prose-invert max-w-none prose-headings:text-primary prose-strong:text-secondary">
             <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-700 flex items-start gap-3 text-sm text-slate-500">
             <Info className="shrink-0 mt-0.5" size={16} />
             <p>Disclaimer: BioSync AI is a wellness tool and does not provide medical diagnosis. Always consult a professional doctor for serious symptoms.</p>
          </div>
        </div>
      )}
    </div>
  );
};
