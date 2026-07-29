import React, { useState, useRef } from 'react';
import { Swords, Send, Clock, Hash, Sparkles, RotateCcw } from 'lucide-react';

const MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', color: '#10b981', avatar: '🟢' },
  { id: 'claude-sonnet', name: 'Claude Sonnet', provider: 'Anthropic', color: '#f97316', avatar: '🟠' },
  { id: 'gemini-pro', name: 'Gemini 2.5 Pro', provider: 'Google', color: '#3b82f6', avatar: '🔵' },
  { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek', color: '#8b5cf6', avatar: '🟣' },
  { id: 'llama-70b', name: 'Llama 3.3 70B', provider: 'Meta/Groq', color: '#ec4899', avatar: '🩷' },
  { id: 'qwen-72b', name: 'Qwen 2.5 72B', provider: 'Alibaba', color: '#06b6d4', avatar: '🩵' },
];

const SAMPLE_PROMPTS = [
  'Explain recursion to a 5-year-old in 3 sentences.',
  'Write a Python one-liner to flatten a nested list.',
  'What is the difference between TCP and UDP?',
  'Give me a regex to validate email addresses.',
  'Explain the CAP theorem in simple terms.',
];

// Simulated responses for the arena (since we have no real API keys)
const SIMULATED_RESPONSES = {
  'gpt-4o': (prompt) => `Imagine you have a box, and inside that box is a smaller box, and inside THAT box is an even smaller one. Recursion is like opening boxes inside boxes — you keep doing the same thing (opening a box) until you find what you're looking for. In programming, a function calls itself with a slightly different problem until it reaches the simplest version it can solve directly!`,
  'claude-sonnet': (prompt) => `Think of recursion like looking into two mirrors facing each other — you see yourself reflected again and again, getting smaller each time. In coding, recursion means a function solves a big problem by breaking it into smaller versions of the same problem and calling itself. It keeps going until the problem is so tiny it can answer right away — that's called the "base case."`,
  'gemini-pro': (prompt) => `Recursion is like Russian nesting dolls — to open the big doll, you open the one inside, then the one inside THAT, until you reach the tiniest doll that doesn't open. A recursive function works the same way: it calls itself with a smaller piece of the puzzle each time. When the piece is small enough to solve directly, it stops and all the answers stack back up!`,
  'deepseek-v3': (prompt) => `Imagine you're climbing stairs and you ask "how many steps to the top?" You can figure it out by asking "how many from the NEXT step?" — and that step asks the same question to the step above it. Each step passes the question up until someone at the top says "zero!" and the answer flows back down. That's recursion: solving a problem by asking a smaller version of the same question.`,
  'llama-70b': (prompt) => `Picture a magical storybook where one character says "let me tell you a story," and inside THAT story, another character says the same thing. Recursion in programming works like that — a function tells itself to run again but with a slightly easier job. Eventually the job is so easy it just gives the answer, and all the stories finish one by one!`,
  'qwen-72b': (prompt) => `Think of recursion like giving directions: "To get home, walk one block, then follow these same directions from where you are now." You keep walking one block and re-reading the directions until you're home. In code, a recursive function solves a tiny piece of the problem, then calls itself to handle the rest, until there's nothing left to do.`,
};

