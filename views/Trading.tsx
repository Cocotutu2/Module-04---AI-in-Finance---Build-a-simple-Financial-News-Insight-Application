import React, { useState, useEffect, useRef } from 'react';
import { getAItrades } from '../services/geminiService';

const LightningBoltIcon = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
);

type Trade = {
    time: string;
    type: 'BUY' | 'SELL';
    symbol: string;
    quantity: number;
    price: number;
    profit?: number;
}

const Trading: React.FC = () => {
    const [liveTrades, setLiveTrades] = useState<Trade[]>([]);
    const [stats, setStats] = useState({ trades: 0, totalProfit: 0 });
    const logRef = useRef<HTMLDivElement>(null);
    const tradeQueue = useRef<any[]>([]);
    const buys = useRef<Map<string, {price: number, quantity: number}>>(new Map());

    useEffect(() => {
        const initializeTrades = async () => {
            try {
                const aiTrades = await getAItrades();
                tradeQueue.current = aiTrades;
            } catch (error) {
                console.error("Failed to fetch AI trades", error);
                // Fallback or error message
            }
        };
        initializeTrades();

        const interval = setInterval(() => {
            if (tradeQueue.current.length === 0) return;

            const nextTrade = tradeQueue.current.shift();
            if (!nextTrade) return;
            
            const now = new Date();
            const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
            
            let tradeWithProfit: Trade | null = null;

            if (nextTrade.type === 'BUY') {
                buys.current.set(nextTrade.symbol, { price: nextTrade.price, quantity: nextTrade.quantity });
                tradeWithProfit = { ...nextTrade, time };
            } else if (nextTrade.type === 'SELL' && buys.current.has(nextTrade.symbol)) {
                const buyInfo = buys.current.get(nextTrade.symbol)!;
                const profit = (nextTrade.price - buyInfo.price) * Math.min(nextTrade.quantity, buyInfo.quantity);
                tradeWithProfit = { ...nextTrade, time, profit };
                buys.current.delete(nextTrade.symbol);

                setStats(prev => ({
                    trades: prev.trades + 1,
                    totalProfit: prev.totalProfit + profit
                }));
            }

            if(tradeWithProfit) {
                setLiveTrades(prev => [...prev, tradeWithProfit!].slice(-100));
            }

        }, 750);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [liveTrades]);

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500">AI Trading System Status</h3>
                    <p className="text-2xl font-semibold text-green-600 flex items-center">
                        <span className="relative flex h-3 w-3 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Online
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500">Trades Executed (Session)</h3>
                    <p className="text-2xl font-semibold text-slate-800">{stats.trades.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500">Net Profit (Session)</h3>
                    <p className={`text-2xl font-semibold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                       {stats.totalProfit >= 0 ? '+' : '-'}${Math.abs(stats.totalProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
                <div className="flex items-center space-x-3 mb-4">
                    <LightningBoltIcon className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-800">Real-Time AI Trade Execution Log</h2>
                </div>
                <div ref={logRef} className="h-96 bg-slate-900 text-white font-mono text-sm p-4 rounded-md overflow-y-auto">
                    {liveTrades.length === 0 && <p className="text-slate-400">Initializing AI trade feed...</p>}
                    {liveTrades.map((trade, index) => (
                        <div key={index}>
                            <span className="text-slate-400">{trade.time} | </span>
                            <span className={trade.type === 'BUY' ? 'text-cyan-400' : 'text-fuchsia-400'}>{trade.type.padEnd(4)} | </span>
                            <span>{trade.symbol.padEnd(5)} | </span>
                            <span>{trade.quantity.toString().padStart(3)} @ </span>
                            <span>{trade.price.toFixed(2)}</span>
                            {trade.profit !== undefined && (
                                <span className={trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}> | Profit: ${trade.profit.toFixed(2)}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Trading;
