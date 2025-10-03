export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface Entity {
  name: string;
  type: 'Company' | 'Person' | 'Ticker Symbol' | 'Product' | 'Currency' | 'Other';
  description: string;
}

export interface Analysis {
  summary: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  sentimentScore: number;
  entities: Entity[];
}

// A message can be a simple text message or a full analysis from the model.
export interface Message extends Partial<Analysis> {
  id: string;
  role: Role;
  text: string;
}

export interface Source {
  uri: string;
  title: string;
}
