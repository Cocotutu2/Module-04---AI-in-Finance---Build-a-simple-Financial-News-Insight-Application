import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TextAnalyzer from './views/TextAnalyzer';
import Dashboard from './views/Dashboard';
import Portfolio from './views/Portfolio';
import WhatIfAnalysis from './views/WhatIfAnalysis';
import RiskManagement from './views/RiskManagement';
import Trading from './views/Trading';
import CustomerService from './views/CustomerService';
import ProjectInfo from './views/ProjectInfo';

export type View = 'analyzer' | 'dashboard' | 'portfolio' | 'whatif' | 'risk' | 'trading' | 'customerService' | 'projectInfo';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'analyzer':
        return <TextAnalyzer />;
      case 'dashboard':
        return <Dashboard />;
      case 'portfolio':
        return <Portfolio />;
      case 'whatif':
        return <WhatIfAnalysis />;
      case 'risk':
        return <RiskManagement />;
      case 'trading':
        return <Trading />;
      case 'customerService':
        return <CustomerService />;
      case 'projectInfo':
        return <ProjectInfo />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans antialiased">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeView={activeView} />
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;