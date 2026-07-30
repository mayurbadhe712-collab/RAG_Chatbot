import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import documentService from '../../services/documentService';

const FileUploader = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file) => {
    setStatusMessage(null);
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setStatusMessage({ type: 'error', text: 'Invalid file type. Only PDF documents are allowed.' });
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setStatusMessage({ type: 'error', text: 'File size exceeds 25MB maximum limit.' });
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setProgress(0);
    setStatusMessage({ type: 'info', text: 'Parsing PDF & generating ChromaDB vector embeddings...' });

    try {
      const data = await documentService.uploadPDF(selectedFile, (pct) => {
        setProgress(pct);
      });
      setStatusMessage({ type: 'success', text: 'PDF uploaded and vector embeddings indexed successfully!' });
      setSelectedFile(null);
      if (onUploadSuccess) onUploadSuccess(data.document);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to process and index PDF.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Drag and Drop Container */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div>
            <p className="text-base font-semibold text-slate-200">
              Click to upload or drag & drop Python PDF
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports Python Documentation, Cheatsheets, PEPs & Specs (Max 25MB)
            </p>
          </div>
        </div>
      </div>

      {/* Selected File Preview & Upload Action */}
      {selectedFile && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200 truncate max-w-xs">{selectedFile.name}</p>
              <p className="text-xs text-slate-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
              disabled={uploading}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              title="Remove File"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }}
              disabled={uploading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Upload & Index</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Upload Progress Bar */}
      {uploading && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>Uploading & Chunking Text...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Status Alert Banner */}
      {statusMessage && (
        <div className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2.5 ${
          statusMessage.type === 'success'
            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
            : statusMessage.type === 'error'
            ? 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300'
        }`}>
          {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />}
          {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />}
          {statusMessage.type === 'info' && <Loader2 className="w-4 h-4 shrink-0 animate-spin text-indigo-400" />}
          <span>{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
