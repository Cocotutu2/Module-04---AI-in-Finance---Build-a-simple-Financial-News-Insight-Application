export enum Role {
  USER = 'user',
  AI = 'ai',
}

export interface Entity {
  name: string;
  type: 'Company' | 'Person' | 'Ticker Symbol' | 'Product' | 'Currency' | 'Other';
  description: string;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  sentiment?: 'Positive' | 'Negative' | 'Neutral';
  sentimentScore?: number;
  entities?: Entity[];
}

// FIX: Add missing Source type definition.
export interface Source {
  uri: string;
  title: string;
}
