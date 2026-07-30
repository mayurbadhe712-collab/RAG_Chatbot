import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import documentService from '../services/documentService';
import chatService from '../services/chatService';
import { MessageSquare, Upload, FileText, Database, ShieldAlert, ArrowRight, Sparkles, Terminal } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsData, historyData] = await Promise.all([
          documentService.getDocuments(),
          chatService.getHistory()
        ]);
        setDocuments(docsData);
        setHistory(historyData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalChunks = documents.reduce((acc, doc) => acc + doc.chunk_count, 0);
  const totalQueries = history.length;
  const nonPythonIntercepts = history.filter(h => h.is_python_query === false).length;

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner label="Loading Dashboard Metrics..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="relative p-8 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/20 shadow-2xl overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Python RAG Ecosystem Active</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Hello, {user?.full_name || 'Python Developer'}! 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Welcome to your dedicated Python Documentation RAG Assistant. Upload Python PDFs, search standard libraries, and query code logic grounded strictly in official docs.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => navigate('/chat')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Launch Assistant</span>
              </button>
              <button
                onClick={() => navigate('/upload')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Upload Python PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Uploaded PDFs</span>
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-2xl font-bold text-slate-100">{documents.length}</p>
            <p className="text-[11px] text-slate-500">Python Documentation Files</p>
          </div>

          <div className="glass-card p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">ChromaDB Chunks</span>
              <Database className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-slate-100">{totalChunks}</p>
            <p className="text-[11px] text-slate-500">Indexed Vector Chunks</p>
          </div>

          <div className="glass-card p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Total RAG Queries</span>
              <Terminal className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-slate-100">{totalQueries}</p>
            <p className="text-[11px] text-slate-500">Processed Assistant Interactions</p>
          </div>

          <div className="glass-card p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Non-Python Intercepts</span>
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <p className="text-2xl font-bold text-slate-100">{nonPythonIntercepts}</p>
            <p className="text-[11px] text-slate-500">Blocked Unrelated Requests</p>
          </div>
        </div>

        {/* Content Section: Documents & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Python Documentation */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>Active Python PDFs</span>
              </h2>
              <button
                onClick={() => navigate('/upload')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {documents.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl space-y-2">
                <p className="text-xs text-slate-400">No Python documentation uploaded yet.</p>
                <button
                  onClick={() => navigate('/upload')}
                  className="px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold"
                >
                  Upload First PDF
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {documents.slice(0, 4).map((doc) => (
                  <div key={doc.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                        PDF
                      </div>
                      <div>
                        <p className="font-semibold text-slate-200 truncate max-w-[200px]">{doc.filename}</p>
                        <p className="text-[11px] text-slate-500">{(doc.file_size / (1024 * 1024)).toFixed(2)} MB • {doc.chunk_count} chunks</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                      Indexed
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Query History */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-400" />
                <span>Recent Conversations</span>
              </h2>
              <button
                onClick={() => navigate('/history')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>View History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {history.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl space-y-2">
                <p className="text-xs text-slate-400">No recent queries found.</p>
                <button
                  onClick={() => navigate('/chat')}
                  className="px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold"
                >
                  Start First Chat
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {history.slice(-4).reverse().map((item) => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-300 font-semibold">
                      <span className="truncate max-w-[240px]">Q: {item.prompt}</span>
                      {item.is_python_query === false ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                          Declined
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px]">
                          Answered
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-[11px] truncate">{item.response}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
