import React from 'react';

interface NavbarProps {
  onOpenLibrary?: () => void;
}

export function Navbar({ onOpenLibrary }: NavbarProps) {
  return (
    <nav className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
          R
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">
          Research AI
        </span>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        {/* Mobile Library Trigger */}
        {onOpenLibrary && (
          <button
            onClick={onOpenLibrary}
            className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors border border-indigo-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            Library
          </button>
        )}
      </div>
    </nav>
  );
}
