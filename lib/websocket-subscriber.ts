// lib/websocket-subscriber.ts
import { Server as SocketIOServer } from 'socket.io';
import Redis from 'ioredis';
import type { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;
let subscriber: Redis | null = null;

export function initializeWebSocketWithRedis(httpServer: HTTPServer) {
  if (io) {
    return io;
  }

  // Initialize Socket.IO
  io = new SocketIOServer(httpServer, {
    path: '/api/socket',
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // Initialize Redis subscriber
  subscriber = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  });

  // Subscribe to Redis pub/sub channel
  subscriber.subscribe('job-updates', (err, count) => {
    if (err) {
      console.error('❌ Failed to subscribe to job-updates:', err);
    } else {
      console.log(`✅ Subscribed to ${count} channel(s): job-updates`);
    }
  });

  // Listen for messages from Redis and broadcast to WebSocket clients
  subscriber.on('message', (channel, message) => {
    if (channel === 'job-updates') {
      try {
        const data = JSON.parse(message);
        const { jobId } = data;

        // Broadcast to all clients in the job room
        io?.to(`job:${jobId}`).emit('progress', data);
        console.log(`📡 Broadcasted to WebSocket clients for job ${jobId}`);
      } catch (error) {
        console.error('❌ Error parsing Redis message:', error);
      }
    }
  });

  // Handle Socket.IO connections
  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    socket.on('subscribe', (jobId: string) => {
      console.log(`👀 Client ${socket.id} subscribed to job ${jobId}`);
      socket.join(`job:${jobId}`);
    });

    socket.on('unsubscribe', (jobId: string) => {
      console.log(`👋 Client ${socket.id} unsubscribed from job ${jobId}`);
      socket.leave(`job:${jobId}`);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}
