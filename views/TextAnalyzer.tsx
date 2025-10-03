import React, { useState } from 'react';
import type { Message } from '../types';
import { Role } from '../types';
import { chat } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';

import ChatWindow from '../components/ChatWindow';
import InputBar from '../components/InputBar';
import SuggestionChips from '../components/SuggestionChips';

const WelcomeScreen: React.FC = () => (
    <div className="text-center my-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to the FinAI Text Analyzer</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
            Paste a financial news article, earnings report, or any other text into the input bar below to get an instant AI-powered analysis. You can also ask general financial questions.
        </p>
    </div>
);

const TextAnalyzer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (text: string) => {
    setIsLoading(true);
    setError(null);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: text,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const result: GenerateContentResponse = await chat.sendMessage({ message: text });
      const responseText = result.text;

      let modelMessage: Message;
      
      try {
        const parsedJson = JSON.parse(responseText);
        modelMessage = {
          id: `${Date.now()}-ai`,
          role: Role.MODEL,
          text: parsedJson.summary,
          ...parsedJson,
        };
      } catch (e) {
        modelMessage = {
          id: `${Date.now()}-ai`,
          role: Role.MODEL,
          text: responseText,
        };
      }

      setMessages((prevMessages) => [...prevMessages, modelMessage]);
    } catch (e) {
      console.error("Error sending message:", e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get response from AI. ${errorMessage}`);
      
      const errorMessageObject: Message = {
        id: `${Date.now()}-error`,
        role: Role.MODEL,
        text: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessageObject]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-full">
      {messages.length > 0 ? (
        <ChatWindow messages={messages} />
      ) : (
        <div className="flex-1 flex flex-col justify-center">
            <WelcomeScreen />
        </div>
      )}

      {error && (
        <div className="max-w-4xl mx-auto w-full px-6 pb-2">
          <p className="text-red-600 bg-red-100 p-3 rounded-lg text-center">{error}</p>
        </div>
      )}
      
      {messages.length === 0 && <SuggestionChips onSuggestionClick={handleSuggestionClick} isLoading={isLoading} />}
      <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default TextAnalyzer;