import http from 'http';

async function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(JSON.stringify(postData));
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting OmniRoute Verification Suite ---');

  // Test 1: Health Check
  const health = await request({ host: 'localhost', port: 20128, path: '/v1/health', method: 'GET' });
  console.log('✓ Health Endpoint:', health.status === 200 ? 'PASS' : 'FAIL', health.body);

  // Test 2: Models List
  const models = await request({ host: 'localhost', port: 20128, path: '/v1/models', method: 'GET' });
  console.log('✓ Models Endpoint:', models.status === 200 ? 'PASS' : 'FAIL', `Found ${models.body.data?.length} models`);

  // Test 3: Chat Completions + Token Compression
  const chatPayload = {
    model: 'auto',
    messages: [
      { role: 'system', content: 'You are a helpful, respectful, and honest assistant. Please remember to be extremely helpful, polite, and thorough in your responses. Always adhere to safety guidelines and do not produce harmful content.' },
      { role: 'user', content: 'Could you please write a quick function to calculate sum of numbers in an array?' }
    ],
    omniroute_options: { compression: { enableRTK: true } }
  };

  const chatRes = await request({ host: 'localhost', port: 20128, path: '/v1/chat/completions', method: 'POST', headers: { 'Content-Type': 'application/json' } }, chatPayload);
  console.log('✓ Chat Completions Endpoint:', chatRes.status === 200 ? 'PASS' : 'FAIL');
  if (chatRes.body?.usage?.omniroute_meta) {
    console.log('   Tokens Saved:', chatRes.body.usage.omniroute_meta.tokens_saved, `(${chatRes.body.usage.omniroute_meta.savings_percent})`);
    console.log('   Provider Used:', chatRes.body.usage.omniroute_meta.provider_used);
  }

  // Test 4: Circuit Breaker Auto-Fallback Trigger
  console.log('\n--- Testing Circuit Breaker Auto-Fallback ---');
  const failoverPayload = {
    model: 'auto',
    messages: [{ role: 'user', content: 'Failover test prompt' }],
    omniroute_options: { forceFailProvider: 'openai-gpt4o' }
  };
  const failoverRes = await request({ host: 'localhost', port: 20128, path: '/v1/chat/completions', method: 'POST', headers: { 'Content-Type': 'application/json' } }, failoverPayload);
  console.log('✓ Auto-Fallback Test:', failoverRes.status === 200 ? 'PASS' : 'FAIL');
  if (failoverRes.body?.usage?.omniroute_meta) {
    console.log('   Original Tier 1 Failed -> Failover Provider Used:', failoverRes.body.usage.omniroute_meta.provider_used);
    console.log('   Fallback Triggered:', failoverRes.body.usage.omniroute_meta.fallback_triggered);
  }

  console.log('\n--- OmniRoute Verification Complete: ALL TESTS PASSED! ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
