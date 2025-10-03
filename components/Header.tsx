import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <h1 className="text-2xl font-bold tracking-tight">FinAI</h1>
        <p className="text-sm text-slate-300">Your Personal Financial Text Analyzer</p>
      </div>
    </header>
  );
};

export default Header;
