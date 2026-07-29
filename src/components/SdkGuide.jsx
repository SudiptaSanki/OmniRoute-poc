import React, { useState } from 'react';
import { Code2, Copy, CheckCircle2 } from 'lucide-react';

export default function SdkGuide() {
  const [copiedTab, setCopiedTab] = useState(null);
  const [activeLang, setActiveLang] = useState('python');

  const copyToClipboard = (text, tab) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const snippets = {
    python: `from openai import OpenAI

# Drop-in replacement for OpenAI SDK
client = OpenAI(
    base_url="http://localhost:20128/v1",
    api_key="omniroute"  # Any key works
)

response = client.chat.completions.create(
    model="auto", # Triggers OmniRoute Smart Engine
    messages=[{"role": "user", "content": "Explain quantum computing."}]
)
print(response.choices[0].message.content)`,
    nodejs: `import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'http://localhost:20128/v1',
  apiKey: 'omniroute'
});

const completion = await openai.chat.completions.create({
  model: 'auto',
  messages: [{ role: 'user', content: 'Explain quantum computing.' }]
});
console.log(completion.choices[0].message.content);`
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bark-800 dark:text-white flex items-center gap-2">
          <Code2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /> Integrations & SDKs
        </h1>
        <p className="text-bark-700 dark:text-slate-400 text-sm mt-0.5">
          OmniRoute is 100% API compatible with OpenAI. Just change the <code className="bg-cream-200 dark:bg-slate-800 px-1 rounded text-rose-600 dark:text-pink-400">base_url</code> in any tool.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dark-glass rounded-xl p-6 space-y-4">
          <h2 className="text-base font-bold text-bark-800 dark:text-white border-b border-warmtan-200 dark:border-white/10 pb-2">IDE Setup (Cursor / Cline)</h2>
          <ol className="list-decimal list-inside text-sm text-bark-700 dark:text-slate-300 space-y-2">
            <li>Open IDE Settings (Features &gt; Models)</li>
            <li>Enable <strong>OpenAI Custom Base URL</strong></li>
            <li>Set URL: <code className="bg-cream-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-rose-600 dark:text-pink-400">http://localhost:20128/v1</code></li>
            <li>Set API Key: <code className="bg-cream-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-emerald-600 dark:text-emerald-400">omniroute</code></li>
            <li>Override model name to: <code className="bg-cream-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-bark-800 dark:text-white">auto</code></li>
          </ol>
        </div>

        <div className="dark-glass rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-warmtan-200 dark:border-white/10 pb-2">
            <h2 className="text-base font-bold text-bark-800 dark:text-white">Code SDK Setup</h2>
            <div className="flex gap-2 text-xs">
              <button onClick={() => setActiveLang('python')} className={`px-2 py-1 rounded ${activeLang === 'python' ? 'bg-rose-100 dark:bg-white/10 font-bold text-rose-600 dark:text-white' : 'text-warmtan-500 dark:text-slate-500 hover:text-bark-700 dark:hover:text-slate-300'}`}>Python</button>
              <button onClick={() => setActiveLang('nodejs')} className={`px-2 py-1 rounded ${activeLang === 'nodejs' ? 'bg-rose-100 dark:bg-white/10 font-bold text-rose-600 dark:text-white' : 'text-warmtan-500 dark:text-slate-500 hover:text-bark-700 dark:hover:text-slate-300'}`}>Node.js</button>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => copyToClipboard(snippets[activeLang], activeLang)}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-cream-200 dark:bg-slate-800 hover:bg-cream-300 dark:hover:bg-slate-700 text-warmtan-600 dark:text-slate-400 transition-colors"
            >
              {copiedTab === activeLang ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <pre className="bg-cream-50 dark:bg-[#08070b] p-4 rounded-xl border border-warmtan-200 dark:border-white/10 text-xs text-rose-600 dark:text-pink-300 font-mono whitespace-pre-wrap overflow-x-auto">
              {snippets[activeLang]}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
