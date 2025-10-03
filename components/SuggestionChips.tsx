import React from 'react';
import { getSampleArticles } from '../services/newsService';

interface SuggestionChipsProps {
  onSuggestionClick: (suggestion: string) => void;
  isLoading: boolean;
}

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ onSuggestionClick, isLoading }) => {
  const articles = getSampleArticles();

  const questions = [
    "What is a P/E ratio?",
    "Explain quantitative easing.",
  ];

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-4">
        <p className="text-sm text-slate-500 mb-3 text-center">Try an example:</p>
        <div className="flex flex-wrap justify-center gap-2">
            {articles.map((article) => (
                <button
                key={article.id}
                onClick={() => onSuggestionClick(article.content)}
                disabled={isLoading}
                className="bg-white text-slate-700 text-sm font-medium px-4 py-2 rounded-full border border-slate-300 hover:bg-slate-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                Analyze: "{article.headline}"
                </button>
            ))}
            {questions.map((q) => (
                <button
                key={q}
                onClick={() => onSuggestionClick(q)}
                disabled={isLoading}
                className="bg-white text-slate-700 text-sm font-medium px-4 py-2 rounded-full border border-slate-300 hover:bg-slate-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {q}
                </button>
            ))}
        </div>
    </div>
  );
};

export default SuggestionChips;
