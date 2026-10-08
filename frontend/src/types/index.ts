export interface Source {
  title: string;
  url: string;
}

export interface ResearchResult {
  _id?: string;
  query: string;
  summary?: string;
  analysis?: string;
  sources: Source[];
  createdAt?: string;
}

export type ResearchType = 'general' | 'company' | 'competitors';
