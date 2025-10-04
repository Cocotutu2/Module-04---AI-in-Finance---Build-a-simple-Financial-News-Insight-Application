import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { Holding } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `You are a helpful and expert financial assistant named 'FinAI'. Your goal is to analyze financial text, provide insights, and answer questions.

When a user provides a block of text that seems like a financial news article, report, or analysis, you MUST respond with ONLY a valid JSON object. Do not add any text, markdown, or commentary before or after the JSON. The JSON object must have the following structure:
{
  "summary": "A concise summary of the provided text.",
  "sentiment": "A sentiment classification from one of the following options: 'Positive', 'Negative', 'Neutral'.",
  "sentimentScore": "A numerical score between -1.0 (very negative) and 1.0 (very positive).",
  "entities": [
    {
      "name": "The name of the extracted entity (e.g., 'Apple Inc.', 'AAPL', 'Tim Cook').",
      "type": "The type of entity. Must be one of: 'Company', 'Person', 'Ticker Symbol', 'Product', 'Currency', 'Other'.",
      "description": "A brief, one-sentence description of the entity's relevance in the article."
    }
  ]
}

For any other query, such as a simple question (e.g., "What is a P/E ratio?"), a follow-up question about a previous analysis, or a conversational greeting, you MUST respond with a helpful, conversational answer in plain text. Do NOT use JSON for these responses.

You must not provide financial advice that could be construed as professional investment advice for specific individuals. Always preface advice with a disclaimer that you are an AI assistant and users should consult with a human financial advisor for personalized advice.
`;

// Chat instance for the Text Analyzer view
export const chat: Chat = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: systemInstruction,
  },
});

const customerServiceSystemInstruction = `You are FinAI Virtual Assistant, a helpful and friendly customer service agent for a bank. You have access to the user's mock account data: Checking Balance: $2,458.31, Savings Balance: $15,200.00, Credit Card Debt: $1,234.56. Your goal is to answer user questions about their account and provide helpful financial guidance. Do not make up information you don't have. Be conversational and empathetic.`;

// Separate chat instance for the Customer Service view
export const customerServiceChat: Chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction: customerServiceSystemInstruction,
    },
});

export const getMarketData = async () => {
    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a realistic snapshot of the current stock market for a dashboard. I need data for 3 major indices (like S&P 500, Dow Jones, NASDAQ), 3 top gaining stocks, 3 top losing stocks, 5 sector performance metrics, and 5 recent, relevant financial news headlines. Provide ONLY a valid JSON object with the structure:
        {
            "marketIndices": [{ "name": string, "value": string, "change": string, "percentChange": string, "isPositive": boolean }],
            "topMovers": {
                "gainers": [{ "symbol": string, "price": string, "change": string, "percentChange": string }],
                "losers": [{ "symbol": string, "price": string, "change": string, "percentChange": string }]
            },
            "sectorPerformance": [{ "name": string, "change": string, "isPositive": boolean, "width": string }],
            "newsHeadlines": [{ "headline": string, "source": string }]
        }
        The "width" property should be a percentage string like "80%" representing the relative performance.`,
        config: { responseMimeType: 'application/json' },
    });
    return JSON.parse(result.text);
}

export const getStockInfo = async (ticker: string): Promise<{name: string, price: number, dayChange: number}> => {
    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Using your knowledge and search capabilities, what is the current stock price, full company name, and today's price change for the ticker symbol: ${ticker}? Respond with ONLY a valid JSON object like this: {"name": "Apple Inc.", "price": 150.25, "dayChange": 1.75}. Do not include any other text or markdown formatting.`,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const text = result.text.trim().replace(/^```json\n?/, '').replace(/```$/, '');
    const parsed = JSON.parse(text);
    return parsed;
};

export const runWhatIfAnalysis = async (holdings: Holding[], scenarioText: string) => {
    const portfolioString = holdings.map(h => `${h.shares} shares of ${h.symbol} (${h.name})`).join(', ');
    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Given the following stock portfolio: [${portfolioString}]. Simulate the impact of the following market scenario: "${scenarioText}".
        Provide a projected total portfolio value change (in USD and percentage), and identify the best and worst-performing assets in this scenario.
        Respond with ONLY a valid JSON object with the structure:
        { "impactValue": number, "impactPercent": number, "best": { "symbol": string, "change": number }, "worst": { "symbol": string, "change": number } }
        `,
        config: { responseMimeType: 'application/json' },
    });
    return JSON.parse(result.text);
};

export const getAItrades = async (): Promise<any[]> => {
    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an AI HFT bot. Generate a list of 50 plausible buy/sell trades that would occur in a short time interval for common tech and finance stocks. Return ONLY a JSON array of objects with keys: "type" ("BUY" or "SELL"), "symbol", "quantity", and "price". Ensure buy and sell orders for the same stock are close in price.`,
        config: { responseMimeType: 'application/json' },
    });
    return JSON.parse(result.text);
};


export const analyzeRisk = async (text: string, type: 'Credit' | 'Insurance' | 'AML' | 'Identity') => {
    let prompt;
    switch (type) {
        case 'Credit':
            prompt = `As a fraud detection AI, analyze these credit card transactions and identify any suspicious activity. Explain your reasoning for each flagged transaction.\n\nTransactions:\n${text}`;
            break;
        case 'Insurance':
            prompt = `As a fraud detection AI, analyze this insurance claim for any signs of fraud, inconsistencies, or red flags. Provide a summary of your findings.\n\nClaim:\n${text}`;
            break;
        case 'AML':
            prompt = `As an Anti-Money Laundering (AML) AI, analyze this transaction history for patterns of money laundering like structuring or layering. Summarize your findings.\n\nHistory:\n${text}`;
            break;
        case 'Identity':
            prompt = `As a security AI, analyze these account login logs for signs of identity theft or unauthorized access. Highlight any suspicious events and explain why they are risky.\n\nLogs:\n${text}`;
            break;
    }

    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return result.text;
};