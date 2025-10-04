import React, { useState } from 'react';
import type { View } from '../App';

const ShareIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.186 2.25 2.25 0 0 0-3.933 2.186Z" />
  </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

/**
 * A fallback method to copy text to the clipboard using the deprecated `execCommand`.
 * This is used when the modern Clipboard API fails.
 * @param text The text to copy.
 * @returns `true` if the copy was successful, otherwise `false`.
 */
const fallbackCopyToClipboard = (text: string): boolean => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Make the textarea invisible and out of the way
  textArea.style.position = 'fixed';
  textArea.style.top = '-9999px';
  textArea.style.left = '-9999px';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let success = false;
  try {
    success = document.execCommand('copy');
  } catch (err) {
    console.error('Fallback copy failed:', err);
  }

  document.body.removeChild(textArea);
  return success;
};

const viewDetails: Record<View, { title: string; subtitle: string }> = {
    analyzer: { title: 'Text Analyzer', subtitle: 'Analyze articles and financial text with AI' },
    dashboard: { title: 'Market Overview', subtitle: 'A snapshot of current market trends' },
    portfolio: { title: 'My Portfolio', subtitle: 'Track and analyze your investments' },
    whatif: { title: 'What-If Analysis', subtitle: 'Simulate potential market scenarios' },
    risk: { title: 'Risk Management', subtitle: 'AI-powered fraud detection and threat analysis' },
    trading: { title: 'HFT Dashboard', subtitle: 'Monitor AI-powered high-frequency trading' },
    customerService: { title: 'Customer Service AI', subtitle: 'Engage with our AI-powered virtual assistant' },
    projectInfo: { title: 'Project Information', subtitle: 'Architecture, features, and technical details' },
};


const Header: React.FC<{ activeView: View }> = ({ activeView }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { title, subtitle } = viewDetails[activeView];

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: 'FinAI: AI Finance Assistant',
      text: 'Check out this AI-powered financial assistant for text analysis and insights.',
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.log("Share API was cancelled or failed.", err);
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.warn('Could not copy text with Clipboard API, trying fallback: ', err);
      const success = fallbackCopyToClipboard(url);
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        console.error('Failed to copy with any method.');
        alert('Failed to copy link to clipboard.');
      }
    }
  };

  return (
    <header className="bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">{title}</h1>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="relative">
          <button 
            onClick={handleShare} 
            className="p-2 rounded-full hover:bg-slate-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500 group"
            aria-label={isCopied ? "Link copied!" : "Share or copy link"}
          >
            {isCopied ? (
              <CheckIcon className="w-6 h-6 text-green-500" />
            ) : (
              <ShareIcon className="w-6 h-6 text-slate-500" />
            )}
          </button>
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            {isCopied ? "Copied!" : "Share Link"}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;