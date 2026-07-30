import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-xl">
        <Terminal className="w-8 h-8" />
      </div>
      <h1 className="text-6xl font-extrabold text-white tracking-tight">404</h1>
      <p className="text-lg font-semibold text-slate-300 mt-2">Page Not Found</p>
      <p className="text-xs text-slate-500 max-w-sm mt-1">
        The route you are looking for does not exist in the Python Documentation Assistant workspace.
      </p>

      <button
        onClick={() => navigate('/dashboard')}
        className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition"
      >
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </button>
    </div>
  );
};

export default NotFound;
