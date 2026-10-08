import { useState } from 'react';
import { apiRequest } from '@/lib/api';
import { ResearchResult, ResearchType } from '@/types';

export function useResearch() {
  const [query, setQuery] = useState('');
  const [researchType, setResearchType] = useState<ResearchType>('general');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performResearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let endpoint = '/api/research';
      if (researchType === 'company') endpoint = '/api/research/company';
      if (researchType === 'competitors') endpoint = '/api/research/competitors';

      const data = await apiRequest<ResearchResult>(`${endpoint}?q=${encodeURIComponent(query)}`);

      const normalizedResult = {
        ...data,
        summary: data.summary || data.analysis
      };

      setResult(normalizedResult);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while researching');
    } finally {
      setLoading(false);
    }
  };

  return {
    query, setQuery,
    researchType, setResearchType,
    loading, result, error,
    performResearch,
    setResult // Export setResult so the library can set the current result
  };
}
