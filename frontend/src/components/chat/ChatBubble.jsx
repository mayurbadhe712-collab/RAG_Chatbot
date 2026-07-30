import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import CitationDrawer from './CitationDrawer';
import { User, Terminal, Copy, Check, RotateCcw, AlertCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const ChatBubble = ({ message, onRegenerate }) => {
  const isUser = message.sender === 'user';
  const [copied, setCopied] = useState(false);
  const [showSources, setShowSources] = useState(false);

  const handleCopyText = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`flex gap-3 max-w-4xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'} mb-6 group`}>
      {/* Avatar */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
        isUser
          ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white'
          : message.is_python_query === false
          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          : 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 p-[2px]'
      }`}>
        {isUser ? (
          <User className="w-5 h-5" />
        ) : (
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Terminal className={`w-4 h-4 ${message.is_python_query === false ? 'text-amber-400' : 'text-indigo-400'}`} />
          </div>
        )}
      </div>

      {/* Bubble Content */}
      <div className={`flex flex-col gap-1.5 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-md ${
          isUser
            ? 'bg-indigo-600 text-white rounded-tr-none'
            : message.is_python_query === false
            ? 'bg-amber-950/40 border border-amber-500/30 text-amber-200 rounded-tl-none'
            : 'bg-slate-900/80 border border-slate-800 text-slate-100 rounded-tl-none'
        }`}>
          {/* Refusal Notice */}
          {!isUser && message.is_python_query === false && (
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-500/20 text-xs font-semibold text-amber-400">
              <AlertCircle className="w-4 h-4" />
              <span>Non-Python Intent Intercepted</span>
            </div>
          )}

          {/* Text / Markdown */}
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.text}</p>
          ) : (
            <MarkdownRenderer content={message.text} />
          )}
        </div>

        {/* Source Citations Drawer Toggle (for RAG responses) */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="w-full mt-1">
            <button
              onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-xs text-indigo-400 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{message.sources.length} Retrieved Source Chunks</span>
              {showSources ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showSources && <CitationDrawer sources={message.sources} />}
          </div>
        )}

        {/* Message Footer Actions & Timestamp */}
        <div className="flex items-center gap-2 px-1 text-[11px] text-slate-500">
          <span>{formattedTime}</span>
          {!isUser && (
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopyText}
                className="hover:text-slate-300 transition"
                title="Copy Message"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              {onRegenerate && (
                <button
                  onClick={() => onRegenerate(message.prompt)}
                  className="hover:text-slate-300 transition"
                  title="Regenerate Answer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
