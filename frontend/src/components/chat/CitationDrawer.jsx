import React from 'react';
import { FileText, Bookmark } from 'lucide-react';

const CitationDrawer = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-2 space-y-2 max-w-2xl animate-in fade-in slide-in-from-top-2">
      {sources.map((src, idx) => (
        <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
          <div className="flex items-center justify-between text-indigo-300 font-medium">
            <span className="flex items-center gap-1.5 truncate">
              <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              {src.filename || 'Python Document'}
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/10 text-[10px] text-indigo-400 border border-indigo-500/20">
              <Bookmark className="w-3 h-3" />
              Page {src.page} • Chunk #{src.chunk_index}
            </span>
          </div>
          <p className="text-slate-400 text-[11px] font-mono leading-relaxed bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
            "{src.text_snippet}"
          </p>
        </div>
      ))}
    </div>
  );
};

export default CitationDrawer;
