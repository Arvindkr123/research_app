import React from 'react';
import { ResearchResult } from '@/types';

interface Props {
  result: ResearchResult;
  type: string;
}

export function ResearchResultCard({ result, type }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-800">
            {type === 'general' ? 'AI Summary' :
             type === 'company' ? 'Company Analysis' :
             'Competitive Landscape'}
          </h2>
        </div>
        <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
          {result.summary}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-medium text-slate-700">Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {result.sources.map((source, idx) => (
            <a
              key={idx}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              <div className="font-medium text-slate-800 group-hover:text-indigo-700 line-clamp-1">
                {source.title}
              </div>
              <div className="text-xs text-slate-400 truncate">{source.url}</div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
