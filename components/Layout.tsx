import React from 'react';
import { Activity, Heart, User, Utensils, Zap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
    { id: 'logger', label: 'Log Data', icon: <Zap size={20} /> },
    { id: 'coach', label: 'AI Coach', icon: <Heart size={20} /> },
    { id: 'nutrition', label: 'Smart Food', icon: <Utensils size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-dark text-slate-200 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-card p-4 flex items-center justify-between border-b border-slate-700 sticky top-0 z-50">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          BioSync AI
        </h1>
      </div>

      {/* Sidebar Navigation (Desktop) / Bottom Nav (Mobile) */}
      <nav className="fixed bottom-0 w-full md:w-64 md:relative md:h-screen bg-card border-t md:border-t-0 md:border-r border-slate-700 z-40">
        <div className="hidden md:flex items-center justify-center p-8">
           <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            BioSync AI
          </h1>
        </div>
        
        <div className="flex md:flex-col justify-around md:justify-start md:px-4 md:gap-2 h-16 md:h-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col md:flex-row items-center md:gap-3 p-2 md:px-4 md:py-3 rounded-xl transition-all w-full
                ${activeTab === item.id 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
            >
              {item.icon}
              <span className="text-xs md:text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto mb-16 md:mb-0 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};
