import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import FileUploader from '../components/documents/FileUploader';
import documentService from '../services/documentService';
import { FileText, Trash2, Database, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const UploadPDF = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await documentService.deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error("Delete document error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Python PDF Documents</h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload Python documentation PDFs to enrich the RAG knowledge base. All uploaded documents are automatically chunked and indexed into ChromaDB.
          </p>
        </div>

        {/* Upload Dropzone */}
        <div className="glass-panel p-6 rounded-3xl">
          <FileUploader onUploadSuccess={() => fetchDocuments()} />
        </div>

        {/* Uploaded Documents Management Section */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              <span>Indexed Vector Store Documents ({documents.length})</span>
            </h2>
            <button
              onClick={fetchDocuments}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Refresh List"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <LoadingSpinner label="Fetching indexed document records..." />
          ) : documents.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-400 text-xs">
              No Python PDF documents stored yet. Upload a PDF above to enable custom RAG retrieval!
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-4 transition hover:border-slate-700"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-200 truncate">{doc.filename}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                        <span>{(doc.file_size / (1024 * 1024)).toFixed(2)} MB</span>
                        <span>•</span>
                        <span className="text-indigo-400 font-medium">{doc.chunk_count} vector chunks</span>
                        <span>•</span>
                        <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                      <CheckCircle className="w-3 h-3" />
                      Ready in ChromaDB
                    </span>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      disabled={deletingId === doc.id}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-transparent hover:border-rose-500/20 transition disabled:opacity-50"
                      title="Delete document and vector embeddings"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default UploadPDF;
