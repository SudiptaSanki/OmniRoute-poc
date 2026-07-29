/**
 * OmniRoute Local AI Gateway & Proxy Server
 * Running on localhost:20128 / standard OpenAI API endpoints
 */

import express from 'express';
import cors from 'cors';
import { compressMessages } from './compressionEngine.js';
import { RouterEngine, STRATEGIES } from './routerEngine.js';
import { MCP_TOOLS_CATALOG, MCP_SCOPES, executeMcpTool } from './mcpEngine.js';

const app = express();
const PORT = process.env.PORT || 20128;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const routerEngine = new RouterEngine();

// Stats counter
let totalRequests = 0;
let totalOriginalTokens = 0;
let totalCompressedTokens = 0;
let totalCostSavedDollars = 0.0;

// Health Endpoint
app.get('/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    gateway: 'OmniRoute v1.0 POC',
    endpoint: `http://localhost:${PORT}/v1`,
    uptimeSeconds: Math.floor(process.uptime()),
    providersOnline: 268,
    activeStrategy: routerEngine.activeStrategy
  });
});

// Metrics Endpoint
app.get('/v1/metrics', (req, res) => {
  const savedTokens = Math.max(0, totalOriginalTokens - totalCompressedTokens);
  const avgSavedPct = totalOriginalTokens > 0
    ? Math.round((savedTokens / totalOriginalTokens) * 100)
    : 48;

  res.json({
    totalRequests,
    totalOriginalTokens,
    totalCompressedTokens,
    savedTokens,
    avgTokensSavedPct: `${avgSavedPct}%`,
    totalCostSavedDollars: `$${totalCostSavedDollars.toFixed(4)}`,
    activeStrategy: routerEngine.activeStrategy,
    circuitBreakers: {
      open: routerEngine.getProviders().filter(p => p.circuitState === 'OPEN').length,
      closed: routerEngine.getProviders().filter(p => p.circuitState === 'CLOSED').length,
      halfOpen: routerEngine.getProviders().filter(p => p.circuitState === 'HALF-OPEN').length
    },
    traceLogs: routerEngine.traceLogs.slice(0, 15)
  });
});

// List Models (OpenAI Compatible)
app.get('/v1/models', (req, res) => {
  const providers = routerEngine.getProviders();
  const models = [
    { id: 'auto', object: 'model', created: 1700000000, owned_by: 'omniroute-auto-combo' },
    { id: 'claude-3-5-sonnet', object: 'model', created: 1700000000, owned_by: 'anthropic' },
    { id: 'gpt-4o', object: 'model', created: 1700000000, owned_by: 'openai' },
    { id: 'gemini-1.5-pro', object: 'model', created: 1700000000, owned_by: 'google' },
    { id: 'llama-3.3-70b-versatile', object: 'model', created: 1700000000, owned_by: 'groq' },
    { id: 'deepseek-r1-distill', object: 'model', created: 1700000000, owned_by: 'ollama-local' },
    { id: 'pollinations-longcat-free', object: 'model', created: 1700000000, owned_by: 'pollinations' }
  ];

  res.json({ object: 'list', data: models });
});

// Get Providers & Circuit Breakers Status
app.get('/v1/providers', (req, res) => {
  res.json({
    activeStrategy: routerEngine.activeStrategy,
    strategies: STRATEGIES,
    providers: routerEngine.getProviders()
  });
});

// Switch Strategy
app.post('/v1/strategy', (req, res) => {
  const { strategyId } = req.body;
  const ok = routerEngine.setStrategy(strategyId);
  if (ok) {
    res.json({ success: true, activeStrategy: strategyId });
  } else {
    res.status(400).json({ error: 'Invalid strategy ID' });
  }
});

// Simulate Provider Failover Test
app.post('/v1/providers/failover-test', (req, res) => {
  const { providerId } = req.body;
  routerEngine.triggerCircuitBreaker(providerId || 'openai-gpt4o');
  res.json({
    success: true,
    message: `Triggered 429 rate limit simulation on ${providerId || 'openai-gpt4o'}. Circuit breaker state set to OPEN.`,
    providers: routerEngine.getProviders()
  });
});

