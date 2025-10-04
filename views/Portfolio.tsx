import React, { useState, useEffect } from 'react';
import type { Holding } from '../types';
import { getHoldings, addHolding, removeHolding } from '../services/portfolioService';
import { getStockInfo } from '../services/geminiService';

const AddIcon = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const TrashIcon = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.718c-1.123 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

const CHART_COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#6b7280'];

const PortfolioChart: React.FC<{holdings: Holding[]}> = ({ holdings }) => {
    const totalValue = holdings.reduce((acc, h) => acc + h.value, 0);
    if (totalValue === 0) return null;

    let accumulated_percent = 0;
    const segments = holdings.map((h, i) => {
        const percent = (h.value / totalValue) * 100;
        const segment = {
            percent,
            color: CHART_COLORS[i % CHART_COLORS.length],
            symbol: h.symbol,
            offset: accumulated_percent,
        };
        accumulated_percent += percent;
        return segment;
    });

    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="relative w-48 h-48">
                <svg viewBox="0 0 140 140" className="transform -rotate-90">
                    {segments.map(s => (
                        <circle
                            key={s.symbol}
                            r={radius}
                            cx="70"
                            cy="70"
                            fill="transparent"
                            stroke={s.color}
                            strokeWidth="20"
                            strokeDasharray={`${(s.percent / 100) * circumference} ${circumference}`}
                            strokeDashoffset={-(s.offset / 100) * circumference}
                        />
                    ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs text-slate-500">Total Value</span>
                    <span className="text-xl font-bold text-slate-800">${totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
            </div>
            <div className="text-sm">
                <ul className="space-y-2">
                    {segments.map(s => (
                        <li key={s.symbol} className="flex items-center">
                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: s.color }}></span>
                            <span className="font-semibold text-slate-700">{s.symbol}</span>
                            <span className="ml-auto text-slate-500">{s.percent.toFixed(2)}%</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

const AddAssetModal: React.FC<{onClose: () => void, onAdd: (holding: Holding) => void}> = ({ onClose, onAdd }) => {
    const [ticker, setTicker] = useState('');
    const [shares, setShares] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticker.trim() || !shares || parseFloat(shares) <= 0) {
            setError('Please enter a valid ticker and number of shares.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const stockInfo = await getStockInfo(ticker.trim().toUpperCase());
            const newHolding: Holding = {
                id: `${stockInfo.name}-${Date.now()}`,
                symbol: ticker.trim().toUpperCase(),
                name: stockInfo.name,
                shares: parseFloat(shares),
                price: stockInfo.price,
                dayChange: stockInfo.dayChange,
                value: parseFloat(shares) * stockInfo.price
            };
            onAdd(newHolding);
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to fetch stock data. Please check the ticker and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Add New Asset</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="ticker" className="block text-sm font-medium text-slate-700">Ticker Symbol</label>
                        <input id="ticker" type="text" value={ticker} onChange={e => setTicker(e.target.value)} placeholder="e.g., AAPL" className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="shares" className="block text-sm font-medium text-slate-700">Number of Shares</label>
                        <input id="shares" type="number" step="any" value={shares} onChange={e => setShares(e.target.value)} placeholder="e.g., 10" className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md" />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200">Cancel</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-slate-400 flex items-center">
                            {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                            {isLoading ? 'Adding...' : 'Add Asset'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Portfolio: React.FC = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setHoldings(getHoldings());
  }, []);

  const handleAddHolding = (holding: Holding) => {
    const newHoldings = addHolding(holding);
    setHoldings(newHoldings);
  };

  const handleRemoveHolding = (holdingId: string) => {
    const newHoldings = removeHolding(holdingId);
    setHoldings(newHoldings);
  };

  const totalValue = holdings.reduce((acc, h) => acc + h.value, 0);
  const todaysChange = holdings.reduce((acc, h) => acc + h.shares * h.dayChange, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {isModalOpen && <AddAssetModal onClose={() => setIsModalOpen(false)} onAdd={handleAddHolding} />}
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Portfolio Overview</h2>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                <AddIcon className="w-5 h-5" />
                <span>Add Asset</span>
            </button>
        </div>
        
        {holdings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-700">Your portfolio is empty.</h3>
                <p className="text-slate-500 mt-1">Click "Add Asset" to start tracking your investments.</p>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Asset Allocation</h3>
                        <PortfolioChart holdings={holdings} />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border border-slate-200 flex flex-col justify-center">
                         <h3 className="text-sm font-medium text-slate-500">Portfolio Value</h3>
                        <p className="text-3xl font-bold text-slate-800">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <h3 className="text-sm font-medium text-slate-500 mt-4">Today's Change</h3>
                        <p className={`text-2xl font-semibold ${todaysChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {todaysChange >= 0 ? '+' : '-'}${Math.abs(todaysChange).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
                    <h3 className="text-lg font-semibold text-slate-800 p-4 border-b border-slate-200">My Holdings</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="p-3 font-medium">Asset</th>
                                    <th className="p-3 font-medium">Symbol</th>
                                    <th className="p-3 font-medium text-right">Shares</th>
                                    <th className="p-3 font-medium text-right">Price</th>
                                    <th className="p-3 font-medium text-right">Day Change</th>
                                    <th className="p-3 font-medium text-right">Value</th>
                                    <th className="p-3 font-medium text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holdings.map(h => (
                                    <tr key={h.id} className="border-t border-slate-100">
                                        <td className="p-3 font-semibold text-slate-800">{h.name}</td>
                                        <td className="p-3 text-slate-600">{h.symbol}</td>
                                        <td className="p-3 text-slate-700 text-right">{h.shares}</td>
                                        <td className="p-3 text-slate-700 text-right">${h.price.toFixed(2)}</td>
                                        <td className={`p-3 font-medium text-right ${h.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {h.dayChange >= 0 ? '+' : ''}{h.dayChange.toFixed(2)}
                                        </td>
                                        <td className="p-3 font-semibold text-slate-800 text-right">${h.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                        <td className="p-3 text-center">
                                            <button onClick={() => handleRemoveHolding(h.id)} className="p-1 text-slate-500 hover:text-red-600 rounded-full hover:bg-red-100">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        )}
    </div>
  );
};

export default Portfolio;