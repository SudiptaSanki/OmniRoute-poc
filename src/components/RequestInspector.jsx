import React, { useState, useEffect, useRef } from 'react';
import { FileSearch, Clock, ArrowDownUp, ChevronDown, ChevronRight, Copy, CheckCircle2 } from 'lucide-react';

export default function RequestInspector() {
  const [requests, setRequests] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [filter, setFilter] = useState('all');
  const intervalRef = useRef(null);

  const MOCK_ENDPOINTS = [
    '/v1/chat/completions',
    '/v1/models',
    '/v1/embeddings',
    '/v1/completions',
  ];

  const MOCK_PROVIDERS = [
    { name: 'Pollinations', free: true },
    { name: 'Groq', free: true },
    { name: 'OpenAI', free: false },
    { name: 'DeepSeek', free: true },
    { name: 'LongCat', free: true },
    { name: 'Gemini', free: false },
  ];

  const MOCK_MODELS = ['gpt-4o', 'claude-sonnet-4', 'gemini-2.5-pro', 'deepseek-v3', 'llama-3.3-70b', 'qwen-2.5-72b'];

  const generateRequest = () => {
    const endpoint = MOCK_ENDPOINTS[Math.floor(Math.random() * MOCK_ENDPOINTS.length)];
    const provider = MOCK_PROVIDERS[Math.floor(Math.random() * MOCK_PROVIDERS.length)];
    const model = MOCK_MODELS[Math.floor(Math.random() * MOCK_MODELS.length)];
    const latency = Math.floor(50 + Math.random() * 950);
    const inputTokens = Math.floor(100 + Math.random() * 5000);
    const outputTokens = Math.floor(50 + Math.random() * 2000);
    const compressedTokens = Math.floor(inputTokens * (0.3 + Math.random() * 0.4));
    const statusCode = Math.random() > 0.85 ? (Math.random() > 0.5 ? 429 : 500) : 200;
    const fallbacks = statusCode !== 200 ? Math.floor(1 + Math.random() * 3) : 0;

    return {
      id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      method: 'POST',
      endpoint,
      model,
      provider: provider.name,
      isFree: provider.free,
      statusCode,
      latency,
      inputTokens,
      outputTokens,
      compressedTokens,
      savedTokens: inputTokens - compressedTokens,
      compressionRate: ((1 - compressedTokens / inputTokens) * 100).toFixed(1),
      fallbacks,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer omni_••••••••',
        'X-OmniRoute-Provider': provider.name,
        'X-OmniRoute-Model': model,
        'X-OmniRoute-Strategy': 'priority',
        'X-OmniRoute-Compression': 'rtk+caveman',
        'X-OmniRoute-Fallbacks': String(fallbacks),
        'X-OmniRoute-Latency': `${latency}ms`,
      },
      requestBody: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'Hello, explain quantum computing briefly.' }],
        max_tokens: 500,
        temperature: 0.7,
      }, null, 2),
      responseBody: statusCode === 200 ? JSON.stringify({
        id: `chatcmpl-${Math.random().toString(36).slice(2, 10)}`,
        object: 'chat.completion',
        model,
        choices: [{
          index: 0,
          message: { role: 'assistant', content: 'Quantum computing uses qubits that can be 0, 1, or both simultaneously...' },
          finish_reason: 'stop',
        }],
        usage: { prompt_tokens: compressedTokens, completion_tokens: outputTokens, total_tokens: compressedTokens + outputTokens },
      }, null, 2) : JSON.stringify({
        error: { message: statusCode === 429 ? 'Rate limit exceeded' : 'Internal server error', type: 'error', code: statusCode },
      }, null, 2),
    };
  };

  const startRecording = () => {
    setIsRecording(true);
    intervalRef.current = setInterval(() => {
      setRequests(prev => [generateRequest(), ...prev].slice(0, 50));
    }, 1500 + Math.random() * 2000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const [copied, setCopied] = useState(false);
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const filtered = filter === 'all' ? requests
    : filter === 'success' ? requests.filter(r => r.statusCode === 200)
    : filter === 'errors' ? requests.filter(r => r.statusCode !== 200)
    : requests.filter(r => r.isFree);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <FileSearch className="w-6 h-6 text-rose-500" />
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">API Request Inspector</h3>
        <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">NOT ON OFFICIAL SITE</span>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isRecording
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
              : 'btn-primary shadow-lg shadow-rose-500/20'
          }`}>
          {isRecording ? '⏹ Stop Recording' : '⏺ Start Recording'}
        </button>

        <div className="flex gap-1.5">
          {['all', 'success', 'errors', 'free'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all ${
                filter === f
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10'
              }`}>{f}</button>
          ))}
        </div>

        <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto font-mono">{filtered.length} requests</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Request List */}
        <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
          {filtered.length === 0 && (
            <div className="text-center text-xs text-slate-400 dark:text-slate-500 py-12">
              Click "Start Recording" to simulate live API traffic through OmniRoute
            </div>
          )}
          {filtered.map((req) => (
            <button key={req.id} onClick={() => setSelectedReq(req)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                selectedReq?.id === req.id
                  ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/30'
                  : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${req.statusCode === 200 ? 'bg-emerald-500' : req.statusCode === 429 ? 'bg-amber-500' : 'bg-red-500'}`} />
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 font-mono">{req.method}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">{req.endpoint}</span>
                <span className={`text-[10px] font-bold ml-auto ${req.statusCode === 200 ? 'text-emerald-500' : 'text-red-500'}`}>{req.statusCode}</span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                <span>{req.provider}{req.isFree ? ' 🆓' : ''}</span>
                <span>{req.latency}ms</span>
                <span>{req.compressionRate}% compressed</span>
                {req.fallbacks > 0 && <span className="text-amber-500">{req.fallbacks} fallbacks</span>}
              </div>
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 overflow-hidden">
          {selectedReq ? (
            <div className="divide-y divide-slate-200 dark:divide-white/10">
              {/* Header */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                    selectedReq.statusCode === 200 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                  }`}>{selectedReq.statusCode}</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-mono">{selectedReq.method} {selectedReq.endpoint}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center p-2 rounded-lg bg-white dark:bg-white/5">
                    <p className="text-[10px] text-slate-400">Latency</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{selectedReq.latency}ms</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white dark:bg-white/5">
                    <p className="text-[10px] text-slate-400">In Tokens</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{selectedReq.compressedTokens}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white dark:bg-white/5">
                    <p className="text-[10px] text-slate-400">Out Tokens</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{selectedReq.outputTokens}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Saved</p>
                    <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">{selectedReq.savedTokens}</p>
                  </div>
                </div>
              </div>

              {/* Headers */}
              <details className="group">
                <summary className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5">
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-open:rotate-90" />
                  Response Headers ({Object.keys(selectedReq.headers).length})
                </summary>
                <div className="px-4 pb-3 space-y-1">
                  {Object.entries(selectedReq.headers).map(([k, v]) => (
                    <div key={k} className="flex gap-2 text-[11px] font-mono">
                      <span className="text-rose-500 dark:text-rose-400 font-semibold min-w-0">{k}:</span>
                      <span className="text-slate-600 dark:text-slate-300 truncate">{v}</span>
                    </div>
                  ))}
                </div>
              </details>

              {/* Request Body */}
              <details className="group">
                <summary className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5">
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-open:rotate-90" />
                  Request Body
                  <button onClick={(e) => { e.stopPropagation(); copyToClipboard(selectedReq.requestBody); }}
                    className="ml-auto text-slate-400 hover:text-rose-500">
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </summary>
                <pre className="px-4 pb-3 text-[10px] font-mono text-slate-600 dark:text-slate-300 overflow-x-auto whitespace-pre">{selectedReq.requestBody}</pre>
              </details>

              {/* Response Body */}
              <details className="group" open>
                <summary className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5">
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-open:rotate-90" />
                  Response Body
                </summary>
                <pre className="px-4 pb-3 text-[10px] font-mono text-slate-600 dark:text-slate-300 overflow-x-auto whitespace-pre">{selectedReq.responseBody}</pre>
              </details>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[300px] text-xs text-slate-400 dark:text-slate-500">
              Select a request to inspect headers, body, and routing metadata
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
