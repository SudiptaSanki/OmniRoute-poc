import React, { useState } from 'react';
import { Cpu, Sparkles } from 'lucide-react';

export default function CompressionInspector() {
  const [rawText, setRawText] = useState(`System: You are a helpful, respectful, and honest assistant. Please remember to be extremely helpful, polite, and thorough in your responses.
User: Can you write a high-performance React hook for WebSocket auto-reconnect with exponential backoff?`);
  const [compressedText, setCompressedText] = useState(`Sys:helpful,respectful,honest.Be helpful,polite,thorough.
Usr:React hook WebSocket auto-reconnect exp backoff?`);
  const [cavemanMode, setCavemanMode] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bark-800 dark:text-white flex items-center gap-2">
          <Cpu className="w-6 h-6 text-rose-500 dark:text-pink-400" /> Token Compression Pipelines
        </h1>
        <p className="text-bark-700 dark:text-slate-400 text-sm mt-0.5">
          Inspect how OmniRoute reduces token usage by 15-95% before sending to providers.
        </p>
      </div>

      <div className="dark-glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-bark-800 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-warmtan-500 dark:text-purple-400" /> RTK Compression Simulator
          </h2>
          {/* Pink Checkbox in Light Mode */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="cavemanToggle"
              checked={cavemanMode}
              onChange={(e) => setCavemanMode(e.target.checked)}
            />
            <label htmlFor="cavemanToggle" className="text-xs font-semibold text-rose-600 dark:text-pink-300 cursor-pointer">
              Enable Caveman Mode (Aggressive)
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-medium text-warmtan-500 dark:text-slate-400 block mb-2 uppercase tracking-wider">Raw Input (Uncompressed)</label>
            <textarea
              className="w-full h-48 bg-cream-50 dark:bg-[#08070b] border border-warmtan-200 dark:border-white/10 rounded-xl p-4 text-xs text-bark-800 dark:text-slate-300 font-mono focus:outline-none"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />
            <div className="mt-2 text-xs font-bold text-warmtan-500 dark:text-slate-500 font-mono">Tokens: 42</div>
          </div>
          <div>
            <label className="text-xs font-medium text-rose-500 dark:text-pink-400 block mb-2 uppercase tracking-wider">OmniRoute Output (Compressed)</label>
            <textarea
              className="w-full h-48 bg-rose-50 dark:bg-[#1a1325] border border-rose-300 dark:border-pink-500/20 rounded-xl p-4 text-xs text-rose-700 dark:text-pink-300 font-mono focus:outline-none"
              value={cavemanMode ? 'Sys:hlpful,hnst.Usr:React ws backoff hook?' : compressedText}
              readOnly
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">Tokens: {cavemanMode ? 12 : 22}</span>
              <span className="text-xs font-bold text-rose-600 dark:text-pink-400">Saved: {cavemanMode ? '71%' : '48%'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
