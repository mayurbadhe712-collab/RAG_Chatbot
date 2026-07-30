import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Settings as SettingsIcon, Cpu, Layers, ShieldCheck, Save, Check } from 'lucide-react';

const Settings = () => {
  const [model, setModel] = useState('llama-3.3-70b-versatile');
  const [chunkSize, setChunkSize] = useState(1000);
  const [chunkOverlap, setChunkOverlap] = useState(200);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-indigo-400" />
            <span>Assistant Settings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure LLM inference model, chunking parameters, and vector retrieval strategies.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* LLM Model Selection */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-400" />
              <span>LLM Engine Configuration</span>
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Selected Groq LLM Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="llama-3.3-70b-versatile">Groq Llama 3.3 70B Versatile (Recommended)</option>
                <option value="llama3-8b-8192">Groq Llama 3 8B 8192 (Fast)</option>
                <option value="mixtral-8x7b-32768">Groq Mixtral 8x7B 32768</option>
              </select>
            </div>
          </div>

          {/* Chunking & Vector DB Settings */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Document Chunking Parameters</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Chunk Size (Characters)</label>
                <input
                  type="number"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Chunk Overlap (Characters)</label>
                <input
                  type="number"
                  value={chunkOverlap}
                  onChange={(e) => setChunkOverlap(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Guardrail Policy Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-amber-300">Strict Python Guardrail Enabled</p>
              <p className="text-amber-200/80 leading-relaxed">
                Every prompt is evaluated prior to vector store lookup or LLM query execution. Questions regarding politics, sports, general knowledge, movies, or non-Python code are instantly declined with:
                <br />
                <code className="text-amber-400 font-mono text-[11px]">"I'm a Python Documentation Assistant. I can answer only Python-related questions."</code>
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default Settings;
