import React, { useState } from 'react';
import { DailyMetric } from '../types';
import { PlusCircle, Smile, Frown, Meh } from 'lucide-react';

interface MetricLoggerProps {
  onLog: (metric: DailyMetric) => void;
}

export const MetricLogger: React.FC<MetricLoggerProps> = ({ onLog }) => {
  const [metric, setMetric] = useState<Partial<DailyMetric>>({
    steps: 0,
    heartRate: 70,
    calories: 0,
    sleepHours: 7,
    waterLiters: 1.5,
    weight: 70,
    mood: 'neutral',
    symptoms: []
  });

  const [symptomInput, setSymptomInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMetric: DailyMetric = {
      ...metric as DailyMetric,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      symptoms: metric.symptoms || []
    };
    onLog(newMetric);
    // Reset form mostly, keep weight as it usually stays similar
    setMetric(prev => ({
        ...prev,
        steps: 0,
        heartRate: 70,
        calories: 0,
        symptoms: [],
        mood: 'neutral'
    }));
    setSymptomInput('');
    alert("Daily metrics logged successfully!");
  };

  const addSymptom = () => {
    if (symptomInput.trim()) {
      setMetric(prev => ({
        ...prev,
        symptoms: [...(prev.symptoms || []), symptomInput.trim()]
      }));
      setSymptomInput('');
    }
  };

  const moods = ['happy', 'neutral', 'sad', 'stressed', 'angry'];

  return (
    <div className="max-w-3xl mx-auto bg-card rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
      <div className="bg-slate-900/50 p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold text-white">Log Today's Metrics</h2>
        <p className="text-slate-400">Consistency is key to accurate AI insights.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Physical Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">Steps</label>
            <input 
              type="number" 
              required
              min="0"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none"
              value={metric.steps}
              onChange={e => setMetric({...metric, steps: parseInt(e.target.value)})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-rose-500">Heart Rate (bpm)</label>
            <input 
              type="number" 
              required
              min="30" max="220"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-rose-500 outline-none"
              value={metric.heartRate}
              onChange={e => setMetric({...metric, heartRate: parseInt(e.target.value)})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-orange-400">Calories Consumed</label>
            <input 
              type="number" 
              required
              min="0"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-400 outline-none"
              value={metric.calories}
              onChange={e => setMetric({...metric, calories: parseInt(e.target.value)})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-indigo-400">Sleep (Hours)</label>
            <input 
              type="number" 
              required
              min="0" max="24" step="0.5"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none"
              value={metric.sleepHours}
              onChange={e => setMetric({...metric, sleepHours: parseFloat(e.target.value)})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-400">Water (Liters)</label>
            <input 
              type="number" 
              required
              min="0" max="10" step="0.1"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
              value={metric.waterLiters}
              onChange={e => setMetric({...metric, waterLiters: parseFloat(e.target.value)})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-400">Weight (kg)</label>
            <input 
              type="number" 
              required
              min="20" max="300" step="0.1"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-400 outline-none"
              value={metric.weight}
              onChange={e => setMetric({...metric, weight: parseFloat(e.target.value)})}
            />
          </div>
        </div>

        {/* Mood Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">How are you feeling?</label>
          <div className="flex flex-wrap gap-3">
            {moods.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMetric({...metric, mood: m})}
                className={`px-4 py-2 rounded-full capitalize text-sm font-medium transition-colors
                  ${metric.mood === m 
                    ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Symptoms (Optional)</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. Headache, Nausea"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-primary"
              value={symptomInput}
              onChange={e => setSymptomInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSymptom())}
            />
            <button 
              type="button" 
              onClick={addSymptom}
              className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg transition-colors"
            >
              <PlusCircle size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {metric.symptoms?.map((s, idx) => (
              <span key={idx} className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs border border-red-500/30 flex items-center gap-1">
                {s}
                <button 
                  type="button" 
                  onClick={() => setMetric(prev => ({...prev, symptoms: prev.symptoms?.filter((_, i) => i !== idx)}))}
                  className="hover:text-white"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.99]"
        >
          Log Daily Metrics
        </button>
      </form>
    </div>
  );
};
