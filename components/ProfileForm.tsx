import React, { useState } from 'react';
import { UserProfile, FamilyHistory, Gender } from '../types';
import { Save, AlertTriangle } from 'lucide-react';

interface ProfileFormProps {
  profile: UserProfile;
  onSave: (p: UserProfile) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);

  const diseaseList: (keyof FamilyHistory)[] = [
    'heartDisease', 'diabetes', 'hypertension', 'cancer', 'asthma', 
    'obesity', 'stroke', 'alzheimer', 'osteoporosis', 'kidneyDisease'
  ];

  const handleToggle = (disease: keyof FamilyHistory) => {
    setFormData(prev => ({
      ...prev,
      familyHistory: {
        ...prev.familyHistory,
        [disease]: !prev.familyHistory[disease]
      }
    }));
  };

  const calculateBMI = () => {
    if (formData.height <= 0) return 0;
    // Assuming a default weight of 70kg for visualization if not yet tracked, 
    // but here we just return the height for context.
    return formData.height;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card rounded-2xl p-6 border border-slate-700 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
          <span className="w-2 h-8 bg-primary rounded-full"></span>
          Personal Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Age</label>
            <input
              type="number"
              value={formData.age}
              onChange={e => setFormData({...formData, age: parseInt(e.target.value) || 0})}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Height (meters)</label>
            <input
              type="number"
              step="0.01"
              value={formData.height}
              onChange={e => setFormData({...formData, height: parseFloat(e.target.value) || 0})}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Gender</label>
            <select
              value={formData.gender}
              onChange={e => setFormData({...formData, gender: e.target.value as Gender})}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none text-slate-200"
            >
              {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-2">
             <label className="text-sm text-slate-400">Existing Chronic Conditions</label>
             <input
              type="text"
              placeholder="e.g. Migraines, Arthritis (comma separated)"
              value={formData.chronicDiseases}
              onChange={e => setFormData({...formData, chronicDiseases: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none"
            />
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-slate-700 shadow-lg">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-8 bg-secondary rounded-full"></span>
            Family Medical History
            </h2>
            <div className="flex items-center text-amber-400 text-sm gap-1 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                <AlertTriangle size={14} />
                <span>Impacts AI Advice</span>
            </div>
        </div>
        
        <p className="text-slate-400 mb-6">Select conditions present in your immediate family. BioSync AI uses this to calculate health risks.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {diseaseList.map(disease => (
            <button
              key={disease}
              onClick={() => handleToggle(disease)}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center
                ${formData.familyHistory[disease] 
                  ? 'bg-secondary/20 border-secondary text-secondary shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                  : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'}`}
            >
              <span className={`w-3 h-3 rounded-full ${formData.familyHistory[disease] ? 'bg-secondary' : 'bg-slate-700'}`}></span>
              <span className="capitalize font-medium">{disease.replace(/([A-Z])/g, ' $1').trim()}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onSave(formData)}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform active:scale-95"
        >
          <Save size={20} />
          Save Profile
        </button>
      </div>
    </div>
  );
};
