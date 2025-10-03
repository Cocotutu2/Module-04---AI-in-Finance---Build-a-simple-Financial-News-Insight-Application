import React, { useRef, useEffect } from 'react';
import type { Message as MessageType } from '../types';
import Message from './Message';

interface ChatWindowProps {
  messages: MessageType[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="max-w-4xl mx-auto w-full">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-6">
            <Message message={msg} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;