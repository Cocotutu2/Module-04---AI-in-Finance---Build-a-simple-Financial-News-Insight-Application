import React from 'react';

const FeatureIcon = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

const CodeIcon = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
    </svg>
);

const DataIcon = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
    </svg>
);

const ArchIcon = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5 3 11.25l3.75 3.75M17.25 7.5 21 11.25l-3.75 3.75M12 21V3" />
    </svg>
);

const llmIntegrationCode = `import { GoogleGenAI, Chat } from "@google/genai";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: API_KEY });

// System instruction guides the model's behavior
const systemInstruction = \`You are an expert financial assistant...
When a user provides a financial news article... you MUST respond with ONLY a valid JSON object...\`;

// Create a chat instance with the specific model and configuration
export const chat: Chat = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: systemInstruction,
  },
});

// Send a message and handle the streaming response
const result = await chat.sendMessage({ message: text });
const responseText = result.text;
`;

const InfoCard: React.FC<{ title: string; icon: React.FC<{className?: string}>; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
    <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
        <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Icon className="w-6 h-6 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
        <div className="text-sm text-slate-600 space-y-3">
            {children}
        </div>
    </div>
);

const ProjectInfo: React.FC = () => {
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <InfoCard title="Features Overview" icon={FeatureIcon}>
                <p>This FinAI prototype is a comprehensive suite of tools designed to showcase the power of AI in the financial industry. Key features include:</p>
                <ul className="list-disc list-inside pl-2 space-y-1">
                    <li><strong>Market Dashboard:</strong> A real-time overview of market indices, top movers, and sector performance.</li>
                    <li><strong>Portfolio Tracking:</strong> A mock-up for monitoring personal investment holdings and asset allocation.</li>
                    <li><strong>AI Text Analyzer:</strong> The core feature, using Google's Gemini to analyze financial texts for sentiment, key entities, and a concise summary.</li>
                    <li><strong>High-Frequency Trading:</strong> A simulation of an AI-powered HFT system with a real-time trade log.</li>
                    <li><strong>Risk Management:</strong> Modules for detecting credit card fraud, insurance fraud, AML, and identity theft.</li>
                    <li><strong>AI Customer Service:</strong> A demonstration of a virtual assistant for handling customer queries.</li>
                </ul>
            </InfoCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InfoCard title="System Architecture" icon={ArchIcon}>
                    <p>The application follows a modern, data-centric architecture:</p>
                    <ol className="list-decimal list-inside pl-2 space-y-2 font-medium">
                        <li><strong>Data Sources:</strong> Real-time market data, news articles, and user-provided text.</li>
                        <li><strong>Data Preprocessing:</strong> Cleaning, normalization, and tokenization of input data to ensure quality.</li>
                        <li><strong>AI/ML Core:</strong> A hybrid system using traditional ML for baselines and a Large Language Model (LLM) for deep analysis.</li>
                        <li><strong>API Layer:</strong> The Gemini API serves as the primary endpoint for advanced reasoning and content generation.</li>
                        <li><strong>Front-End UI:</strong> A responsive React application presents the data and insights to the user.</li>
                    </ol>
                </InfoCard>

                <InfoCard title="Data Preprocessing & NLP" icon={DataIcon}>
                    <p>Before analysis, raw text data undergoes several preprocessing steps, including removing HTML tags, normalizing case, and handling special characters. </p>
                    <p>While the primary analysis is done by the LLM, the system can incorporate traditional NLP techniques like TF-IDF for keyword extraction and fine-tuned BERT models for initial, high-speed sentiment classification as a preliminary step.</p>
                </InfoCard>
            </div>

            <InfoCard title="LLM Integration (Gemini API)" icon={CodeIcon}>
                <p>
                    The application's core intelligence is powered by Google's <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono text-xs">gemini-2.5-flash</code> model. We interact with the model using the <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono text-xs">@google/genai</code> SDK.
                    A detailed system instruction is provided to the model to ensure it behaves as a financial expert and, crucially, to format its analysis of financial articles as a structured JSON object. This allows for reliable parsing and display in the UI.
                </p>
                <pre className="bg-slate-800 text-white text-xs rounded-md p-4 overflow-x-auto">
                    <code>{llmIntegrationCode}</code>
                </pre>
            </InfoCard>
            
            <InfoCard title="Front-End Technology" icon={CodeIcon}>
                 <p>The user interface is a modern single-page application (SPA) built with a focus on performance, responsiveness, and user experience. The key technologies are:</p>
                 <ul className="list-disc list-inside pl-2 space-y-1">
                    <li><strong>React:</strong> A component-based library for building user interfaces.</li>
                    <li><strong>TypeScript:</strong> Adds static typing to JavaScript for improved code quality and maintainability.</li>
                    <li><strong>Tailwind CSS:</strong> A utility-first CSS framework for rapid UI development.</li>
                     <li><strong>PWA (Progressive Web App):</strong> Includes a service worker for basic offline functionality and caching.</li>
                </ul>
            </InfoCard>
        </div>
    );
};

export default ProjectInfo;
