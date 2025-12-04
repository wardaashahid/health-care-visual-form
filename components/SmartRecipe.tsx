import React, { useState } from 'react';
import { UserProfile } from '../types';
import { generateSmartRecipe } from '../services/geminiService';
import { Utensils, ChefHat, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface SmartRecipeProps {
  profile: UserProfile;
  currentWeight: number;
}

export const SmartRecipe: React.FC<SmartRecipeProps> = ({ profile, currentWeight }) => {
  const [preference, setPreference] = useState('');
  const [recipe, setRecipe] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preference) return;
    
    setLoading(true);
    const result = await generateSmartRecipe(profile, currentWeight, preference);
    setRecipe(result);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="space-y-6">
        <div className="bg-card p-6 rounded-2xl border border-slate-700 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-500/20 p-3 rounded-lg text-orange-500">
              <ChefHat size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Smart Kitchen</h2>
          </div>
          <p className="text-slate-400 mb-6">
            Generate recipes tailored to your BMI ({ (currentWeight / (profile.height * profile.height)).toFixed(1) }) 
            and family history risks ({Object.keys(profile.familyHistory).filter(k => (profile.familyHistory as any)[k]).length} detected).
          </p>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">What are you craving?</label>
              <input
                type="text"
                placeholder="e.g. Something spicy with chicken, or a vegan breakfast"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                value={preference}
                onChange={(e) => setPreference(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !preference}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:brightness-110 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Utensils size={20} />}
              {loading ? 'Chef is cooking...' : 'Generate Safe Recipe'}
            </button>
          </form>
        </div>

        {/* Quick Tips */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <h3 className="font-semibold text-white mb-2">Did you know?</h3>
          <p className="text-sm text-slate-400">
            Based on your family history, our AI automatically filters out ingredients that might exacerbate your genetic risks (e.g., high sodium for hypertension).
          </p>
        </div>
      </div>

      <div className="relative">
        {recipe ? (
          <div className="bg-card p-8 rounded-2xl border border-slate-700 shadow-xl h-full overflow-y-auto animate-fade-in custom-scrollbar">
             <div className="prose prose-invert prose-orange max-w-none">
                <ReactMarkdown>{recipe}</ReactMarkdown>
             </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-8 text-center text-slate-600">
            <Utensils size={48} className="mb-4 opacity-50" />
            <p>Your personalized recipe will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
