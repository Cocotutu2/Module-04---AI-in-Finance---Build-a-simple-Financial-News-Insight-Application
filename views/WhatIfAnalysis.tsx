import React, { useState } from 'react';

const BeakerIcon = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 5.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75Zm0 13.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75Zm-4.5-5.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75Zm-2.25-3.75a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m-4.5-10.5v5.25a2.25 2.25 0 0 0 2.25 2.25h4.5a2.25 2.25 0 0 0 2.25-2.25V9" />
    </svg>
);

type Scenario = 'interest' | 'correction' | 'rally';
type Results = {
    impactValue: number;
    impactPercent: number;
    best: { symbol: string, change: number };
    worst: { symbol: string, change: number };
} | null;

const WhatIfAnalysis: React.FC = () => {
    const [scenario, setScenario] = useState<Scenario>('interest');
    const [rateChange, setRateChange] = useState(0.5);
    const [marketChange, setMarketChange] = useState(-15);
    const [results, setResults] = useState<Results>(null);
    const [isLoading, setIsLoading] = useState(false);

    const runSimulation = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResults(null);
        setTimeout(() => {
            // Mock API call and result generation
            const baseImpact = -147425 * (marketChange / 100);
            setResults({
                impactValue: baseImpact + (Math.random() - 0.5) * 5000,
                impactPercent: marketChange + (Math.random() - 0.5) * 2,
                best: { symbol: 'FINC', change: 1.2 },
                worst: { symbol: 'TGI', change: marketChange * 1.5 / 100 * 215.50 },
            });
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Scenario Builder */}
            <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Build Your Scenario</h2>
                <form onSubmit={runSimulation} className="space-y-6">
                    <div>
                        <label htmlFor="scenario" className="block text-sm font-medium text-slate-700 mb-1">Select Market Event</label>
                        <select
                            id="scenario"
                            value={scenario}
                            onChange={(e) => setScenario(e.target.value as Scenario)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="interest">Interest Rate Change</option>
                            <option value="correction">Market Correction</option>
                            <option value="rally">Tech Sector Rally</option>
                        </select>
                    </div>

                    {scenario === 'interest' && (
                        <div>
                            <label htmlFor="rate" className="block text-sm font-medium text-slate-700">Fed Interest Rate Change (%)</label>
                            <input id="rate" type="number" step="0.25" value={rateChange} onChange={e => setRateChange(parseFloat(e.target.value))} className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md" />
                        </div>
                    )}
                    {scenario === 'correction' && (
                        <div>
                            <label htmlFor="market-drop" className="block text-sm font-medium text-slate-700">S&P 500 Change (%)</label>
                            <input id="market-drop" type="number" step="1" value={marketChange} onChange={e => setMarketChange(parseFloat(e.target.value))} className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md" />
                        </div>
                    )}
                    {scenario === 'rally' && (
                        <div>
                            <label htmlFor="rally-gain" className="block text-sm font-medium text-slate-700">NASDAQ 100 Change (%)</label>
                            <input id="rally-gain" type="number" step="1" value={marketChange > 0 ? marketChange : 10} onChange={e => setMarketChange(parseFloat(e.target.value))} className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md" />
                        </div>
                    )}

                    <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400">
                        {isLoading ? 'Simulating...' : 'Run Simulation'}
                    </button>
                </form>
            </div>

            {/* Results */}
            <div className="bg-white p-6 rounded-lg shadow border border-slate-200 min-h-[300px] flex flex-col justify-center">
                <h2 className="text-xl font-bold text-slate-800 mb-4 text-center">Projected Impact</h2>
                {isLoading && <div className="flex justify-center items-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}
                
                {!isLoading && !results && (
                    <div className="text-center text-slate-500">
                        <BeakerIcon className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                        <p>Run a simulation to see the potential effects on your portfolio.</p>
                    </div>
                )}

                {!isLoading && results && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="text-center">
                            <p className="text-sm text-slate-500">Projected Portfolio Change</p>
                            <p className={`text-4xl font-bold ${results.impactValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {results.impactValue >= 0 ? '+' : '-'}${Math.abs(results.impactValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className={`text-lg font-semibold ${results.impactValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>({results.impactPercent.toFixed(2)}%)</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-green-50 p-3 rounded-md">
                                <h4 className="font-semibold text-green-800">Best Performer</h4>
                                <p className="text-green-700">{results.best.symbol}: <span className="font-mono">+{results.best.change.toFixed(2)}%</span></p>
                            </div>
                            <div className="bg-red-50 p-3 rounded-md">
                                <h4 className="font-semibold text-red-800">Worst Performer</h4>
                                <p className="text-red-700">{results.worst.symbol}: <span className="font-mono">{results.worst.change.toFixed(2)}%</span></p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WhatIfAnalysis;
