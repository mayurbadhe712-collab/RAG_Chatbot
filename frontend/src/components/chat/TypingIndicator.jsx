import React from 'react';
import { Terminal } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex gap-3 max-w-4xl mr-auto mb-6">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 p-[2px] shadow-md shrink-0">
        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
          <Terminal className="w-4 h-4 text-indigo-400 animate-pulse" />
        </div>
      </div>

      <div className="px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 rounded-tl-none flex items-center gap-1.5 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></span>
        <span className="text-xs text-slate-400 ml-2 font-medium">Analyzing Python docs & generating response...</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