// Reset Circuit Breakers
app.post('/v1/providers/reset', (req, res) => {
  routerEngine.resetCircuitBreakers();
  res.json({ success: true, message: 'All provider circuit breakers reset to CLOSED state.', providers: routerEngine.getProviders() });
});

// MCP Tools Endpoint
app.get('/v1/mcp/tools', (req, res) => {
  res.json({ scopes: MCP_SCOPES, tools: MCP_TOOLS_CATALOG });
});

app.post('/v1/mcp/execute', async (req, res) => {
  const { toolName, args } = req.body;
  const result = await executeMcpTool(toolName, args, {
    activeStrategy: routerEngine.activeStrategy,
    metrics: { totalRequests }
  });
  res.json(result);
});

// Core OpenAI Chat Completions Proxy Endpoint
app.post('/v1/chat/completions', async (req, res) => {
  try {
    totalRequests++;
    const body = req.body;
    const stream = body.stream === true;
    const compressionOpts = body.omniroute_options?.compression || {
      enableRTK: true,
      enableCaveman: body.omniroute_options?.caveman || false
    };

    // 1. RTK Token Compression
    const compResult = compressMessages(body.messages || [], compressionOpts);
    totalOriginalTokens += compResult.originalTokens || 120;
    totalCompressedTokens += compResult.compressedTokens || 60;
    const saved = (compResult.savedTokens || 60);
    totalCostSavedDollars += (saved * 0.000015);

    // 2. Multi-tier Router Execution with Circuit Breaker auto-fallback
    const routeResult = await routerEngine.executeRoute({
      ...body,
      messages: compResult.messages
    }, {
      compressedTokens: compResult.compressedTokens,
      forceFailProvider: body.omniroute_options?.forceFailProvider
    });

    const completionId = `chatcmpl-${Date.now()}`;
    const selectedModel = routeResult.provider.name;

    if (stream) {
      // SSE Stream response
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const text = routeResult.responseContent;
      const chunks = text.match(/.{1,15}/g) || [text];

      for (let i = 0; i < chunks.length; i++) {
        const chunkData = {
          id: completionId,
          object: 'chat.completion.chunk',
          created: Math.floor(Date.now() / 1000),
          model: selectedModel,
          choices: [
            {
              index: 0,
              delta: { content: chunks[i] },
              finish_reason: i === chunks.length - 1 ? 'stop' : null
            }
          ]
        };
        res.write(`data: ${JSON.stringify(chunkData)}\n\n`);
        await new Promise(r => setTimeout(r, 40));
      }

      res.write('data: [DONE]\n\n');
      return res.end();
    }

    // Standard Non-streaming response
    res.json({
      id: completionId,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: selectedModel,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: routeResult.responseContent
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: compResult.compressedTokens,
        completion_tokens: Math.ceil(routeResult.responseContent.length / 4),
        total_tokens: compResult.compressedTokens + Math.ceil(routeResult.responseContent.length / 4),
        omniroute_meta: {
          original_prompt_tokens: compResult.originalTokens,
          tokens_saved: compResult.savedTokens,
          savings_percent: `${compResult.savingsPct}%`,
          provider_used: routeResult.provider.name,
          provider_tier: routeResult.provider.tier,
          latency_ms: routeResult.trace.durationMs,
          fallback_triggered: routeResult.trace.attempts.length > 1,
          trace: routeResult.trace
        }
      }
    });

  } catch (err) {
    console.error('OmniRoute proxy error:', err);
    res.status(500).json({
      error: {
        message: err.message || 'Internal OmniRoute proxy error',
        type: 'omniroute_proxy_error',
        code: 500
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🔀 OmniRoute AI Gateway Proxy listening on port ${PORT}`);
  console.log(`   Endpoint: http://localhost:${PORT}/v1`);
  console.log(`   Health:   http://localhost:${PORT}/v1/health`);
  console.log(`=================================================\n`);
});
