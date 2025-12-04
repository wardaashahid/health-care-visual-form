import React from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend 
} from 'recharts';
import { DailyMetric, UserProfile } from '../types';
import { TrendingUp, Activity, Droplets, Moon } from 'lucide-react';

interface DashboardProps {
  metrics: DailyMetric[];
  profile: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ metrics, profile }) => {
  const latest = metrics[metrics.length - 1];
  const bmi = latest ? (latest.weight / (profile.height * profile.height)).toFixed(1) : '0';
  
  // Prepare data for charts (formatting dates)
  const data = metrics.map(m => ({
    ...m,
    shortDate: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })).slice(-7); // Last 7 entries

  const getBMIStatus = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
    if (val < 25) return { label: 'Healthy', color: 'text-emerald-400' };
    if (val < 30) return { label: 'Overweight', color: 'text-orange-400' };
    return { label: 'Obese', color: 'text-red-500' };
  };

  const bmiStatus = getBMIStatus(parseFloat(bmi));

  if (metrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="bg-card p-8 rounded-full mb-4">
            <Activity size={48} className="text-primary animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Data Yet</h2>
        <p className="text-slate-400 max-w-md">Head over to the "Log Data" tab to input your first health entry and unlock the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-primary/10 w-24 h-24 rounded-full group-hover:scale-110 transition-transform"></div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">BMI Score</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{bmi}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 ${bmiStatus.color}`}>
              {bmiStatus.label}
            </span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 bg-rose-500/10 w-24 h-24 rounded-full"></div>
           <h3 className="text-slate-400 text-sm font-medium mb-1 flex items-center gap-2"><Activity size={14}/> Heart Rate</h3>
           <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{latest.heartRate}</span>
            <span className="text-xs text-slate-500">bpm</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 bg-indigo-500/10 w-24 h-24 rounded-full"></div>
           <h3 className="text-slate-400 text-sm font-medium mb-1 flex items-center gap-2"><Moon size={14}/> Sleep</h3>
           <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{latest.sleepHours}</span>
            <span className="text-xs text-slate-500">hrs</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 bg-cyan-500/10 w-24 h-24 rounded-full"></div>
           <h3 className="text-slate-400 text-sm font-medium mb-1 flex items-center gap-2"><Droplets size={14}/> Water</h3>
           <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{latest.waterLiters}</span>
            <span className="text-xs text-slate-500">L</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate & Steps Combined */}
        <div className="bg-card p-6 rounded-2xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary"/> Activity & Heart Health
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorHeart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="shortDate" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                />
                <Legend />
                <Area type="monotone" dataKey="heartRate" stroke="#f43f5e" fillOpacity={1} fill="url(#colorHeart)" name="Heart Rate" />
                <Area type="monotone" dataKey="steps" stroke="#0ea5e9" fill="transparent" name="Steps" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calories vs Sleep */}
        <div className="bg-card p-6 rounded-2xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-6">Metabolism & Recovery</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="shortDate" stroke="#94a3b8" fontSize={12} />
                <YAxis yAxisId="left" orientation="left" stroke="#f97316" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#6366f1" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="calories" fill="#f97316" name="Calories" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="sleepHours" fill="#6366f1" name="Sleep (Hrs)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
