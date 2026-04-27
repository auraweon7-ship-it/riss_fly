import { startServer } from './server.js';

const PORT = parseInt(process.env.PORT || '8080', 10);

async function main() {
  try {
    console.log('Starting RISS MCP Server...');
    const app = await startServer();
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ RISS MCP Server running on http://0.0.0.0:${PORT}`);
      console.log(`✓ Health check: http://0.0.0.0:${PORT}/health`);
      console.log(`✓ MCP endpoint: http://0.0.0.0:${PORT}/mcp?oc=YOUR_API_KEY`);
      console.log(`✓ Server bound to 0.0.0.0:${PORT}`);
    });

    server.on('error', (error) => {
      console.error('Server error:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
