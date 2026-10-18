
import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { ResearchResult, ResearchType } from "@/types";

export function useResearch() {
  const [query, setQuery] = useState("");
  const [researchType, setResearchType] =
    useState<ResearchType>("general");
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<ResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performResearch = async () => {
    if (!query.trim()) {
      setError("Please enter a research query.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoints: Record<ResearchType, string> = {
        general: "/api/research",
        company: "/api/research/company",
        competitors: "/api/research/competitors",
      };

      const endpoint =
        `${endpoints[researchType]}?q=${encodeURIComponent(query.trim())}`;

      const data = await apiRequest<ResearchResult>(endpoint);

      // Support common response wrappers, if your backend uses one.
      const payload = (
        data as ResearchResult & {
          data?: ResearchResult;
          result?: ResearchResult;
        }
      ).data
        ?? (data as ResearchResult & {
          result?: ResearchResult;
        }).result
        ?? data;

      const normalizedResult: ResearchResult = {
        ...payload,
        summary: payload.summary || payload.analysis || "",
        sources: payload.sources || [],
      };

      setResult(normalizedResult);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while researching."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    query,
    setQuery,
    researchType,
    setResearchType,
    loading,
    result,
    error,
    performResearch,
    setResult,
  };
}
