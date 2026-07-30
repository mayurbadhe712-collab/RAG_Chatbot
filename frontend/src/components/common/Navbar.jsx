import React from 'react';
import { Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
      {/* Brand */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/chat')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 p-[2px]">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Terminal className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-base leading-tight tracking-wide">
              PyDoc
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
