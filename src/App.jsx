import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Search, Github, Terminal, Code2, Cpu, Layers, Wrench, 
  Activity, Zap, CheckCircle2, ArrowRight, Sun, Moon, Globe, ExternalLink,
  ShieldCheck, ShieldAlert, DollarSign, RefreshCw, ChevronDown
} from 'lucide-react';

import OverviewDashboard from './components/OverviewDashboard';
import GatewaySandbox from './components/GatewaySandbox';
import ProviderManager from './components/ProviderManager';
import CompressionInspector from './components/CompressionInspector';
import McpExplorer from './components/McpExplorer';
import SdkGuide from './components/SdkGuide';
import CostCalculator from './components/CostCalculator';
import RoutingVisualizer from './components/RoutingVisualizer';
import ModelArena from './components/ModelArena';
import RequestInspector from './components/RequestInspector';

const translations = {
  EN: {
    heroEyebrow: 'FREE & OPEN-SOURCE AI GATEWAY',
    heroTitle: 'Never Stop',
    heroTitleHighlight: 'Coding.',
    heroLead: '268 providers, one endpoint, auto-fallback. Never hit limits — never stop building.',
    startFree: '🚀 Start Free →',
    github: '★ GitHub'
  },
  ES: {
    heroEyebrow: 'GATEWAY DE IA GRATUITO Y DE CÓDIGO ABIERTO',
    heroTitle: 'Nunca Dejes De',
    heroTitleHighlight: 'Programar.',
    heroLead: '268 proveedores, un endpoint, auto-fallback. Nunca alcances los límites — nunca dejes de construir.',
    startFree: '🚀 Empieza Gratis →',
    github: '★ GitHub'
  },
  PT: {
    heroEyebrow: 'GATEWAY DE IA GRATUITO E CÓDIGO ABERTO',
    heroTitle: 'Nunca Pare De',
    heroTitleHighlight: 'Programar.',
    heroLead: '268 provedores, um endpoint, auto-fallback. Nunca atinja limites — nunca pare de construir.',
    startFree: '🚀 Comece Grátis →',
    github: '★ GitHub'
  },
  JA: {
    heroEyebrow: '無料のオープンソースAIゲートウェイ',
    heroTitle: 'コーディングを',
    heroTitleHighlight: '止めるな。',
    heroLead: '268のプロバイダー、単一のエンドポイント、自動フォールバック。制限に達することなく構築を続けます。',
    startFree: '🚀 無料で開始 →',
    github: '★ GitHub'
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState('EN');
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const t = translations[lang] || translations.EN;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-rose-500 selection:text-white transition-colors duration-300">
      {/* ════════════════ NAV BAR (Floating Glassmorphism) ════════════════ */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
        <nav className="pointer-events-auto flex items-center justify-between px-6 py-3 gap-8 rounded-full bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-300">
          
          <a href="#hero" className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-lg tracking-tight group">
            <span className="text-rose-500 text-base transform group-hover:rotate-45 transition-transform">◆</span>
            <span className="hidden sm:block">OmniRoute</span>
          </a>

          {/* Centered Links */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <button onClick={() => scrollToSection('providers')} className="hover:text-slate-900 dark:hover:text-white transition-colors">Providers</button>
            <button onClick={() => scrollToSection('features')} className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</button>
            <button onClick={() => scrollToSection('why')} className="hover:text-slate-900 dark:hover:text-white transition-colors">Why</button>
            <button onClick={() => scrollToSection('compare')} className="hover:text-slate-900 dark:hover:text-white transition-colors">Compare</button>
            <button onClick={() => scrollToSection('control-center')} className="text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition-colors flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-current" /> Live POC Control Center
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDark(!isDark)} 
              className="p-2 rounded-full bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 transition-colors border border-white/20 dark:border-transparent"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors border border-white/20 dark:border-transparent"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:block">{lang}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl p-1 z-50 text-xs text-slate-600 dark:text-slate-300">
                  <button onClick={() => { setLang('EN'); setLangOpen(false); }} className={`w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 ${lang === 'EN' ? 'font-bold text-rose-500' : 'font-semibold'}`}>🇺🇸 English</button>
                  <button onClick={() => { setLang('ES'); setLangOpen(false); }} className={`w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 ${lang === 'ES' ? 'font-bold text-rose-500' : 'font-semibold'}`}>🇪🇸 Español</button>
                  <button onClick={() => { setLang('PT'); setLangOpen(false); }} className={`w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 ${lang === 'PT' ? 'font-bold text-rose-500' : 'font-semibold'}`}>🇧🇷 Português</button>
                  <button onClick={() => { setLang('JA'); setLangOpen(false); }} className={`w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 ${lang === 'JA' ? 'font-bold text-rose-500' : 'font-semibold'}`}>🇯🇵 日本語</button>
                </div>
              )}
            </div>

            <button 
              onClick={() => scrollToSection('control-center')}
              className="btn-primary px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hidden sm:flex shadow-lg shadow-rose-500/20"
            >
              {t.startFree}
            </button>
          </div>
        </nav>
      </div>

      {/* ════════════════ SECTION 1: HERO (Left Aligned instead of Center) ════════════════ */}
      <section id="hero" className="relative py-20 lg:py-28 px-8 lg:px-24 border-b border-slate-200 dark:border-white/5 bg-hero-grid overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Removed mx-auto and max-w-7xl to make it left aligned! */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-block text-xs font-bold text-rose-500 uppercase tracking-widest bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-500/20">
              {t.heroEyebrow}
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
              {t.heroTitle} <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-600 to-rose-400 dark:from-white dark:via-slate-100 dark:to-rose-200">{t.heroTitleHighlight}</span>
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">
              {t.heroLead}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={() => scrollToSection('control-center')}
                className="btn-primary px-6 py-3.5 rounded-xl text-sm font-extrabold flex items-center gap-2"
              >
                {t.startFree}
              </button>
              <a 
                href="https://github.com/diegosouzapw/OmniRoute" 
                target="_blank" 
                rel="noreferrer"
                className="px-6 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10 transition-all"
              >
                {t.github}
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-4 font-mono">
              <span className="text-rose-500 dark:text-rose-400 font-bold text-sm">268</span> providers
              <span>•</span>
              <span className="text-rose-500 dark:text-rose-400 font-bold text-sm">90+</span> free
              <span>•</span>
              <span className="text-rose-500 dark:text-rose-400 font-bold text-sm">15–95%</span> saved
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="terminal-box p-4 space-y-3 font-mono text-xs text-slate-300 dark:text-slate-300 bg-[#0e121b] border-slate-800 dark:border-white/10">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-slate-400 ml-2">omniroute — auto-fallback</span>
              </div>
              
              <div className="space-y-1.5 pt-1">
                <div className="text-rose-400 font-semibold"><span className="text-slate-500">$</span> omniroute</div>
                <div className="text-slate-300">▸ cc/claude ........ <span className="text-emerald-400">✓</span></div>
                <div className="text-slate-400">▸ <span className="text-amber-400">quota out → glm $0.5</span></div>
                <div className="text-emerald-400">▸ switched in 8ms</div>
              </div>
            </div>

            <div className="p-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-center font-mono text-xs text-slate-600 dark:text-slate-400">
              <strong className="text-slate-900 dark:text-white">IDE</strong> <span className="text-rose-500">→</span> <strong className="text-slate-900 dark:text-white">Router</strong> <span className="text-rose-500">→</span> <strong className="text-slate-900 dark:text-white">268 providers</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ SECTION 2: THE PROMISE (Left Aligned) ════════════════ */}
      <section id="promise" className="py-16 lg:py-24 px-8 lg:px-24 border-b border-slate-200 dark:border-white/5">
        <div className="w-full space-y-12">
          <div>
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block mb-2">THE PROMISE</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">One endpoint. Never stop building.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#11151e] border border-slate-200 dark:border-white/10 space-y-3 shadow-sm dark:shadow-none">
              <div className="text-3xl">🚫</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Never hit limits</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Auto-fallback across 268 providers in milliseconds. Quota out? The next provider takes over — zero downtime.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#11151e] border border-slate-200 dark:border-white/10 space-y-3 shadow-sm dark:shadow-none">
              <div className="text-3xl">💸</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Save up to 95% tokens</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">RTK + Caveman stacked compression cuts 15–95% of eligible tokens — about 89% on tool-heavy sessions.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#11151e] border border-slate-200 dark:border-white/10 space-y-3 shadow-sm dark:shadow-none">
              <div className="text-3xl">🆓</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">$0 to start</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">90+ providers with a free tier, 11 free forever (Kiro, Pollinations, LongCat…). No credit card needed.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#11151e] border border-slate-200 dark:border-white/10 space-y-3 shadow-sm dark:shadow-none">
              <div className="text-3xl">🔌</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Every tool works</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">16+ coding agents — Claude Code, Codex, Cursor, Cline, Copilot, Antigravity — through one config.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#11151e] border border-slate-200 dark:border-white/10 space-y-3 shadow-sm dark:shadow-none">
              <div className="text-3xl">🧩</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">One endpoint</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">OpenAI ↔ Claude ↔ Gemini ↔ Responses API translation. Point any tool at <code className="text-rose-500 dark:text-rose-400 font-mono">/v1</code> and it just works.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#11151e] border border-slate-200 dark:border-white/10 space-y-3 shadow-sm dark:shadow-none">
              <div className="text-3xl">🛡️</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Production-grade</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Circuit breakers, TLS stealth, MCP (104 tools), A2A, memory, guardrails — backed by 25,000+ tests.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ NEW SECTION: COST SAVINGS CALCULATOR ════════════════ */}
      <section id="features" className="py-16 lg:py-24 px-8 lg:px-24 border-b border-slate-200 dark:border-white/5 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-500/5 dark:to-transparent">
        <div className="w-full space-y-8">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-2">💰 EXCLUSIVE FEATURE — NOT ON OMNIROUTE.ONLINE</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">How Much Will You Save?</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">Drag the sliders below to model your exact usage. See real-time cost comparisons between paying API providers directly vs. routing through OmniRoute.</p>
          </div>
          <div className="bg-white dark:bg-[#11151e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 lg:p-8 shadow-sm dark:shadow-none">
            <CostCalculator />
          </div>
        </div>
      </section>

      {/* ════════════════ SECTION 3: PROVIDERS CATALOG (Left Aligned) ════════════════ */}
      <section id="providers" className="py-16 lg:py-24 px-8 lg:px-24 border-b border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-[#090b10]">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block">THE CATALOG</span>
            <div className="text-7xl sm:text-8xl font-black text-slate-900 dark:text-white tracking-tighter">268</div>
            <p className="text-xl font-bold text-slate-700 dark:text-slate-200">providers supported</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Most complete catalog of any open router. Includes 90+ free tiers and 11 free forever models.</p>
            <div className="flex gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-500/20">90+ free</span>
              <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-500/20">11 free forever</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-4 rounded-xl bg-white dark:bg-[#11151e] border border-slate-200 dark:border-white/10 flex justify-between items-center shadow-sm dark:shadow-none">
                <span className="text-slate-700 dark:text-slate-300">20 OAuth</span>
                <span className="text-slate-500 text-[11px]">Claude, Codex, Cursor...</span>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#11151e] border border-slate-200 dark:border-white/10 flex justify-between items-center shadow-sm dark:shadow-none">
                <span className="text-slate-700 dark:text-slate-300">158 API-key</span>
                <span className="text-slate-500 text-[11px]">OpenAI, Groq, Cerebras...</span>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#11151e] border border-slate-200 dark:border-white/10 flex justify-between items-center shadow-sm dark:shadow-none">
                <span className="text-rose-500 dark:text-rose-400 font-bold">11 Free Forever</span>
                <span className="text-slate-500 text-[11px]">Kiro, Pollinations...</span>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#11151e] border border-slate-200 dark:border-white/10 flex justify-between items-center shadow-sm dark:shadow-none">
                <span className="text-slate-700 dark:text-slate-300">11 Local</span>
                <span className="text-slate-500 text-[11px]">Ollama, LM Studio...</span>
              </div>
            </div>
            <p className="text-left md:text-center text-xs text-slate-500 pt-2">Plus 23 Web • 11 Search • 7 Audio • 24 Image • 14 Video • 14 Embeddings</p>
          </div>
        </div>
      </section>

      {/* ════════════════ SECTION 4: LIVE POC CONTROL CENTER (Interactive App) ════════════════ */}
      <section id="control-center" className="py-16 lg:py-24 px-8 lg:px-24 border-b border-slate-200 dark:border-white/5">
        <div className="w-full space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
            <div>
              <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block mb-1">INTERACTIVE DEMO & PROOF OF CONCEPT</span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                <Zap className="w-7 h-7 text-rose-500 fill-current" /> OmniRoute Control Center
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">This is not a dummy UI! The sandbox below connects directly to your local proxy server at <code className="text-rose-500 dark:text-rose-400 font-mono">http://localhost:20128/v1</code>. You can chat, view real provider states, and inspect token compression live.</p>
            </div>

            {/* POC Navigation Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'overview', label: '📊 Overview' },
                { id: 'sandbox', label: '⚡ Gateway Sandbox' },
                { id: 'arena', label: '⚔️ Model Arena' },
                { id: 'routing', label: '🔀 Routing Visualizer' },
                { id: 'inspector', label: '🔍 Request Inspector' },
                { id: 'providers', label: '🖥️ 268 Providers' },
                { id: 'compression', label: '🗜️ RTK Compression' },
                { id: 'mcp', label: '🛠️ MCP Server' },
                { id: 'sdk', label: '💻 IDE & SDK Setup' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? 'btn-primary'
                      : 'bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Tab Workspace */}
          <div className="bg-white dark:bg-[#11151e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 lg:p-8 shadow-sm dark:shadow-none transition-colors">
            {activeTab === 'overview' && <OverviewDashboard onSelectTab={setActiveTab} />}
            {activeTab === 'sandbox' && <GatewaySandbox />}
            {activeTab === 'arena' && <ModelArena />}
            {activeTab === 'routing' && <RoutingVisualizer />}
            {activeTab === 'inspector' && <RequestInspector />}
            {activeTab === 'providers' && <ProviderManager />}
            {activeTab === 'compression' && <CompressionInspector />}
            {activeTab === 'mcp' && <McpExplorer />}
            {activeTab === 'sdk' && <SdkGuide />}
          </div>
        </div>
      </section>

      {/* ════════════════ SECTION 5: HONEST COMPARISON MATRIX (Left Aligned) ════════════════ */}
      <section id="compare" className="py-16 lg:py-24 px-8 lg:px-24 bg-slate-100 dark:bg-[#090b10]">
        <div className="w-full space-y-10">
          <div>
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block mb-2">HONEST COMPARISON</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">How OmniRoute Compares</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Audited against the real READMEs of 9router, LiteLLM, and CLIProxyAPI.</p>
          </div>

          <div className="overflow-x-auto bg-white dark:bg-transparent rounded-2xl shadow-sm dark:shadow-none">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
                  <th className="p-4">Feature</th>
                  <th className="p-4 text-rose-500 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-500/10 rounded-t-xl border-b-2 border-rose-500">OmniRoute</th>
                  <th className="p-4">9router</th>
                  <th className="p-4">LiteLLM</th>
                  <th className="p-4">CLIProxyAPI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-600 dark:text-slate-300">
                <tr>
                  <td className="p-4 font-sans font-semibold text-slate-900 dark:text-white">Providers Catalog</td>
                  <td className="p-4 bg-rose-50/50 dark:bg-rose-500/5 font-bold text-rose-500 dark:text-rose-400">268</td>
                  <td className="p-4">40+</td>
                  <td className="p-4">100+</td>
                  <td className="p-4">8+ upstreams</td>
                </tr>
                <tr>
                  <td className="p-4 font-sans font-semibold text-slate-900 dark:text-white">Routing Strategies</td>
                  <td className="p-4 bg-rose-50/50 dark:bg-rose-500/5 font-bold text-rose-500 dark:text-rose-400">17 Strategies</td>
                  <td className="p-4">3-tier</td>
                  <td className="p-4">Priority / Retry</td>
                  <td className="p-4">Round-robin</td>
                </tr>
                <tr>
                  <td className="p-4 font-sans font-semibold text-slate-900 dark:text-white">Token Compression</td>
                  <td className="p-4 bg-rose-50/50 dark:bg-rose-500/5 font-bold text-emerald-600 dark:text-emerald-400">RTK + Caveman (15-95%)</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">RTK (20-40%)</td>
                  <td className="p-4 text-slate-400 dark:text-slate-500">❌ None</td>
                  <td className="p-4 text-slate-400 dark:text-slate-500">❌ None</td>
                </tr>
                <tr>
                  <td className="p-4 font-sans font-semibold text-slate-900 dark:text-white">Built-in MCP Server</td>
                  <td className="p-4 bg-rose-50/50 dark:bg-rose-500/5 font-bold text-emerald-600 dark:text-emerald-400">✓ 104 Tools</td>
                  <td className="p-4 text-slate-400 dark:text-slate-500">❌ None</td>
                  <td className="p-4 text-amber-600 dark:text-amber-400">⚠ Client only</td>
                  <td className="p-4 text-slate-400 dark:text-slate-500">❌ None</td>
                </tr>
                <tr>
                  <td className="p-4 font-sans font-semibold text-slate-900 dark:text-white">Auto-Fallback Latency</td>
                  <td className="p-4 bg-rose-50/50 dark:bg-rose-500/5 font-bold text-emerald-600 dark:text-emerald-400">&lt; 10ms</td>
                  <td className="p-4">&lt; 50ms</td>
                  <td className="p-4">&gt; 200ms</td>
                  <td className="p-4">&gt; 100ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-200 dark:border-white/10 text-center text-xs text-slate-500 space-y-2">
        <p>OmniRoute — Free & Open-Source AI Gateway. Point any tool at <code className="text-rose-500 dark:text-rose-400">http://localhost:20128/v1</code>.</p>
        <p>© 2026 OmniRoute Open Source Community.</p>
      </footer>
    </div>
  );
}
