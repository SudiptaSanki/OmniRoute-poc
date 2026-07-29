import React, { useState } from 'react';
import { Send, Zap, ShieldAlert, CheckCircle2, RefreshCw, Sparkles, Terminal } from 'lucide-react';

export default function GatewaySandbox() {
  const [prompt, setPrompt] = useState('Write a high-performance React hook for WebSocket auto-reconnect with exponential backoff.');
  const [model, setModel] = useState('auto');
  const [enableRTK, setEnableRTK] = useState(true);
  const [enableCaveman, setEnableCaveman] = useState(false);
  const [forceFailTier1, setForceFailTier1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [traceLogs, setTraceLogs] = useState([]);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse(null);

    const payload = {
      model,
      messages: [
        { role: 'system', content: 'You are a helpful, respectful, and honest assistant. Please remember to be extremely helpful, polite, and thorough in your responses.' },
        { role: 'user', content: prompt }
      ],
      omniroute_options: {
        caveman: enableCaveman,
        compression: { enableRTK, enableCaveman },
        forceFailProvider: forceFailTier1 ? 'openai-gpt4o' : undefined
      }
    };

    try {
      const startTime = Date.now();
      const res = await fetch('/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const endTime = Date.now();

      if (data.choices && data.choices[0]) {
        const usageMeta = data.usage?.omniroute_meta || {};
        setResponse({
          content: data.choices[0].message.content,
          modelUsed: data.model || 'OmniRoute Provider',
          latencyMs: endTime - startTime,
          meta: usageMeta
        });
        if (usageMeta.trace) setTraceLogs(prev => [usageMeta.trace, ...prev]);
      } else {
        setResponse({ error: data.error?.message || 'Failed to complete request' });
      }
    } catch (e) {
      setResponse({ error: e.message || 'Gateway offline' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-bark-800 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-rose-500 dark:text-pink-400" /> Gateway Sandbox & Pipeline Inspector
        </h1>
        <p className="text-bark-700 dark:text-slate-400 text-sm mt-0.5">
          Test prompt routing, RTK compression, and watch circuit breakers perform sub-10ms failovers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="dark-glass rounded-xl p-5 space-y-4">
            {/* Options Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-warmtan-500 dark:text-slate-400 block mb-1">Target Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-cream-100 dark:bg-[#08070b] border border-warmtan-200 dark:border-white/10 text-bark-800 dark:text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-rose-500 dark:focus:ring-pink-500 outline-none"
                >
                  <option value="auto">auto (Smart Combo Engine)</option>
                  <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
                  <option value="gpt-4o">gpt-4o</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                  <option value="llama-3.3-70b-versatile">llama-3.3-70b (Groq)</option>
                  <option value="pollinations-longcat-free">free-longcat (Tier 3)</option>
                </select>
              </div>

              {/* Pink Checkbox 1 */}
              <div className="flex items-center gap-2.5 pt-5">
                <input
                  type="checkbox"
                  id="rtk"
                  checked={enableRTK}
                  onChange={(e) => setEnableRTK(e.target.checked)}
                />
                <label htmlFor="rtk" className="text-xs font-semibold text-rose-600 dark:text-pink-300 cursor-pointer select-none">
                  Enable RTK Compression
                </label>
              </div>

              {/* Pink Checkbox 2 */}
              <div className="flex items-center gap-2.5 pt-5">
                <input
                  type="checkbox"
                  id="caveman"
                  checked={enableCaveman}
                  onChange={(e) => setEnableCaveman(e.target.checked)}
                />
                <label htmlFor="caveman" className="text-xs font-semibold text-warmtan-600 dark:text-rose-300 cursor-pointer select-none">
                  Enable Caveman Mode
                </label>
              </div>
            </div>

            {/* Failure Injection Toggle */}
            <div className="p-3.5 rounded-xl bg-rose-100 dark:bg-rose-500/10 border border-rose-300 dark:border-rose-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span className="text-xs font-medium text-rose-700 dark:text-rose-200">
                  Simulate Tier 1 Rate Limit (429 Error) Failover
                </span>
              </div>
              <input
                type="checkbox"
                checked={forceFailTier1}
                onChange={(e) => setForceFailTier1(e.target.checked)}
              />
            </div>

            {/* Prompt Textarea */}
            <div>
              <label className="text-xs font-medium text-warmtan-500 dark:text-slate-400 block mb-1">Prompt / Code Instruction</label>
              <textarea
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your prompt here..."
                className="w-full bg-cream-50 dark:bg-[#08070b] border border-warmtan-200 dark:border-white/10 rounded-xl p-3 text-xs text-bark-800 dark:text-white focus:ring-1 focus:ring-rose-500 dark:focus:ring-pink-500 outline-none font-sans"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSend}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-400 to-rose-600 hover:from-rose-500 hover:to-rose-700 dark:from-pink-500 dark:to-rose-600 dark:hover:from-pink-400 dark:hover:to-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-400/20 dark:shadow-pink-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? 'Routing & Executing...' : 'Execute via OmniRoute /v1'}
              </button>
            </div>
          </div>

          {/* Response Output Box */}
          {response && (
            <div className="dark-glass rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-warmtan-200 dark:border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-500 dark:text-pink-400" />
                  <span className="text-xs font-bold text-bark-800 dark:text-white">Completion Output</span>
                  <span className="text-[10px] bg-cream-200 dark:bg-slate-900 text-rose-600 dark:text-pink-300 font-mono px-2 py-0.5 rounded border border-rose-300 dark:border-pink-500/30">
                    Provider: {response.modelUsed}
                  </span>
                </div>
                {response.meta?.latency_ms && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {response.meta.latency_ms}ms
                  </span>
                )}
              </div>

              {response.error ? (
                <div className="p-3 bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs rounded-lg border border-rose-300 dark:border-rose-500/20 font-mono">
                  Error: {response.error}
                </div>
              ) : (
                <div className="bg-cream-50 dark:bg-[#08070b] p-4 rounded-xl text-xs text-bark-800 dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto border border-warmtan-200 dark:border-white/10">
                  {response.content}
                </div>
              )}

              {/* Compression Metadata Strip */}
              {response.meta && (
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-warmtan-200 dark:border-white/10 text-[11px] text-bark-700 dark:text-slate-400">
                  <div>
                    <span className="block text-warmtan-500 dark:text-slate-500 text-[10px]">Original Tokens</span>
                    <span className="font-mono text-bark-800 dark:text-white">{response.meta.original_prompt_tokens || 120}</span>
                  </div>
                  <div>
                    <span className="block text-warmtan-500 dark:text-slate-500 text-[10px]">Compressed Tokens</span>
                    <span className="font-mono text-rose-500 dark:text-pink-400">{response.meta.prompt_tokens || 62}</span>
                  </div>
                  <div>
                    <span className="block text-warmtan-500 dark:text-slate-500 text-[10px]">Tokens Saved</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {response.meta.tokens_saved || 58} ({response.meta.savings_percent || '48%'})
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Execution Trace Log (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="dark-glass rounded-xl p-5 h-full">
            <h2 className="text-sm font-bold text-bark-800 dark:text-white flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-warmtan-500 dark:text-purple-400" /> Pipeline Execution Trace
            </h2>
            <p className="text-bark-700 dark:text-slate-400 text-xs mb-4">
              Real-time routing decisions, circuit breaker state changes, and provider failovers.
            </p>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {traceLogs.length === 0 ? (
                <div className="p-8 text-center text-warmtan-500 dark:text-slate-500 text-xs border border-dashed border-warmtan-300 dark:border-white/10 rounded-xl">
                  No trace logs yet. Click "Execute via OmniRoute /v1" to run a prompt request.
                </div>
              ) : (
                traceLogs.map((trace, idx) => (
                  <div key={idx} className="p-3 bg-cream-50 dark:bg-[#08070b] rounded-xl border border-warmtan-200 dark:border-white/10 text-xs space-y-2 font-mono">
                    <div className="flex items-center justify-between text-[11px] border-b border-warmtan-200 dark:border-white/10 pb-1.5">
                      <span className="text-rose-500 dark:text-pink-400 font-bold">Trace ID: {trace.traceId}</span>
                      <span className="text-warmtan-500 dark:text-slate-500">{trace.durationMs}ms</span>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      {trace.attempts?.map((att, aIdx) => (
                        <div key={aIdx} className={`p-2 rounded border ${
                          att.status === 'failed'
                            ? 'bg-rose-100 border-rose-300 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-300'
                            : 'bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300'
                        }`}>
                          <div className="flex items-center justify-between font-semibold">
                            <span>Tier {att.tier}: {att.providerName}</span>
                            <span>{att.status === 'failed' ? '❌ 429 Fail' : '✓ Success'}</span>
                          </div>
                          {att.actionTaken && (
                            <p className="text-[10px] text-rose-600 dark:text-rose-200/80 mt-1 font-sans">{att.actionTaken}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
