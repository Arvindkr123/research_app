import React from 'react';
import { ResearchResult } from '@/types';

interface Props {
  item: ResearchResult;
  onDelete: (id: string) => void;
  onView: (item: ResearchResult) => void;
}

export function LibraryCard({ item, onDelete, onView }: Props) {
  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3 hover:border-indigo-300 transition-all group">
      <div className="flex justify-between items-start gap-2">
        <h4 className="font-semibold text-slate-800 line-clamp-2">{item.query}</h4>
        <button
          onClick={() => onDelete(item._id!)}
          className="text-slate-400 hover:text-red-500 p-1 transition-colors"
          title="Delete"
        >
          ✕
        </button>
      </div>
      <p className="text-sm text-slate-600 line-clamp-3">{item.summary}</p>
      <div className="flex justify-between items-center pt-2">
        <span className="text-[10px] text-slate-400">
          {new Date(item.createdAt!).toLocaleDateString()}
        </span>
        <button
          onClick={() => onView(item)}
          className="text-xs text-indigo-600 font-medium hover:underline"
        >
          View Full
        </button>
      </div>
    </div>
  );
}
