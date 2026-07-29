import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, ShieldAlert, RefreshCw, CheckCircle2, RotateCcw } from 'lucide-react';

export default function ProviderManager() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/v1/providers');
      const data = await res.json();
      setProviders(data.providers || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const resetCircuitBreakers = async () => {
    await fetch('/v1/providers/reset-breakers', { method: 'POST' });
    fetchProviders();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-bark-800 dark:text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-warmtan-500 dark:text-purple-400" /> Provider Hub & Tiers
          </h1>
          <p className="text-bark-700 dark:text-slate-400 text-sm mt-0.5">
            Manage the 268+ aggregated AI providers, API keys, and circuit breaker health statuses.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetCircuitBreakers}
            className="px-3 py-1.5 rounded-lg bg-warmtan-200 hover:bg-warmtan-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-bark-800 dark:text-white text-xs font-medium transition-colors flex items-center gap-2 border border-warmtan-300 dark:border-white/10"
          >
            <RotateCcw className="w-3.5 h-3.5 text-warmtan-600 dark:text-slate-400" /> Reset Breakers
          </button>
          <button
            onClick={fetchProviders}
            className="p-1.5 rounded-lg bg-cream-200 hover:bg-cream-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-bark-700 dark:text-slate-300 transition-colors border border-warmtan-200 dark:border-white/10"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {providers.length > 0 ? (
          providers.map((p) => (
            <div key={p.id} className="dark-glass rounded-xl p-5 border border-warmtan-200 dark:border-white/10">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {p.breakerState === 'closed' ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                  )}
                  <h3 className="text-sm font-bold text-bark-800 dark:text-white">{p.name}</h3>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                  p.tier === 1 ? 'bg-rose-100 text-rose-600 dark:bg-pink-500/20 dark:text-pink-300' :
                  p.tier === 2 ? 'bg-warmtan-200 text-warmtan-600 dark:bg-purple-500/20 dark:text-purple-300' :
                  'bg-cream-200 text-warmtan-500 dark:bg-amber-500/20 dark:text-amber-300'
                }`}>
                  Tier {p.tier}
                </span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-bark-700 dark:text-slate-400">
                  <span>Models:</span>
                  <span className="font-medium text-bark-800 dark:text-white">{p.modelsCount} available</span>
                </div>
                <div className="flex justify-between text-bark-700 dark:text-slate-400">
                  <span>Latency:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">{p.avgLatency}ms</span>
                </div>
                <div className="flex justify-between text-bark-700 dark:text-slate-400">
                  <span>Status:</span>
                  <span className={`font-semibold ${p.breakerState === 'closed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {p.breakerState === 'closed' ? 'Healthy' : 'Circuit Open (Failing)'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 text-center text-warmtan-500 dark:text-slate-500 bg-cream-50 dark:bg-[#13111a] rounded-xl border border-warmtan-200 dark:border-white/10">
            No providers loaded.
          </div>
        )}
      </div>
    </div>
  );
}
