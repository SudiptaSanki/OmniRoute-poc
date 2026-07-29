import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingDown, Zap, Calculator } from 'lucide-react';

const MODELS = [
  { name: 'GPT-4o',        inputPer1M: 2.50,  outputPer1M: 10.00 },
  { name: 'Claude Opus 4', inputPer1M: 15.00, outputPer1M: 75.00 },
  { name: 'Claude Sonnet',  inputPer1M: 3.00,  outputPer1M: 15.00 },
  { name: 'Gemini 2.5 Pro', inputPer1M: 1.25,  outputPer1M: 10.00 },
  { name: 'GPT-4.1',       inputPer1M: 2.00,  outputPer1M: 8.00  },
  { name: 'DeepSeek V3',   inputPer1M: 0.27,  outputPer1M: 1.10  },
];

export default function CostCalculator() {
  const [dailyRequests, setDailyRequests] = useState(500);
  const [avgInputTokens, setAvgInputTokens] = useState(2000);
  const [avgOutputTokens, setAvgOutputTokens] = useState(800);
  const [compressionRate, setCompressionRate] = useState(65);
  const [freeRatio, setFreeRatio] = useState(40);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);

  const calc = useMemo(() => {
    const monthlyRequests = dailyRequests * 30;
    const totalInputTokens = monthlyRequests * avgInputTokens;
    const totalOutputTokens = monthlyRequests * avgOutputTokens;

    // Direct cost (no OmniRoute)
    const directInputCost = (totalInputTokens / 1_000_000) * selectedModel.inputPer1M;
    const directOutputCost = (totalOutputTokens / 1_000_000) * selectedModel.outputPer1M;
    const directTotal = directInputCost + directOutputCost;

    // OmniRoute cost: compression reduces input tokens, free ratio eliminates cost for some requests
    const compressedInputTokens = totalInputTokens * (1 - compressionRate / 100);
    const paidRequests = monthlyRequests * (1 - freeRatio / 100);
    const paidInputTokens = compressedInputTokens * (1 - freeRatio / 100);
    const paidOutputTokens = totalOutputTokens * (1 - freeRatio / 100);
    const omniInputCost = (paidInputTokens / 1_000_000) * selectedModel.inputPer1M;
    const omniOutputCost = (paidOutputTokens / 1_000_000) * selectedModel.outputPer1M;
    const omniTotal = omniInputCost + omniOutputCost;

    const saved = directTotal - omniTotal;
    const savedPercent = directTotal > 0 ? (saved / directTotal) * 100 : 0;

    return {
      monthlyRequests,
      totalInputTokens,
      totalOutputTokens,
      directTotal,
      omniTotal,
      saved,
      savedPercent,
      compressedInputTokens,
      paidRequests,
    };
  }, [dailyRequests, avgInputTokens, avgOutputTokens, compressionRate, freeRatio, selectedModel]);

  const fmt = (n) => n < 1 ? `$${n.toFixed(3)}` : `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  const fmtNum = (n) => n.toLocaleString();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Calculator className="w-6 h-6 text-rose-500" />
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Interactive Cost Calculator</h3>
        <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">NOT ON OFFICIAL SITE</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Model Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Target Model</label>
            <div className="grid grid-cols-3 gap-2">
              {MODELS.map((m) => (
                <button
                  key={m.name}
                  onClick={() => setSelectedModel(m)}
                  className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all ${
                    selectedModel.name === m.name
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Daily Requests</span>
                <span className="font-mono font-bold text-rose-500">{fmtNum(dailyRequests)}</span>
              </div>
              <input type="range" min={10} max={10000} step={10} value={dailyRequests}
                onChange={(e) => setDailyRequests(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-slate-200 dark:bg-white/10 accent-rose-500 cursor-pointer" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Avg Input Tokens / Request</span>
                <span className="font-mono font-bold text-rose-500">{fmtNum(avgInputTokens)}</span>
              </div>
              <input type="range" min={100} max={32000} step={100} value={avgInputTokens}
                onChange={(e) => setAvgInputTokens(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-slate-200 dark:bg-white/10 accent-rose-500 cursor-pointer" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Avg Output Tokens / Request</span>
                <span className="font-mono font-bold text-rose-500">{fmtNum(avgOutputTokens)}</span>
              </div>
              <input type="range" min={50} max={8000} step={50} value={avgOutputTokens}
                onChange={(e) => setAvgOutputTokens(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-slate-200 dark:bg-white/10 accent-rose-500 cursor-pointer" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-300">RTK + Caveman Compression</span>
                <span className="font-mono font-bold text-emerald-500">{compressionRate}%</span>
              </div>
              <input type="range" min={0} max={95} step={1} value={compressionRate}
                onChange={(e) => setCompressionRate(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-slate-200 dark:bg-white/10 accent-emerald-500 cursor-pointer" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Requests Routed to Free Tiers</span>
                <span className="font-mono font-bold text-violet-500">{freeRatio}%</span>
              </div>
              <input type="range" min={0} max={100} step={1} value={freeRatio}
                onChange={(e) => setFreeRatio(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-slate-200 dark:bg-white/10 accent-violet-500 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          {/* Big savings hero */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/5 border border-emerald-200 dark:border-emerald-500/20 text-center space-y-2">
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Monthly Savings</p>
            <p className="text-5xl font-black text-emerald-600 dark:text-emerald-400">{fmt(calc.saved)}</p>
            <p className="text-lg font-bold text-emerald-500 dark:text-emerald-300">{calc.savedPercent.toFixed(1)}% cheaper</p>
          </div>

          {/* Comparison bars */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-red-600 dark:text-red-400">❌ Direct API ({selectedModel.name})</span>
                <span className="text-lg font-black text-red-600 dark:text-red-400 font-mono">{fmt(calc.directTotal)}/mo</span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-red-200 dark:bg-red-500/20 overflow-hidden">
                <div className="h-full rounded-full bg-red-500 transition-all duration-500" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">✅ With OmniRoute</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">{fmt(calc.omniTotal)}/mo</span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-emerald-200 dark:bg-emerald-500/20 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${calc.directTotal > 0 ? (calc.omniTotal / calc.directTotal) * 100 : 0}%` }} />
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Monthly Requests</p>
              <p className="text-sm font-black text-slate-900 dark:text-white font-mono">{fmtNum(calc.monthlyRequests)}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Tokens Compressed</p>
              <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">{fmtNum(Math.round(calc.totalInputTokens - calc.compressedInputTokens))}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Free-Tier Requests</p>
              <p className="text-sm font-black text-violet-600 dark:text-violet-400 font-mono">{fmtNum(calc.monthlyRequests - calc.paidRequests)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
