import React from 'react';

const TrendingUpIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
);

const TrendingDownIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 4.5 15 15m0 0V8.25m0 11.25H8.25" />
    </svg>
);

const ArrowRightIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
);


interface SentimentBadgeProps {
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  score: number;
}

const sentimentConfig = {
    Positive: {
        icon: TrendingUpIcon,
        color: 'text-green-800 bg-green-100',
        label: 'Positive'
    },
    Negative: {
        icon: TrendingDownIcon,
        color: 'text-red-800 bg-red-100',
        label: 'Negative'
    },
    Neutral: {
        icon: ArrowRightIcon,
        color: 'text-slate-800 bg-slate-200',
        label: 'Neutral'
    }
}

const SentimentBadge: React.FC<SentimentBadgeProps> = ({ sentiment, score }) => {
    const config = sentimentConfig[sentiment] || sentimentConfig.Neutral;
    const Icon = config.icon;

    return (
        <div className={`inline-flex items-center space-x-2 rounded-full px-3 py-1.5 text-sm font-semibold ${config.color}`}>
            <Icon className="w-5 h-5" />
            <span>{config.label}</span>
            <span className="font-mono text-xs opacity-80">{score.toFixed(2)}</span>
        </div>
    )
}

export default SentimentBadge;
