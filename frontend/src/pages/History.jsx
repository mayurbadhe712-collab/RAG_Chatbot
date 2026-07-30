import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import chatService from '../services/chatService';
import MarkdownRenderer from '../components/chat/MarkdownRenderer';
import CitationDrawer from '../components/chat/CitationDrawer';
import { History as HistoryIcon, Search, Trash2, ShieldAlert, Terminal, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const History = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await chatService.getHistory();
      setHistory(data);
    } catch (err) {
      console.error("Failed to load chat history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to clear all chat history?")) {
      try {
        await chatService.clearHistory();
        setHistory([]);
      } catch (err) {
        console.error("Failed to clear history:", err);
      }
    }
  };

  const filteredHistory = history.filter((item) =>
    item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <HistoryIcon className="w-6 h-6 text-indigo-400" />
              <span>Conversation Logs</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete chronological transcript of past Python queries and assistant responses.
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition self-start sm:self-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversation history by keyword..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3 pl-11 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* History List */}
        {loading ? (
          <LoadingSpinner label="Loading conversation history logs..." />
        ) : filteredHistory.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-800 rounded-3xl text-slate-400 text-xs">
            {searchTerm ? "No matching queries found for your search term." : "No conversation history logged yet."}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.slice().reverse().map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className="glass-panel p-5 rounded-2xl space-y-3 transition hover:border-slate-700"
                >
                  {/* Query Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 font-bold">
                        Q
                      </div>
                      <h3 className="text-sm font-semibold text-slate-100">{item.prompt}</h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.is_python_query === false ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold">
                          <ShieldAlert className="w-3 h-3" />
                          Declined Non-Python
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-semibold">
                          <Terminal className="w-3 h-3" />
                          Python RAG
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500">
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Response Body */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                    <MarkdownRenderer content={item.response} />
                  </div>

                  {/* Sources Toggle */}
                  {item.sources && item.sources.length > 0 && (
                    <div>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="flex items-center gap-1 text-xs text-indigo-400 font-medium hover:underline"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{item.sources.length} Context Sources</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      {isExpanded && <CitationDrawer sources={item.sources} />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default History;
