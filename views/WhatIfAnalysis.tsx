import React, { useState } from 'react';
import { getHoldings } from '../services/portfolioService';
import { runWhatIfAnalysis } from '../services/geminiService';

const WhatIfIcon = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

type Scenario = {
    id: string;
    label: string;
    paramLabel: string;
    paramDefault: number;
    paramStep: number;
};

const scenarios: Scenario[] = [
    { id: 'interest', label: 'Interest Rate Change', paramLabel: 'Fed Interest Rate Change (%)', paramDefault: 0.5, paramStep: 0.25 },
    { id: 'correction', label: 'Market Correction', paramLabel: 'S&P 500 Change (%)', paramDefault: -15, paramStep: 1 },
    { id: 'rally', label: 'Tech Sector Rally', paramLabel: 'NASDAQ 100 Change (%)', paramDefault: 10, paramStep: 1 },
];

type Results = {
    impactValue: number;
    impactPercent: number;
    best: { symbol: string, change: number };
    worst: { symbol: string, change: number };
} | null;

const WhatIfAnalysis: React.FC = () => {
    const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0].id);
    const [paramValue, setParamValue] = useState<number>(scenarios[0].paramDefault);
    const [results, setResults] = useState<Results>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const selectedScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

    const runSimulation = async (e: React.FormEvent) => {
        e.preventDefault();
        const holdings = getHoldings();
        if (holdings.length === 0) {
            setError("Your portfolio is empty. Please add assets in the Portfolio tab to run a simulation.");
            return;
        }
        
        setIsLoading(true);
        setResults(null);
        setError(null);

        try {
            const scenarioText = `${selectedScenario.label} with a ${paramValue}% change in ${selectedScenario.paramLabel.split('(')[0]}`;
            const apiResults = await runWhatIfAnalysis(holdings, scenarioText);
            setResults(apiResults);
        } catch (err) {
            console.error("Simulation failed:", err);
            setError("The AI simulation failed. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newScenario = scenarios.find(s => s.id === e.target.value);
        if (newScenario) {
            setSelectedScenarioId(newScenario.id);
            setParamValue(newScenario.paramDefault);
        }
    }

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
                            value={selectedScenarioId}
                            onChange={handleScenarioChange}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            {scenarios.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="param" className="block text-sm font-medium text-slate-700">{selectedScenario.paramLabel}</label>
                        <input id="param" type="number" step={selectedScenario.paramStep} value={paramValue} onChange={e => setParamValue(parseFloat(e.target.value))} className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md" />
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400">
                        {isLoading ? 'Simulating with AI...' : 'Run AI Simulation'}
                    </button>
                </form>
            </div>

            {/* Results */}
            <div className="bg-white p-6 rounded-lg shadow border border-slate-200 min-h-[300px] flex flex-col justify-center">
                <h2 className="text-xl font-bold text-slate-800 mb-4 text-center">Projected Impact</h2>
                {isLoading && <div className="flex justify-center items-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}
                
                {!isLoading && !results && !error && (
                    <div className="text-center text-slate-500">
                        <WhatIfIcon className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                        <p>Run a simulation to see the potential effects on your portfolio.</p>
                    </div>
                )}
                
                {error && <p className="text-center text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}

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
                                <p className="text-green-700">{results.best.symbol}: <span className="font-mono">{results.best.change >= 0 ? '+': ''}{results.best.change.toFixed(2)}%</span></p>
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