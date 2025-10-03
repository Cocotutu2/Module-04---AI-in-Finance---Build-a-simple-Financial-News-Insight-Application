import React from 'react';
import { Role } from '../types';
import type { Message as MessageType } from '../types';
import SentimentBadge from './SentimentBadge';
import EntityBadge from './EntityBadge';

interface MessageProps {
  message: MessageType;
}

const UserIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
  </svg>
);

const AIIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.807 3.808 3.807 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
    <path d="M16.464 7.226a.75.75 0 0 1 1.06 0 5.25 5.25 0 0 1 0 7.424.75.75 0 0 1-1.06-1.06 3.75 3.75 0 0 0 0-5.304.75.75 0 0 1 0-1.06Z" />
  </svg>
);

// New component to render text with clickable links
const LinkifiedText: React.FC<{ text: string; isUser: boolean }> = ({ text, isUser }) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    const linkClasses = isUser 
        ? "text-white font-medium underline hover:text-blue-200"
        : "text-blue-700 font-medium underline hover:text-blue-500";

    return (
        <p className="whitespace-pre-wrap">
            {parts.map((part, index) => {
                if (part.match(urlRegex)) {
                    return (
                        <a key={index} href={part} target="_blank" rel="noopener noreferrer" className={linkClasses}>
                            {part}
                        </a>
                    );
                }
                return <React.Fragment key={index}>{part}</React.Fragment>;
            })}
        </p>
    );
};


const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  const containerClasses = isUser ? 'flex-row-reverse' : 'flex-row';
  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white rounded-br-none'
    : 'bg-slate-200 text-slate-800 rounded-bl-none';
  const icon = isUser 
    ? <UserIcon className="w-8 h-8 text-slate-500" />
    : <AIIcon className="w-8 h-8 text-slate-500" />;

  return (
    <div className={`flex items-start gap-3 ${containerClasses}`}>
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div className={`flex flex-col max-w-lg md:max-w-xl lg:max-w-2xl`}>
        <div className={`px-4 py-3 rounded-xl shadow-sm ${bubbleClasses}`}>
          <LinkifiedText text={message.text} isUser={isUser} />
        </div>
        
        {(message.sentiment || message.entities) && (
        <div className="mt-3 flex flex-col items-start gap-3">
            {message.sentiment && message.sentimentScore !== undefined && (
                <SentimentBadge sentiment={message.sentiment} score={message.sentimentScore} />
            )}
            
            {message.entities && message.entities.length > 0 && (
                <div className="w-full">
                    <h4 className="text-sm font-semibold text-slate-600 mb-2">Key Entities</h4>
                    <div className="flex flex-wrap gap-2">
                        {message.entities.map((entity, index) => (
                            <EntityBadge key={index} entity={entity} />
                        ))}
                    </div>
                </div>
            )}
        </div>
        )}
      </div>
    </div>
  );
};

export default Message;