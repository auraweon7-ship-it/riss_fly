cd C:\Users\park9\riss

# src/index.ts 수정
@"
import { startServer } from './server.js';

const PORT = parseInt(process.env.PORT || '8080', 10);

async function main() {
  try {
    const app = await startServer();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(\`✓ RISS MCP Server running on http://0.0.0.0:\${PORT}\`);
      console.log(\`✓ Health check: http://0.0.0.0:\${PORT}/health\`);
      console.log(\`✓ MCP endpoint: http://0.0.0.0:\${PORT}/mcp?oc=YOUR_API_KEY\`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
"@ | Out-File -FilePath src/index.ts -Encoding UTF8

# Git 커밋
git add src/index.ts
git commit -m "Fix: Bind to 0.0.0.0 for Fly.io"
git push origin main
