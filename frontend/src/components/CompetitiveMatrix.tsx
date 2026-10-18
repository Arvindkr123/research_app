'use client';
import React from 'react';

interface Competitor {
  name: string;
  strengths: string[];
  weaknesses: string[];
  gap: string;
}

interface CompetitiveMatrixProps {
  data: Competitor[];
}

export default function CompetitiveMatrix({ data }: CompetitiveMatrixProps) {
  if (!data || data.length === 0) {
    return <div className="text-slate-500 text-sm italic">No structured competitor data available.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
          <tr>
            <th className="px-4 py-3">Competitor</th>
            <th className="px-4 py-3">Strengths</th>
            <th className="px-4 py-3">Weaknesses</th>
            <th className="px-4 py-3">Market Gap</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((comp, idx) => (
            <tr key={idx} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-4 font-semibold text-slate-800">{comp.name}</td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-1">
                  {comp.strengths.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-1">
                  {comp.weaknesses.map((w, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-medium">
                      {w}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-4 text-slate-600 italic">{comp.gap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
