"use client";

import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import { ResearchResult, ResearchType } from '@/types';
import { useResearch } from '@/hooks/useResearch';
import { ResearchResultCard } from '@/components/ResearchResultCard';
import { LibraryCard } from '@/components/LibraryCard';
import { Navbar } from '@/components/layout/Navbar';
import { LibraryDrawer } from '@/components/LibraryDrawer';
import toast, { Toaster } from 'react-hot-toast';

export default function ResearchPage() {
  const {
    query, setQuery,
    researchType, setResearchType,
    loading, result, error,
    performResearch,
    setResult
  } = useResearch();

  const [savedResearch, setSavedResearch] = useState<ResearchResult[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  useEffect(() => {
    fetchSavedResearch();
  }, []);

  const fetchSavedResearch = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ? `/api/research/saved?${queryParams}` : '/api/research/saved';
      const response = await apiRequest(endpoint);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setSavedResearch(data);
      } else if (data && typeof data === 'object' && 'research' in data && Array.isArray((data as any).research)) {
        setSavedResearch((data as any).research);
      } else {
        console.error('Expected array of research results, but received:', data);
        setSavedResearch([]);
      }
    } catch (err) {
      console.error('Failed to fetch saved research:', err);
      setSavedResearch([]);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setIsSaving(true);
    try {
      await apiRequest('/api/research', {
        method: 'POST',
        body: JSON.stringify({
          query: result.query,
          summary: result.summary,
          sources: result.sources,
        }),
      });
      await fetchSavedResearch();
      toast.success('Research saved to library!');
    } catch (err: any) {
      toast.error('Failed to save research: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this saved research?')) return;
    try {
      await apiRequest(`/api/research/${id}`, { method: 'DELETE' });
      await fetchSavedResearch();
      toast.success('Research deleted');
    } catch (err: any) {
      toast.error('Failed to delete: ' + err.message);
    }
  };

  const handleViewResearch = (item: ResearchResult) => {
    setResult(item);
    setIsLibraryOpen(false);
  };

  return (
    <main className="h-screen w-full bg-slate-50 overflow-hidden flex flex-col">
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

      <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 lg:p-8 overflow-hidden">

        {/* LEFT COLUMN: SEARCH & RESULTS */}
        <div className="lg:col-span-7 h-full flex flex-col space-y-6 overflow-hidden">
          <header className="space-y-2 flex-shrink-0">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
              Research Workspace
            </h1>
            <p className="text-sm lg:text-base text-slate-500">
              Deep dive into companies and competitors.
            </p>
          </header>

          <div className="space-y-4 bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200 flex-shrink-0">
            <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-lg w-full sm:w-fit">
              {(['general', 'company', 'competitors'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setResearchType(type)}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
                    researchType === type
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-indigo-400 transition-colors">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && performResearch()}
                placeholder={
                  researchType === 'general' ? "What do you want to research?" :
                  researchType === 'company' ? "Enter company name..." :
                  "Enter company name..."
                }
                className="flex-1 px-4 py-2 bg-transparent outline-none text-slate-700 text-sm lg:text-base"
              />
              <button
                onClick={performResearch}
                disabled={loading}
                className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm lg:text-base font-medium hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  'Research'
                )}
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs lg:text-sm font-medium">
                {error}
              </div>
            )}
          </div>

          {/* RESULT AREA - SCROLLABLE */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
            {result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
                <ResearchResultCard
                  result={result}
                  type={researchType}
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-all font-medium"
                  >
                    {isSaving ? 'Saving...' : 'Save to Library'}
                  </button>
                </div>
              </div>
            )}

            {!result && !loading && !error && (
              <div className="h-full min-h-[200px] border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-center p-4">
                Select a research type and enter a query to start
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center space-y-4 py-20">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Gathering intelligence...</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SCROLLABLE LIBRARY - HIDDEN ON MOBILE */}
        <div className="hidden lg:flex lg:col-span-5 h-full flex flex-col space-y-6 overflow-hidden">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-800 flex items-center gap-2 flex-shrink-0">
            <span>📚 My Library</span>
          </h2>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {savedResearch.length === 0 ? (
              <div className="text-center p-8 bg-slate-100 rounded-xl border border-slate-200 text-slate-500">
                No saved research yet.
              </div>
            ) : (
              savedResearch.map((item) => (
                <LibraryCard
                  key={item._id}
                  item={item}
                  onDelete={handleDelete}
                  onView={handleViewResearch}
                />
              ))
            )}
          </div>
        </div>

      </div>

      <LibraryDrawer
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        savedResearch={savedResearch}
        onDelete={handleDelete}
        onView={handleViewResearch}
        onFilterChange={(filters) => fetchSavedResearch(filters)}
      />
    </main>
  );
}
