import React, { useState, useEffect } from 'react';
import { Wrench, Play, CheckCircle2 } from 'lucide-react';

export default function McpExplorer() {
  const [tools, setTools] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);

  useEffect(() => {
    // Mock MCP tools payload
    setTools([
      { name: 'read_file', desc: 'Read a file from the local workspace.', params: { path: 'string' } },
      { name: 'write_file', desc: 'Write content to a file in the workspace.', params: { path: 'string', content: 'string' } },
      { name: 'github_search', desc: 'Search GitHub repositories directly.', params: { query: 'string' } },
      { name: 'run_terminal', desc: 'Execute a bash command safely.', params: { command: 'string' } }
    ]);
    setSelectedTool('read_file');
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bark-800 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-warmtan-500 dark:text-amber-400" /> Built-in MCP Tools
        </h1>
        <p className="text-bark-700 dark:text-slate-400 text-sm mt-0.5">
          OmniRoute acts as an MCP server. Expose local file/terminal tools seamlessly to any connected LLM.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 space-y-2">
          <div className="text-[11px] font-bold text-warmtan-500 dark:text-slate-400 uppercase tracking-wider mb-2">Available Tools</div>
          {tools.map(t => (
            <button
              key={t.name}
              onClick={() => setSelectedTool(t.name)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                selectedTool === t.name
                  ? 'bg-rose-50 dark:bg-pink-500/10 border-rose-400 dark:border-pink-500/50'
                  : 'bg-cream-50 dark:bg-[#13111a] border-warmtan-200 dark:border-white/10 hover:border-warmtan-300 dark:hover:border-white/20'
              }`}
            >
              <div className={`font-mono text-xs font-bold ${selectedTool === t.name ? 'text-rose-600 dark:text-pink-300' : 'text-bark-800 dark:text-slate-200'}`}>
                {t.name}
              </div>
            </button>
          ))}
        </div>

        <div className="md:col-span-8">
          {selectedTool && (
            <div className="dark-glass rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="w-5 h-5 text-warmtan-500 dark:text-amber-400" />
                <h2 className="text-lg font-bold text-bark-800 dark:text-white font-mono">{selectedTool}</h2>
              </div>
              <p className="text-bark-700 dark:text-slate-400 text-sm">
                {tools.find(t => t.name === selectedTool)?.desc}
              </p>

              <div>
                <h3 className="text-xs font-bold text-warmtan-500 dark:text-slate-400 uppercase tracking-wider mb-2">Schema Parameters</h3>
                <pre className="bg-cream-100 dark:bg-[#08070b] p-4 rounded-xl border border-warmtan-200 dark:border-white/10 text-xs text-rose-600 dark:text-pink-300 font-mono">
                  {JSON.stringify(tools.find(t => t.name === selectedTool)?.params, null, 2)}
                </pre>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="px-4 py-2 rounded-xl bg-warmtan-200 hover:bg-warmtan-300 dark:bg-white/10 dark:hover:bg-white/20 text-bark-800 dark:text-white text-xs font-bold transition-colors flex items-center gap-2">
                  <Play className="w-3.5 h-3.5" /> Test Tool
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
