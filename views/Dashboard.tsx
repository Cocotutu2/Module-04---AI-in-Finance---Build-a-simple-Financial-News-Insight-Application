import React, { useState, useEffect } from 'react';
import { getMarketData } from '../services/geminiService';

const NewspaperIcon = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5" />
    </svg>
);


const Dashboard: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const marketData = await getMarketData();
                setData(marketData);
            } catch (error) {
                console.error("Failed to fetch market data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const [activeMoversTab, setActiveMoversTab] = useState<'gainers' | 'losers'>('gainers');

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Market Indices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {data.marketIndices.map((index: any) => (
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
                        {data.sectorPerformance.map((sector: any) => (
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
                                {data.topMovers[activeMoversTab].map((mover: any) => (
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
                <div className="flex items-center space-x-3 mb-4">
                    <NewspaperIcon className="w-6 h-6 text-slate-600" />
                    <h3 className="text-lg font-semibold text-slate-800">Latest Financial News</h3>
                </div>
                <div className="space-y-3">
                    {data.newsHeadlines.map((news: any, index: number) => (
                        <div key={index} className="border-t border-slate-100 pt-3">
                            <p className="font-medium text-slate-800">{news.headline}</p>
                            <p className="text-xs text-slate-500">{news.source}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const DashboardSkeleton = () => (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="h-24 bg-slate-200 rounded-lg"></div>
            <div className="h-24 bg-slate-200 rounded-lg"></div>
            <div className="h-24 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-slate-200 rounded-lg h-64"></div>
            <div className="lg:col-span-2 bg-slate-200 rounded-lg h-64"></div>
        </div>
        <div className="bg-slate-200 rounded-lg h-48"></div>
    </div>
);


export default Dashboard;