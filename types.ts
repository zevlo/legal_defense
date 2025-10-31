
export interface Source {
  uri: string;
  title: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: Source[];
}

export interface CaseDetails {
  jurisdiction: string;
  charges: string;
  sentenceGuidelines: string;
  pleaOffer: string;
  immigrationStatus: string;
  criminalRecord: string;
}

export interface GeminiFilePart {
  inlineData: {
    data: string; // base64 string
    mimeType: string;
  };
}
