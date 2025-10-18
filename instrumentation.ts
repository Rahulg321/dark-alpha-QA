// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize WebSocket server on startup
    const { initializeWebSocketWithRedis } = await import('./lib/websocket-subscriber');
    const { createServer } = await import('http');

    // Get Next.js server instance
    const server = createServer();

    // Initialize WebSocket with Redis subscriber
    initializeWebSocketWithRedis(server);

    console.log('✅ WebSocket server initialized with Redis pub/sub');
  }
}
