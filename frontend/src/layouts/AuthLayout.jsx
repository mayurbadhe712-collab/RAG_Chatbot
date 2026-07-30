import React from 'react';
import { Terminal, ShieldCheck } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-fast" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 p-[2px] shadow-xl shadow-indigo-500/20 mb-2">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Terminal className="w-7 h-7 text-amber-400" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">{title}</h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">{subtitle}</p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold mt-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Strictly Answers Python Queries Only</span>
          </div>
        </div>

        {/* Card Container */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800/80">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
