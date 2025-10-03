import React, { useState } from 'react';
import { getSampleArticles, NewsArticle } from '../services/newsService';

const marketIndices = [
    { name: 'S&P 500', value: '5,432.10', change: '+25.40', percentChange: '+0.47%', isPositive: true },
    { name: 'Dow Jones', value: '39,876.54', change: '-50.12', percentChange: '-0.13%', isPositive: false },
    { name: 'NASDAQ', value: '17,890.12', change: '+150.78', percentChange: '+0.85%', isPositive: true },
];

const topMovers = {
    gainers: [
        { symbol: 'ABC', price: '150.25', change: '+10.15', percentChange: '+7.25%' },
        { symbol: 'DEF', price: '75.50', change: '+5.40', percentChange: '+6.80%' },
        { symbol: 'GHI', price: '210.80', change: '+12.30', percentChange: '+6.20%' },
    ],
    losers: [
        { symbol: 'XYZ', price: '95.60', change: '-8.50', percentChange: '-8.15%' },
        { symbol: 'UVW', price: '120.75', change: '-9.20', percentChange: '-7.10%' },
        { symbol: 'RST', price: '50.10', change: '-3.10', percentChange: '-5.80%' },
    ]
};

const sectorPerformance = [
    { name: 'Technology', change: '+1.85%', isPositive: true, width: '80%' },
    { name: 'Healthcare', change: '+0.95%', isPositive: true, width: '65%' },
    { name: 'Financials', change: '-0.25%', isPositive: false, width: '45%' },
    { name: 'Consumer Goods', change: '+0.40%', isPositive: true, width: '55%' },
    { name: 'Energy', change: '-1.15%', isPositive: false, width: '30%' },
];

const Dashboard: React.FC = () => {
    const [activeMoversTab, setActiveMoversTab] = useState<'gainers' | 'losers'>('gainers');
    const newsArticles = getSampleArticles();

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Market Indices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {marketIndices.map(index => (
                    <div key={index.name} className="bg-white p-4 rounded-lg shadow border border-slate-200">
                        <p className="text-sm font-medium text-slate-500">{index.name}</p>
                        <p className="text-2xl font-semibold text-slate-800">{index.value}</p>
                        <div className={`text-sm font-semibold ${index.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            <span>{index.change}</span>
                            <span className="ml-2">({index.percentChange})</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sector Performance */}
                <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Sector Performance</h3>
                    <div className="space-y-4">
                        {sectorPerformance.map(sector => (
                            <div key={sector.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-slate-600">{sector.name}</span>
                                    <span className={`font-semibold ${sector.isPositive ? 'text-green-600' : 'text-red-600'}`}>{sector.change}</span>
                                </div>
                                <div className="bg-slate-200 rounded-full h-2">
                                    <div style={{ width: sector.width }} className={`h-2 rounded-full ${sector.isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Movers */}
                <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow border border-slate-200">
                    <div className="flex border-b border-slate-200 mb-4">
                        <button onClick={() => setActiveMoversTab('gainers')} className={`px-4 py-2 text-sm font-semibold ${activeMoversTab === 'gainers' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}>Top Gainers</button>
                        <button onClick={() => setActiveMoversTab('losers')} className={`px-4 py-2 text-sm font-semibold ${activeMoversTab === 'losers' ? 'border-b-2 border-red-600 text-red-600' : 'text-slate-500'}`}>Top Losers</button>
                    </div>
                    <div>
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="text-slate-500">
                                    <th className="font-medium p-2">Symbol</th>
                                    <th className="font-medium p-2">Price</th>
                                    <th className="font-medium p-2">Change</th>
                                    <th className="font-medium p-2">% Change</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topMovers[activeMoversTab].map(mover => (
                                    <tr key={mover.symbol} className="border-t border-slate-100">
                                        <td className="p-2 font-semibold text-slate-800">{mover.symbol}</td>
                                        <td className="p-2 text-slate-700">${mover.price}</td>
                                        <td className={`p-2 font-medium ${activeMoversTab === 'gainers' ? 'text-green-600' : 'text-red-600'}`}>{mover.change}</td>
                                        <td className={`p-2 font-medium ${activeMoversTab === 'gainers' ? 'text-green-600' : 'text-red-600'}`}>{mover.percentChange}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Latest News */}
            <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Latest Financial News</h3>
                <div className="space-y-4">
                    {newsArticles.map(article => (
                        <div key={article.id} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                            <p className="font-semibold text-slate-800 hover:text-blue-600 cursor-pointer">{article.headline}</p>
                            <p className="text-sm text-slate-500 line-clamp-2">{article.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
