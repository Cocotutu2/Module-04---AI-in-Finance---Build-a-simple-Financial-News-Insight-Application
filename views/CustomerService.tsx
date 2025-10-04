import React, { useState } from 'react';
import type { Message } from '../types';
import { Role } from '../types';
import { customerServiceChat } from '../services/geminiService';
import ChatWindow from '../components/ChatWindow';
import InputBar from '../components/InputBar';

const CustomerService: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init',
            role: Role.MODEL,
            text: "Welcome to FinAI Support! How can I help you today? You can ask about your account, transactions, or general financial topics."
        }
    ]);
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
        setMessages(prev => [...prev, userMessage]);

        try {
            const result = await customerServiceChat.sendMessage({ message: text });
            const modelMessage: Message = {
                id: `${Date.now()}-ai`,
                role: Role.MODEL,
                text: result.text,
            };
            setMessages(prev => [...prev, modelMessage]);
        } catch (e) {
            console.error("Error in customer service chat:", e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(`Failed to get response from AI assistant. ${errorMessage}`);
            
            const errorMessageObject: Message = {
                id: `${Date.now()}-error`,
                role: Role.MODEL,
                text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
            };
            setMessages(prev => [...prev, errorMessageObject]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-0 sm:p-2 lg:p-4 flex justify-center items-center h-full">
            <div className="w-full max-w-4xl h-full sm:h-[calc(100%-2rem)] bg-white rounded-none sm:rounded-lg shadow border border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800">FinAI Virtual Assistant</h2>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Available 24/7 to help with your questions.
                    </p>
                </div>
                
                <ChatWindow messages={messages} />

                {error && (
                    <div className="max-w-4xl mx-auto w-full px-6 pb-2">
                    <p className="text-red-600 bg-red-100 p-3 rounded-lg text-center">{error}</p>
                    </div>
                )}
                
                <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default CustomerService;
