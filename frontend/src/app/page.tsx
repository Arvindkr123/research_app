
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { apiRequest } from "@/lib/api";
import { ResearchResult } from "@/types";
import { useResearch } from "@/hooks/useResearch";
import { ResearchResultCard } from "@/components/ResearchResultCard";
import { LibraryCard } from "@/components/LibraryCard";
import { Navbar } from "@/components/layout/Navbar";
import { LibraryDrawer } from "@/components/LibraryDrawer";
import toast, { Toaster } from "react-hot-toast";

type SavedResearchResponse =
  | ResearchResult[]
  | {
      research?: ResearchResult[];
      data?: ResearchResult[];
    };

export default function ResearchPage() {
  const {
    query,
    setQuery,
    researchType,
    setResearchType,
    loading,
    result,
    error,
    performResearch,
    setResult,
  } = useResearch();

  const [savedResearch, setSavedResearch] = useState<ResearchResult[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isLibraryLoading, setIsLibraryLoading] = useState(false);

  // Fetch saved research from the backend.
  const fetchSavedResearch = useCallback(
    async (filters: Record<string, string> = {}) => {
      setIsLibraryLoading(true);

      try {
        const queryParams = new URLSearchParams(filters).toString();

        const endpoint = queryParams
          ? `/api/research/saved?${queryParams}`
          : "/api/research/saved";

        const response = await apiRequest<SavedResearchResponse>(endpoint);

        let items: ResearchResult[];

        if (Array.isArray(response)) {
          items = response;
        } else if (Array.isArray(response.research)) {
          items = response.research;
        } else if (Array.isArray(response.data)) {
          items = response.data;
        } else {
          throw new Error(
            "Unexpected response format while fetching saved research."
          );
        }

        setSavedResearch(items);
      } catch (err: unknown) {
        console.error("Failed to fetch saved research:", err);

        toast.error(
          err instanceof Error
            ? err.message
            : "Failed to load saved research."
        );
      } finally {
        setIsLibraryLoading(false);
      }
    },
    []
  );

  useEffect(() => {
  let cancelled = false;

  const loadSavedResearch = async () => {
    try {
      const queryParams = new URLSearchParams().toString();
      const endpoint = queryParams
        ? `/api/research/saved?${queryParams}`
        : "/api/research/saved";

      const response = await apiRequest<
        ResearchResult[] | {
          research?: ResearchResult[];
          data?: ResearchResult[];
        }
      >(endpoint);

      if (cancelled) return;

      if (Array.isArray(response)) {
        setSavedResearch(response);
      } else if (Array.isArray(response.research)) {
        setSavedResearch(response.research);
      } else if (Array.isArray(response.data)) {
        setSavedResearch(response.data);
      } else {
        setSavedResearch([]);
      }
    } catch (error) {
      if (!cancelled) {
        console.error("Failed to load saved research:", error);
        toast.error("Failed to load saved research.");
      }
    }
  };

  void loadSavedResearch();

  return () => {
    cancelled = true;
  };
}, []);

  // Save the current research result.
  const handleSave = async () => {
    if (!result) {
      toast.error("No research result available to save.");
      return;
    }

    const summary = result.summary ?? result.analysis ?? "";

    if (!summary.trim()) {
      toast.error("No summary or analysis available to save.");
      return;
    }

    setIsSaving(true);

    try {
      await apiRequest("/api/research", {
        method: "POST",
        body: JSON.stringify({
          query: result.query,
          summary,
          analysis: result.analysis,
          sources: result.sources ?? [],
        }),
      });

      await fetchSavedResearch();

      toast.success("Research saved to library!");
    } catch (err: unknown) {
      console.error("Failed to save research:", err);

      toast.error(
        "Failed to save research: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a saved research item.
  const handleDelete = async (id: string) => {
    if (!id) {
      toast.error("Research ID is missing.");
      return;
    }

    if (!window.confirm("Delete this saved research?")) {
      return;
    }

    try {
      await apiRequest(
        `/api/research/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );

      await fetchSavedResearch();

      toast.success("Research deleted successfully.");
    } catch (err: unknown) {
      console.error("Failed to delete research:", err);

      toast.error(
        "Failed to delete: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  // Display a previously saved research item.
  const handleViewResearch = (item: ResearchResult) => {
    setResult({
      ...item,
      summary: item.summary ?? item.analysis ?? "",
      sources: item.sources ?? [],
    });

    setQuery(item.query);
    setIsLibraryOpen(false);
  };

  return (
    <main className="flex h-screen w-full flex-col overflow-hidden bg-slate-50">
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      <Toaster position="top-right" />

      <Navbar onOpenLibrary={() => setIsLibraryOpen(true)} />

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-8 overflow-hidden p-4 lg:grid-cols-12 lg:p-8">
        {/* LEFT COLUMN: SEARCH AND RESULTS */}
        <section className="flex h-full flex-col space-y-6 overflow-hidden lg:col-span-7">
          <header className="shrink-0 space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
              Research Workspace
            </h1>

            <p className="text-sm text-slate-500 lg:text-base">
              Deep dive into companies and competitors.
            </p>
          </header>

          {/* SEARCH PANEL */}
          <div className="shrink-0 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">
            <div className="flex w-full flex-wrap gap-2 rounded-lg bg-slate-100 p-1 sm:w-fit">
              {(["general", "company", "competitors"] as const).map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setResearchType(type)}
                    disabled={loading}
                    className={`flex-1 whitespace-nowrap rounded-md px-4 py-2 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none lg:text-sm ${
                      researchType === type
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                )
              )}
            </div>

            <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 transition-colors focus-within:border-indigo-400 sm:flex-row">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !loading) {
                    void performResearch();
                  }
                }}
                placeholder={
                  researchType === "general"
                    ? "What do you want to research?"
                    : "Enter company name or research topic..."
                }
                disabled={loading}
                className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-700 outline-none disabled:opacity-60 lg:text-base"
              />

              <button
                type="button"
                onClick={() => void performResearch()}
                disabled={loading || !query.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400 sm:w-auto lg:text-base"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  "Research"
                )}
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700 lg:text-sm"
              >
                {error}
              </div>
            )}
          </div>

          {/* SCROLLABLE RESULTS */}
          <div className="custom-scrollbar flex-1 overflow-y-auto pr-2">
            {loading ? (
              <div className="flex min-h-[250px] flex-col items-center justify-center space-y-4 py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />

                <p className="font-medium text-slate-500">
                  Gathering intelligence...
                </p>
              </div>
            ) : result ? (
              <div className="animate-in space-y-6 pb-8 duration-500 fade-in slide-in-from-bottom-4">
                <ResearchResultCard
                  result={{
                    ...result,
                    summary: result.summary ?? result.analysis ?? "",
                    sources: result.sources ?? [],
                  }}
                  type={researchType}
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => void handleSave()}
                    disabled={isSaving}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving ? "Saving..." : "Save to Library"}
                  </button>
                </div>
              </div>
            ) : !error ? (
              <div className="flex min-h-[200px] h-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-4 text-center text-slate-400">
                Select a research type and enter a query to start.
              </div>
            ) : null}
          </div>
        </section>

        {/* RIGHT COLUMN: SAVED LIBRARY */}
        <aside className="hidden h-full flex-col space-y-6 overflow-hidden lg:col-span-5 lg:flex">
          <div className="flex shrink-0 items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 lg:text-2xl">
              <span>📚 My Library</span>
            </h2>

            <button
              type="button"
              onClick={() => void fetchSavedResearch()}
              disabled={isLibraryLoading}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
            >
              {isLibraryLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-2">
            {isLibraryLoading && savedResearch.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                Loading your library...
              </div>
            ) : savedResearch.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-slate-100 p-8 text-center text-slate-500">
                No saved research yet.
              </div>
            ) : (
              savedResearch.map((item, index) => (
                <LibraryCard
                  key={item._id ?? `${item.query}-${index}`}
                  item={item}
                  onDelete={handleDelete}
                  onView={handleViewResearch}
                />
              ))
            )}
          </div>
        </aside>
      </div>

      {/* LIBRARY DRAWER */}
      <LibraryDrawer
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        savedResearch={savedResearch}
        onDelete={handleDelete}
        onView={handleViewResearch}
        onFilterChange={(filters) => {
          void fetchSavedResearch(filters);
        }}
      />
    </main>
  );
}
