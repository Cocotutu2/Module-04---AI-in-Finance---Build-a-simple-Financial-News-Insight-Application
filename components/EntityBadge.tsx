import React from 'react';
import type { Entity } from '../types';

const CompanyIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6m-6 4.5h6M6.75 21v-2.25a2.25 2.25 0 0 1 2.25-2.25h6a2.25 2.25 0 0 1 2.25 2.25V21" />
    </svg>
);

const PersonIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

const TickerIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
    </svg>
);

const CurrencyIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.826-1.106-2.156 0-2.982.553-.44 1.278-.659 2.003-.659.768 0 1.536.219 2.242.659.879.659 2.108.659 2.987 0a1.503 1.503 0 0 0 0-2.121L12.75 3M12 21l-3-3m0 0 3-3m-3 3h12" />
    </svg>
);

const OtherIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);


interface EntityBadgeProps {
  entity: Entity;
}

const entityConfig = {
    Company: { icon: CompanyIcon, color: 'bg-sky-100 text-sky-800' },
    Person: { icon: PersonIcon, color: 'bg-emerald-100 text-emerald-800' },
    'Ticker Symbol': { icon: TickerIcon, color: 'bg-slate-200 text-slate-800' },
    Currency: { icon: CurrencyIcon, color: 'bg-amber-100 text-amber-800' },
    Product: { icon: OtherIcon, color: 'bg-indigo-100 text-indigo-800' },
    Other: { icon: OtherIcon, color: 'bg-gray-100 text-gray-800' },
}

const EntityBadge: React.FC<EntityBadgeProps> = ({ entity }) => {
    const config = entityConfig[entity.type] || entityConfig.Other;
    const Icon = config.icon;

    return (
        <div title={entity.description} className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-transform hover:scale-105 ${config.color}`}>
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold">{entity.name}</span>
            <span className="text-xs opacity-70 hidden sm:inline">({entity.type})</span>
        </div>
    )
}

export default EntityBadge;
