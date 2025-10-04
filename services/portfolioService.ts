import { Holding } from '../types';

const PORTFOLIO_STORAGE_KEY = 'finai-portfolio';

export const getHoldings = (): Holding[] => {
    try {
        const holdingsJson = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
        return holdingsJson ? JSON.parse(holdingsJson) : [];
    } catch (error) {
        console.error("Failed to parse holdings from localStorage", error);
        return [];
    }
};

export const saveHoldings = (holdings: Holding[]): void => {
    try {
        localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(holdings));
    } catch (error) {
        console.error("Failed to save holdings to localStorage", error);
    }
};

export const addHolding = (newHolding: Holding): Holding[] => {
    const currentHoldings = getHoldings();
    
    // Check if holding for the same symbol already exists
    const existingHoldingIndex = currentHoldings.findIndex(h => h.symbol === newHolding.symbol);

    if (existingHoldingIndex > -1) {
        // Update existing holding
        const existingHolding = currentHoldings[existingHoldingIndex];
        existingHolding.shares += newHolding.shares;
        existingHolding.price = newHolding.price; // Update to latest price
        existingHolding.dayChange = newHolding.dayChange; // Update to latest change
        existingHolding.value = existingHolding.shares * existingHolding.price;
        currentHoldings[existingHoldingIndex] = existingHolding;
    } else {
        // Add new holding
        currentHoldings.push(newHolding);
    }

    saveHoldings(currentHoldings);
    return currentHoldings;
};

export const removeHolding = (holdingId: string): Holding[] => {
    let currentHoldings = getHoldings();
    currentHoldings = currentHoldings.filter(h => h.id !== holdingId);
    saveHoldings(currentHoldings);
    return currentHoldings;
};
