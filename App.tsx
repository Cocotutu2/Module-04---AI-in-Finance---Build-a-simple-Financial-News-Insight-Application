import React, { useState } from 'react';
import type { Message } from './types';
import { Role } from './types';
import { chat } from './services/geminiService';
import { GenerateContentResponse } from '@google/genai';

import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import SuggestionChips from './components/SuggestionChips';

const App: React.FC = () => {
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
      // FIX: Use the imported chat instance to send a message.
      const result: GenerateContentResponse = await chat.sendMessage({ message: text });
      // FIX: Correctly extract the text content from the GenerateContentResponse.
      const responseText = result.text;

      let modelMessage: Message;
      
      // Try to parse the response as JSON. If it fails, treat it as a plain text response,
      // as per the system instructions.
      try {
        const parsedJson = JSON.parse(responseText);
        modelMessage = {
          id: `${Date.now()}-ai`,
          role: Role.MODEL,
          text: parsedJson.summary, // The main text of the message is the summary
          ...parsedJson,
        };
      } catch (e) {
        // Not a JSON response, so it's a conversational reply
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
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      <Header />
      <ChatWindow messages={messages} />
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

export default App;
