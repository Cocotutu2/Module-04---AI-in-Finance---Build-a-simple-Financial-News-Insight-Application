import React from 'react';

const mockHoldings = [
    { symbol: 'TGI', name: 'TechGiant Inc.', shares: 100, price: 215.50, dayChange: 2.75, value: 21550 },
    { symbol: 'AMG', name: 'AutoMakers Group', shares: 250, price: 140.20, dayChange: -1.80, value: 35050 },
    { symbol: 'HLTH', name: 'Healthcare United', shares: 150, price: 320.00, dayChange: 1.10, value: 48000 },
    { symbol: 'FINC', name: 'Financials Corp', shares: 500, price: 85.75, dayChange: 0.45, value: 42875 },
];

const assetAllocation = [
    { label: 'US Stocks', value: 60, color: '#3b82f6' },
    { label: 'International', value: 25, color: '#10b981' },
    { label: 'Bonds', value: 10, color: '#f97316' },
    { label: 'Cash', value: 5, color: '#6b7280' },
];

const totalValue = mockHoldings.reduce((acc, h) => acc + h.value, 0);
const todaysChange = mockHoldings.reduce((acc, h) => acc + h.shares * h.dayChange, 0);

const DonutChart = () => {
    let cumulativePercent = 0;
    const radius = 80;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r={radius} fill="transparent" stroke="#e5e7eb" strokeWidth="20" />
                {assetAllocation.map((asset, index) => {
                    const offset = circumference - (cumulativePercent / 100) * circumference;
                    const dasharray = (asset.value / 100) * circumference;
                    cumulativePercent += asset.value;
                    return (
                        <circle
                            key={index}
                            cx="100"
                            cy="100"
                            r={radius}
                            fill="transparent"
                            stroke={asset.color}
                            strokeWidth="20"
                            strokeDasharray={`${dasharray} ${circumference}`}
                            strokeDashoffset={offset}
                            transform="rotate(-90 100 100)"
                        />
                    );
                })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xs text-slate-500">Total Value</span>
                <span className="text-2xl font-bold text-slate-800">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
        </div>
    );
};


const Portfolio: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500">Portfolio Value</h3>
                <p className="text-2xl font-semibold text-slate-800">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500">Today's Change</h3>
                <p className={`text-2xl font-semibold ${todaysChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {todaysChange >= 0 ? '+' : '-'}${Math.abs(todaysChange).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500">Total Gain/Loss</h3>
                <p className="text-2xl font-semibold text-green-600">+$23,456.78</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Holdings Table */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
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
                            </tr>
                        </thead>
                        <tbody>
                            {mockHoldings.map(h => (
                                <tr key={h.symbol} className="border-t border-slate-100">
                                    <td className="p-3 font-semibold text-slate-800">{h.name}</td>
                                    <td className="p-3 text-slate-600">{h.symbol}</td>
                                    <td className="p-3 text-slate-700 text-right">{h.shares}</td>
                                    <td className="p-3 text-slate-700 text-right">${h.price.toFixed(2)}</td>
                                    <td className={`p-3 font-medium text-right ${h.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {h.dayChange.toFixed(2)}
                                    </td>
                                    <td className="p-3 font-semibold text-slate-800 text-right">${h.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Asset Allocation */}
            <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Asset Allocation</h3>
                <DonutChart />
                <div className="mt-4 space-y-2 text-sm">
                    {assetAllocation.map(asset => (
                        <div key={asset.label} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }}></span>
                                <span className="text-slate-600">{asset.label}</span>
                            </div>
                            <span className="font-medium text-slate-800">{asset.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Portfolio;