export default function ModelArena() {
  const [prompt, setPrompt] = useState(SAMPLE_PROMPTS[0]);
  const [modelA, setModelA] = useState(MODELS[0]);
  const [modelB, setModelB] = useState(MODELS[1]);
  const [responseA, setResponseA] = useState(null);
  const [responseB, setResponseB] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statsA, setStatsA] = useState(null);
  const [statsB, setStatsB] = useState(null);
  const [votes, setVotes] = useState({ a: 0, b: 0, tie: 0 });

  const runArena = () => {
    setIsLoading(true);
    setResponseA(null);
    setResponseB(null);
    setStatsA(null);
    setStatsB(null);

    // Simulate model A with random latency
    const latencyA = 200 + Math.random() * 800;
    setTimeout(() => {
      const text = SIMULATED_RESPONSES[modelA.id]?.(prompt) || `[${modelA.name}] simulated response for: "${prompt.slice(0, 40)}..."`;
      setResponseA(text);
      setStatsA({
        latency: Math.round(latencyA),
        tokens: text.split(/\s+/).length * 1.3 | 0,
        cost: `$${(text.split(/\s+/).length * 0.00003).toFixed(5)}`,
      });
    }, latencyA);

    // Simulate model B with random latency
    const latencyB = 200 + Math.random() * 800;
    setTimeout(() => {
      const text = SIMULATED_RESPONSES[modelB.id]?.(prompt) || `[${modelB.name}] simulated response for: "${prompt.slice(0, 40)}..."`;
      setResponseB(text);
      setStatsB({
        latency: Math.round(latencyB),
        tokens: text.split(/\s+/).length * 1.3 | 0,
        cost: `$${(text.split(/\s+/).length * 0.00003).toFixed(5)}`,
      });
      setIsLoading(false);
    }, Math.max(latencyA, latencyB) + 100);
  };

  const castVote = (winner) => {
    setVotes(prev => ({
      ...prev,
      [winner]: prev[winner] + 1,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Swords className="w-6 h-6 text-rose-500" />
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Model Arena — Side-by-Side</h3>
        <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">NOT ON OFFICIAL SITE</span>
      </div>

      {/* Model Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Model A</label>
          <div className="flex flex-wrap gap-1.5">
            {MODELS.map((m) => (
              <button key={m.id} onClick={() => setModelA(m)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  modelA.id === m.id ? 'text-white shadow-md' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10'
                }`}
                style={modelA.id === m.id ? { backgroundColor: m.color } : {}}
              >{m.avatar} {m.name}</button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Model B</label>
          <div className="flex flex-wrap gap-1.5">
            {MODELS.map((m) => (
              <button key={m.id} onClick={() => setModelB(m)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  modelB.id === m.id ? 'text-white shadow-md' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10'
                }`}
                style={modelB.id === m.id ? { backgroundColor: m.color } : {}}
              >{m.avatar} {m.name}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_PROMPTS.map((p, i) => (
            <button key={i} onClick={() => setPrompt(p)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                prompt === p ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >#{i + 1}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={prompt} onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-rose-500 transition-colors"
            placeholder="Enter your prompt..."
          />
          <button onClick={runArena} disabled={isLoading}
            className="btn-primary px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" /> Battle!
          </button>
        </div>
      </div>

      {/* Side-by-Side Responses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Model A */}
        <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: modelA.color + '40' }}>
          <div className="px-4 py-2.5 flex items-center gap-2" style={{ backgroundColor: modelA.color + '15' }}>
            <span className="text-lg">{modelA.avatar}</span>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white">{modelA.name}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-auto">{modelA.provider}</span>
          </div>
          <div className="p-4 min-h-[160px] bg-white dark:bg-slate-900/50">
            {responseA ? (
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{responseA}</p>
            ) : isLoading ? (
              <div className="flex items-center gap-2 text-slate-400 text-xs animate-pulse">
                <Sparkles className="w-4 h-4" /> Generating...
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Click "Battle!" to generate response</p>
            )}
          </div>
          {statsA && (
            <div className="px-4 py-2 bg-slate-50 dark:bg-white/5 flex gap-4 text-[10px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/10">
              <span><Clock className="w-3 h-3 inline mr-1" />{statsA.latency}ms</span>
              <span><Hash className="w-3 h-3 inline mr-1" />{statsA.tokens} tokens</span>
              <span>💰 {statsA.cost}</span>
            </div>
          )}
        </div>

        {/* Model B */}
        <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: modelB.color + '40' }}>
          <div className="px-4 py-2.5 flex items-center gap-2" style={{ backgroundColor: modelB.color + '15' }}>
            <span className="text-lg">{modelB.avatar}</span>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white">{modelB.name}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-auto">{modelB.provider}</span>
          </div>
          <div className="p-4 min-h-[160px] bg-white dark:bg-slate-900/50">
            {responseB ? (
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{responseB}</p>
            ) : isLoading ? (
              <div className="flex items-center gap-2 text-slate-400 text-xs animate-pulse">
                <Sparkles className="w-4 h-4" /> Generating...
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Click "Battle!" to generate response</p>
            )}
          </div>
          {statsB && (
            <div className="px-4 py-2 bg-slate-50 dark:bg-white/5 flex gap-4 text-[10px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/10">
              <span><Clock className="w-3 h-3 inline mr-1" />{statsB.latency}ms</span>
              <span><Hash className="w-3 h-3 inline mr-1" />{statsB.tokens} tokens</span>
              <span>💰 {statsB.cost}</span>
            </div>
          )}
        </div>
      </div>

      {/* Voting */}
      {responseA && responseB && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-center text-slate-600 dark:text-slate-300">Which response was better?</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => castVote('a')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
              style={{ backgroundColor: modelA.color + '20', color: modelA.color, border: `1px solid ${modelA.color}40` }}>
              {modelA.avatar} {modelA.name} ({votes.a})
            </button>
            <button onClick={() => castVote('tie')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:scale-105 transition-all">
              🤝 Tie ({votes.tie})
            </button>
            <button onClick={() => castVote('b')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
              style={{ backgroundColor: modelB.color + '20', color: modelB.color, border: `1px solid ${modelB.color}40` }}>
              {modelB.avatar} {modelB.name} ({votes.b})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
