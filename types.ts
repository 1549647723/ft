export interface Candidate {
  id: number;
  name: string;
  votes: number;
  image: string;
  color: string;
}

export interface CheerMessage {
  id: string;
  candidateName: string;
  message: string;
  timestamp: Date;
}

export enum GeminiModel {
  FLASH = 'gemini-2.5-flash',
}