import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Code2, CornerDownLeft } from 'lucide-react';

const ChatInput = ({ onSendMessage, onClearChat, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto w-full">
      <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-2xl transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask any Python question or inquire about uploaded Python docs..."
          rows={1}
          disabled={disabled}
          className="w-full bg-transparent px-4 py-3.5 pr-24 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none min-h-[52px] max-h-[150px]"
        />

        {/* Action Controls */}
        <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">
          {onClearChat && (
            <button
              type="button"
              onClick={onClearChat}
              disabled={disabled}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              title="Clear Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className={`p-2 rounded-xl flex items-center justify-center transition-all ${
              input.trim() && !disabled
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-end px-2 mt-2 text-[11px] text-slate-500 font-medium">
        <span className="flex items-center gap-1 hidden sm:flex">
          Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">Enter ↵</kbd> to send
        </span>
      </div>
    </form>
  );
};

export default ChatInput;
