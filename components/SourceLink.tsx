
import React from 'react';
import type { Source } from '../types';

const LinkIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
);

interface SourceLinkProps {
  source: Source;
}

const SourceLink: React.FC<SourceLinkProps> = ({ source }) => {
  return (
    <a
      href={source.uri}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2 text-sm text-cyan-700 hover:text-cyan-500 hover:underline transition-colors duration-200 bg-cyan-50 rounded-full px-3 py-1"
    >
      <LinkIcon className="w-4 h-4 flex-shrink-0" />
      <span className="truncate">{source.title}</span>
    </a>
  );
};

export default SourceLink;
