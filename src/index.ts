import express from 'express';

const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);

console.log('Starting RISS MCP Server...');

// JSON 파싱
app.use(express.json());

// 헬스체크
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.status(200).json({
    status: 'healthy',
    service: 'riss-mcp-server',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 루트
app.get('/', (req, res) => {
  console.log('Root endpoint requested');
  res.json({
    service: 'RISS MCP Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      mcp: '/mcp?oc=YOUR_API_KEY'
    }
  });
});

// MCP 엔드포인트 (임시)
app.get('/mcp', (req, res) => {
  const apiKey = req.query.oc;
  
  if (!apiKey) {
    return res.status(400).json({ error: 'API key required' });
  }
  
  res.json({
    message: 'MCP endpoint ready',
    apiKey: apiKey
  });
});

// 0.0.0.0에 바인딩 (중요!)
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running on http://0.0.0.0:${PORT}`);
  console.log(`✓ Health: http://0.0.0.0:${PORT}/health`);
  console.log(`✓ MCP: http://0.0.0.0:${PORT}/mcp?oc=YOUR_API_KEY`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});
