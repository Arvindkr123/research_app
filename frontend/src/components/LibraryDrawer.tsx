import React from 'react';
import { ResearchResult } from '@/types';
import { LibraryCard } from './LibraryCard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  savedResearch: ResearchResult[];
  onDelete: (id: string) => void;
  onView: (item: ResearchResult) => void;
}

export function LibraryDrawer({ isOpen, onClose, savedResearch, onDelete, onView }: Props) {
  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>📚 My Library</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {savedResearch.length === 0 ? (
              <div className="text-center p-8 text-slate-500">
                No saved research yet.
              </div>
            ) : (
              savedResearch.map((item) => (
                <LibraryCard
                  key={item._id}
                  item={item}
                  onDelete={onDelete}
                  onView={onView}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
