import React from 'react';

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


const fraudModules = [
    {
        icon: CreditCardIcon,
        title: "Credit Card Fraud Detection",
        description: "Utilizes real-time transaction analysis to identify and flag suspicious purchases, minimizing financial loss.",
        mockUI: (
            <div className="mt-2 p-2 bg-slate-100 rounded-md text-xs space-y-1">
                <p className="font-mono text-slate-600">[...]</p>
                <p className="font-mono text-slate-800">TXN_98765 | $12.50 | NYC, USA | Status: <span className="text-green-600 font-semibold">Approved</span></p>
                <p className="font-mono text-slate-800 bg-red-100 p-1 rounded">TXN_98766 | $2,500.00 | Bogota, COL | Status: <span className="text-red-600 font-semibold">FLAGGED (Unusual Location & Amount)</span></p>
                <p className="font-mono text-slate-800">TXN_98767 | $88.00 | Online | Status: <span className="text-green-600 font-semibold">Approved</span></p>
            </div>
        )
    },
    {
        icon: DocumentIcon,
        title: "Insurance Fraud Detection",
        description: "Scans insurance claims for inconsistencies, patterns of abuse, and known fraud indicators to prevent illicit payouts.",
        mockUI: <button className="mt-4 w-full text-sm bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Analyze Insurance Claim</button>
    },
    {
        icon: BankIcon,
        title: "Anti-Money Laundering (AML)",
        description: "Monitors transaction networks to detect complex money laundering schemes, such as structuring and layering.",
        mockUI: (
            <div className="mt-2 text-xs text-slate-600 space-y-1">
                <p><span className="font-semibold text-slate-800">New SAR Generated:</span> SAR-2024-034</p>
                <p><span className="font-semibold text-slate-800">Reason:</span> Multiple high-value cash deposits across several accounts, immediately wired offshore.</p>
                <p><span className="font-semibold text-slate-800">Risk Score:</span> <span className="text-red-600 font-bold">9.2/10</span></p>
            </div>
        )
    },
    {
        icon: FingerprintIcon,
        title: "Identity Theft Prevention",
        description: "Analyzes login attempts, device information, and user behavior to detect and block unauthorized account access.",
        mockUI: (
            <div className="mt-2 grid grid-cols-2 gap-2 text-center">
                <div className="bg-green-100 p-2 rounded">
                    <p className="text-lg font-bold text-green-800">2,409</p>
                    <p className="text-xs text-green-700">Accounts Secured</p>
                </div>
                <div className="bg-amber-100 p-2 rounded">
                    <p className="text-lg font-bold text-amber-800">17</p>
                    <p className="text-xs text-amber-700">High-Risk Alerts</p>
                </div>
            </div>
        )
    },
];

const FraudRisk: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fraudModules.map(module => {
                const Icon = module.icon;
                return (
                    <div key={module.title} className="bg-white p-6 rounded-lg shadow border border-slate-200 flex flex-col">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                <Icon className="w-7 h-7 text-slate-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{module.title}</h3>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 mt-4 flex-grow">{module.description}</p>
                        <div className="mt-4 border-t border-slate-200 pt-4">
                            {module.mockUI}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default FraudRisk;
