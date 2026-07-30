import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <XCircle className="w-5 h-5 text-rose-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    info: <CheckCircle className="w-5 h-5 text-indigo-400" />
  };

  const borders = {
    success: 'border-emerald-500/30 bg-emerald-950/40 text-emerald-200',
    error: 'border-rose-500/30 bg-rose-950/40 text-rose-200',
    warning: 'border-amber-500/30 bg-amber-950/40 text-amber-200',
    info: 'border-indigo-500/30 bg-indigo-950/40 text-indigo-200'
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-lg shadow-xl max-w-md animate-in slide-in-from-bottom-5 transition-all ${borders[type]}`}>
      {icons[type]}
      <p className="text-xs font-medium leading-snug flex-1">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
