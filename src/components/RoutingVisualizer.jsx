import React, { useState, useEffect, useRef } from 'react';
import { Activity, Zap, ShieldAlert, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

const PROVIDERS = [
  { id: 'claude-sub', name: 'Claude (Subscription)', tier: 1, color: '#f97316', latency: 12, free: false },
  { id: 'openai-key', name: 'OpenAI (API Key)', tier: 2, color: '#3b82f6', latency: 45, free: false },
  { id: 'gemini-key', name: 'Gemini (API Key)', tier: 2, color: '#8b5cf6', latency: 38, free: false },
  { id: 'groq-free', name: 'Groq (Free Tier)', tier: 3, color: '#ec4899', latency: 22, free: true },
  { id: 'deepseek-free', name: 'DeepSeek (Free)', tier: 3, color: '#06b6d4', latency: 65, free: true },
  { id: 'pollinations', name: 'Pollinations (Free Forever)', tier: 4, color: '#10b981', latency: 90, free: true },
  { id: 'longcat', name: 'LongCat (Free Forever)', tier: 4, color: '#84cc16', latency: 110, free: true },
];

const STRATEGIES = [
  { id: 'priority', name: 'Priority (Tier 1→4)', desc: 'Uses highest-tier provider first, falls back down.' },
  { id: 'cost-opt', name: 'Cost Optimized', desc: 'Routes to cheapest available provider that can serve.' },
  { id: 'latency', name: 'Lowest Latency', desc: 'Picks provider with fastest recent response time.' },
  { id: 'round-robin', name: 'Round Robin', desc: 'Distributes requests evenly across healthy providers.' },
  { id: 'free-first', name: 'Free-First Drain', desc: 'Uses free tiers first, paid only when exhausted.' },
];

export default function RoutingVisualizer() {
  const [strategy, setStrategy] = useState(STRATEGIES[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [steps, setSteps] = useState([]);
  const [providers, setProviders] = useState(PROVIDERS.map(p => ({ ...p, status: 'healthy', requests: 0 })));
  const [finalResult, setFinalResult] = useState(null);
  const intervalRef = useRef(null);

  const simulateRouting = () => {
    setIsAnimating(true);
    setSteps([]);
    setFinalResult(null);

    const newProviders = PROVIDERS.map(p => ({
      ...p,
      status: Math.random() > 0.65 ? 'healthy' : (Math.random() > 0.5 ? 'rate-limited' : 'circuit-open'),
      requests: Math.floor(Math.random() * 200),
    }));
    setProviders(newProviders);

    let ordered;
    switch (strategy.id) {
      case 'cost-opt':
        ordered = [...newProviders].sort((a, b) => (a.free === b.free ? a.latency - b.latency : (a.free ? -1 : 1)));
        break;
      case 'latency':
        ordered = [...newProviders].sort((a, b) => a.latency - b.latency);
        break;
      case 'round-robin':
        ordered = [...newProviders].sort((a, b) => a.requests - b.requests);
        break;
      case 'free-first':
        ordered = [...newProviders].sort((a, b) => (a.free === b.free ? a.tier - b.tier : (a.free ? -1 : 1)));
        break;
      default:
        ordered = [...newProviders].sort((a, b) => a.tier - b.tier);
    }

    let stepIdx = 0;
    const animate = () => {
      if (stepIdx >= ordered.length) {
        setIsAnimating(false);
        setFinalResult({ status: 'exhausted', message: 'All providers exhausted — retry with backoff' });
        return;
      }

      const provider = ordered[stepIdx];
      const isHealthy = provider.status === 'healthy';

      setSteps(prev => [...prev, {
        provider: provider.name,
        tier: provider.tier,
        color: provider.color,
        status: provider.status,
        latency: provider.latency,
        accepted: isHealthy,
        timestamp: Date.now(),
      }]);

      if (isHealthy) {
        setIsAnimating(false);
        setFinalResult({
          status: 'success',
          provider: provider.name,
          latency: provider.latency,
          tier: provider.tier,
          message: `✓ Routed to ${provider.name} in ${provider.latency}ms`
        });
        return;
      }

      stepIdx++;
      setTimeout(animate, 600);
    };

    setTimeout(animate, 400);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Activity className="w-6 h-6 text-rose-500" />
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Live Routing Visualizer</h3>
        <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">NOT ON OFFICIAL SITE</span>
      </div>

      {/* Strategy Selector */}
      <div className="flex flex-wrap gap-2">
        {STRATEGIES.map((s) => (
          <button
            key={s.id}
            onClick={() => { setStrategy(s); setSteps([]); setFinalResult(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              strategy.id === s.id
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 italic">{strategy.desc}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Provider Status Panel */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Provider Health</p>
          {providers.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                backgroundColor: p.status === 'healthy' ? '#10b981' : p.status === 'rate-limited' ? '#f59e0b' : '#ef4444'
              }} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">{p.name}</p>
                <p className="text-[10px] text-slate-400">Tier {p.tier} • {p.latency}ms • {p.requests} reqs</p>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                p.status === 'healthy' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                p.status === 'rate-limited' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' :
                'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
              }`}>
                {p.status === 'healthy' ? 'HEALTHY' : p.status === 'rate-limited' ? 'RATE LIM' : 'CIRCUIT'}
              </span>
            </div>
          ))}
        </div>

        {/* Animation Panel */}
        <div className="lg:col-span-2 space-y-4">
          <button
            onClick={simulateRouting}
            disabled={isAnimating}
            className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
              isAnimating
                ? 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-wait'
                : 'btn-primary shadow-lg shadow-rose-500/20'
            }`}
          >
            {isAnimating ? '⏳ Routing in progress…' : '▶ Simulate Request Routing'}
          </button>

          {/* Steps Timeline */}
          <div className="space-y-2 min-h-[200px]">
            {steps.length === 0 && !isAnimating && (
              <div className="flex items-center justify-center h-48 text-slate-400 dark:text-slate-500 text-xs">
                Click "Simulate" to watch OmniRoute's routing engine cascade through providers in real time
              </div>
            )}

            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 animate-fade-in ${
                  step.accepted
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'
                    : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'
                }`}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                  style={{ backgroundColor: step.color }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {step.accepted ? '✓' : '✗'} {step.provider}
                    <span className="text-slate-400 dark:text-slate-500 font-normal ml-2">Tier {step.tier} • {step.latency}ms</span>
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {step.accepted
                      ? `Request accepted — serving response`
                      : step.status === 'rate-limited'
                        ? 'Rate limited — cooldown active, trying next…'
                        : 'Circuit breaker OPEN — provider locked out, skipping…'
                    }
                  </p>
                </div>
                <ArrowRight className={`w-4 h-4 flex-shrink-0 ${step.accepted ? 'text-emerald-500' : 'text-red-400'}`} />
              </div>
            ))}

            {finalResult && (
              <div className={`p-4 rounded-xl text-center font-bold text-sm ${
                finalResult.status === 'success'
                  ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                  : 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/30'
              }`}>
                {finalResult.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
