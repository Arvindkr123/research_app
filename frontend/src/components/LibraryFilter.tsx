'use client';
import React, { useState } from 'react';

interface LibraryFilterProps {
  onFilterChange: (filters: { tag?: string; folder?: string }) => void;
}

export default function LibraryFilter({ onFilterChange }: LibraryFilterProps) {
  const [tag, setTag] = useState('');
  const [folder, setFolder] = useState('');

  const handleApply = () => {
    onFilterChange({ tag: tag || undefined, folder: folder || undefined });
  };

  const handleClear = () => {
    setTag('');
    setFolder('');
    onFilterChange({});
  };

  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Filter by Tag</label>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter tag..."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Filter by Folder</label>
          <input
            type="text"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter folder name..."
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="flex-1 py-2 text-xs font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClear}
          className="px-3 py-2 text-xs font-medium bg-white border border-slate-300 text-slate-600 rounded-md hover:bg-slate-50 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
