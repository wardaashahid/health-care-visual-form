import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { MetricLogger } from './components/MetricLogger';
import { ProfileForm } from './components/ProfileForm';
import { AICoach } from './components/AICoach';
import { SmartRecipe } from './components/SmartRecipe';
import { AppState, UserProfile, DailyMetric, Gender } from './types';

// Initial Mock Data
const INITIAL_PROFILE: UserProfile = {
  name: 'Alex Doe',
  age: 28,
  height: 1.75,
  gender: Gender.Male,
  chronicDiseases: '',
  familyHistory: {
    heartDisease: false,
    diabetes: false,
    hypertension: true, // Example default
    cancer: false,
    asthma: false,
    obesity: false,
    stroke: false,
    alzheimer: false,
    osteoporosis: false,
    kidneyDisease: false,
  }
};

const INITIAL_METRICS: DailyMetric[] = [
    { id: '1', date: new Date(Date.now() - 86400000 * 2).toISOString(), steps: 4500, heartRate: 72, calories: 1800, sleepHours: 6.5, waterLiters: 1.2, weight: 70.5, mood: 'stressed', symptoms: ['headache'] },
    { id: '2', date: new Date(Date.now() - 86400000).toISOString(), steps: 8200, heartRate: 68, calories: 2100, sleepHours: 7.5, waterLiters: 2.0, weight: 70.2, mood: 'happy', symptoms: [] },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [metrics, setMetrics] = useState<DailyMetric[]>(INITIAL_METRICS);

  const handleLogMetric = (metric: DailyMetric) => {
    setMetrics(prev => [...prev, metric]);
    setActiveTab('dashboard'); // Redirect to dashboard to see update
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard metrics={metrics} profile={profile} />;
      case 'logger':
        return <MetricLogger onLog={handleLogMetric} />;
      case 'coach':
        return <AICoach profile={profile} metrics={metrics} />;
      case 'nutrition':
        return <SmartRecipe profile={profile} currentWeight={metrics[metrics.length-1]?.weight || 70} />;
      case 'profile':
        return <ProfileForm profile={profile} onSave={(p) => { setProfile(p); alert('Profile Saved'); }} />;
      default:
        return <Dashboard metrics={metrics} profile={profile} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
