import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import SuggestionChips from './components/SuggestionChips';
import { chat } from './services/geminiService';
import { Role } from './types';
import type { Message } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      role: Role.AI,
      text: "Hello! I'm FinAI. Paste a financial news article below to get a summary and sentiment analysis, or ask me any finance-related question.",
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    let accumulatedResponse = '';

    try {
      const stream = await chat.sendMessageStream({ message: text });

      // Add a placeholder for the AI's response to stream into.
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: aiMessageId, role: Role.AI, text: '' }
      ]);

      for await (const chunk of stream) {
        accumulatedResponse += chunk.text;
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === aiMessageId ? { ...msg, text: accumulatedResponse } : msg
          )
        );
      }

      // After streaming is complete, try to parse for analysis data.
      let finalAiMessage: Message;
      try {
        const parsedData = JSON.parse(accumulatedResponse);
        if (parsedData.summary && parsedData.sentiment && parsedData.sentimentScore !== undefined) {
          finalAiMessage = {
            id: aiMessageId,
            role: Role.AI,
            text: parsedData.summary,
            sentiment: parsedData.sentiment,
            sentimentScore: parsedData.sentimentScore,
            entities: parsedData.entities || [],
          };
        } else {
          throw new Error("Invalid JSON structure");
        }
      } catch (e) {
        // It's a regular text response.
        finalAiMessage = {
          id: aiMessageId,
          role: Role.AI,
          text: accumulatedResponse,
        };
      }

      // Replace the streamed message with the final, parsed message.
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === aiMessageId ? finalAiMessage : msg))
      );

    } catch (error) {
      console.error("Failed to get response from AI:", error);
      const errorMessageText = "I'm having trouble connecting right now. Please try again in a moment.";
      // Check if the placeholder was already added and update it, otherwise add a new error message.
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some(msg => msg.id === aiMessageId);
        if (messageExists) {
          return prevMessages.map(msg =>
            msg.id === aiMessageId ? { ...msg, text: errorMessageText } : msg
          );
        }
        return [...prevMessages, { id: aiMessageId, role: Role.AI, text: errorMessageText }];
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="h-screen w-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatWindow messages={messages} />
        <SuggestionChips onSelect={handleSendMessage} isLoading={isLoading} />
        <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default App;
