export type MessageType = 'sms' | 'email';
export type Relationship = 'friend' | 'coworker' | 'other';
export type Sentiment = 'positive' | 'neutral' | 'negative' | 'confrontational';
export type ColorCode = 'green' | 'yellow' | 'red';

export interface AnalysisRequest {
  messageText: string;
  messageType: MessageType;
  relationship: Relationship;
  additionalContext?: string;
}

export interface SuggestedResponses {
  professional: string;
  friendly: string;
  casual: string;
  diplomatic: string;
}

export interface AnalysisResult {
  sentiment: Sentiment;
  colorCode: ColorCode;
  toneAnalysis: string;
  impliedMeanings: string[];
  suggestedResponses: SuggestedResponses;
}
