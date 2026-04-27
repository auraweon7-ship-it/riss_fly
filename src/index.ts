import { startServer } from './server.js';

const PORT = parseInt(process.env.PORT || '8080', 10);

async function main() {
  try {
    const app = await startServer();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ RISS MCP Server running on http://0.0.0.0:${PORT}`);
      console.log(`✓ Health check: http://0.0.0.0:${PORT}/health`);
      console.log(`✓ MCP endpoint: http://0.0.0.0:${PORT}/mcp?oc=YOUR_API_KEY`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
