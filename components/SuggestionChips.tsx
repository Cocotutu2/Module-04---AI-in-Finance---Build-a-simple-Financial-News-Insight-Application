import React from 'react';

interface SuggestionChipsProps {
    onSelect: (prompt: string) => void;
    isLoading: boolean;
}

const suggestions = [
    {
        emoji: '📈',
        text: 'Analyze latest market news'
    },
    {
        emoji: '💡',
        text: 'What is a stock split?'
    },
];

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ onSelect, isLoading }) => {
    return (
        <div className="px-4 pb-2">
            <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion) => (
                    <button
                        key={suggestion.text}
                        onClick={() => onSelect(suggestion.text)}
                        disabled={isLoading}
                        className="px-4 py-2 bg-white border border-slate-300 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        <span className="mr-2">{suggestion.emoji}</span>
                        {suggestion.text}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SuggestionChips;
