import express from 'express';

const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);

// 헬스체크
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// 루트
app.get('/', (req, res) => {
  res.json({ message: 'RISS MCP Server' });
});

// 0.0.0.0에 바인딩 (중요!)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
