import React, { useState } from 'react';

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

const Header: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: 'FinAI: AI Finance Assistant',
      text: 'Check out this AI-powered financial assistant for text analysis and insights.',
      url: url,
    };

    // Primary Action: Use Web Share API if available (typically on mobile).
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        // The share dialog was successful.
        return;
      } catch (err) {
        // The user cancelled the share dialog or it failed.
        // We don't fall back to copying, as cancellation is intentional.
        console.log("Share API was cancelled or failed.", err);
        return;
      }
    }

    // Fallback Action: Copy to clipboard (typically on desktop).
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.warn('Could not copy text with Clipboard API, trying fallback: ', err);
      // Final Fallback: Use the deprecated `execCommand`.
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
    <header className="bg-slate-800 text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">FinAI</h1>
          <p className="text-sm text-slate-300">Your Personal Financial Text Analyzer</p>
        </div>
        <div className="relative">
          <button 
            onClick={handleShare} 
            className="p-2 rounded-full hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white group"
            aria-label={isCopied ? "Link copied!" : "Share or copy link"}
          >
            {isCopied ? (
              <CheckIcon className="w-6 h-6 text-green-400" />
            ) : (
              <ShareIcon className="w-6 h-6 text-slate-300" />
            )}
          </button>
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            {isCopied ? "Copied!" : "Share Link"}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;