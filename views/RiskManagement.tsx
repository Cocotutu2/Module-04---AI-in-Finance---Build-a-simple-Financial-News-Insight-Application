import React, { useState } from 'react';
import { analyzeRisk } from '../services/geminiService';

// ... (Icons remain the same)
const CreditCardIcon = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
    </svg>
);
const DocumentIcon = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);
const BankIcon = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
    </svg>
);
const FingerprintIcon = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.588 8.263M4.5 19.5A7.5 7.5 0 0 1 10.5 4.5c1.336 0 2.591.205 3.766.564M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);


type RiskModuleType = 'Credit' | 'Insurance' | 'AML' | 'Identity';

const sampleData: Record<RiskModuleType, string> = {
    Credit: `TXN_98765 | $12.50 | NYC, USA | Merchant: Coffee Corner
TXN_98766 | $2,500.00 | Bogota, COL | Merchant: Electronics World
TXN_98767 | $88.00 | Online | Merchant: GameStore
TXN_98768 | $5.50 | NYC, USA | Merchant: Subway`,
    Insurance: `Claimant: John Doe\nPolicy: AUTO-12345\nDate of Incident: 2024-07-15\nDescription: Claimant states their 2022 sedan was parked and hit by an unknown vehicle overnight. The entire driver's side is damaged. No witnesses. This is the third similar claim in 2 years.`,
    AML: `Source Acct: 12345, Amount: $2,500 -> Dest Acct: 56789
Source Acct: 12346, Amount: $2,000 -> Dest Acct: 56789
Source Acct: 12347, Amount: $2,800 -> Dest Acct: 56789
Source Acct: 56789, Amount: $7,300 -> Dest Acct: 99999 (Offshore)`,
    Identity: `2024-07-16 10:00:00 | Login success | IP: 192.168.1.10 | Device: Chrome on Mac
2024-07-16 10:05:12 | Login failed | IP: 104.28.212.129 (Romania) | Device: Firefox on Windows
2024-07-16 10:05:15 | Login failed | IP: 104.28.212.129 (Romania) | Device: Firefox on Windows
2024-07-16 10:05:21 | Login success | IP: 104.28.212.129 (Romania) | Device: Firefox on Windows
2024-07-16 10:06:00 | Password reset initiated | IP: 104.28.212.129 (Romania)`
}

const riskModules = [
    { type: 'Credit' as RiskModuleType, icon: CreditCardIcon, title: "Credit Card Fraud Detection", description: "Utilizes real-time transaction analysis to identify and flag suspicious purchases, minimizing financial loss." },
    { type: 'Insurance' as RiskModuleType, icon: DocumentIcon, title: "Insurance Fraud Detection", description: "Scans insurance claims for inconsistencies, patterns of abuse, and known fraud indicators to prevent illicit payouts." },
    { type: 'AML' as RiskModuleType, icon: BankIcon, title: "Anti-Money Laundering (AML)", description: "Monitors transaction networks to detect complex money laundering schemes, such as structuring and layering." },
    { type: 'Identity' as RiskModuleType, icon: FingerprintIcon, title: "Identity Theft Prevention", description: "Analyzes login attempts, device information, and user behavior to detect and block unauthorized account access." },
];

const RiskModuleCard: React.FC<{module: typeof riskModules[0]}> = ({ module }) => {
    const [input, setInput] = useState(sampleData[module.type]);
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const Icon = module.icon;

    const handleAnalyze = async () => {
        setIsLoading(true);
        setResult('');
        try {
            const analysisResult = await analyzeRisk(input, module.type);
            setResult(analysisResult);
        } catch (error) {
            console.error(`Analysis failed for ${module.title}`, error);
            setResult('An error occurred during analysis. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow border border-slate-200 flex flex-col">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-slate-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">{module.title}</h3>
                </div>
            </div>
            <p className="text-sm text-slate-600 mt-4 flex-grow">{module.description}</p>
            <div className="mt-4 border-t border-slate-200 pt-4 space-y-3">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={5}
                    className="w-full text-sm p-2 font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Paste ${module.type} data here...`}
                />
                <button 
                    onClick={handleAnalyze} 
                    disabled={isLoading || !input.trim()}
                    className="w-full text-sm bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400"
                >
                    {isLoading ? 'Analyzing with AI...' : 'Analyze'}
                </button>
                {result && (
                     <div className="mt-2 p-3 bg-slate-100 rounded-md text-sm space-y-1 whitespace-pre-wrap">
                        <h4 className="font-bold text-slate-800">AI Analysis Result:</h4>
                        <p className="text-slate-700">{result}</p>
                     </div>
                )}
            </div>
        </div>
    );
};


const RiskManagement: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {riskModules.map(module => (
                <RiskModuleCard key={module.title} module={module} />
            ))}
        </div>
    </div>
  );
};

export default RiskManagement;
