// lib/queue/websocket.ts
import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;

export function initializeWebSocket(httpServer: HTTPServer) {
  if (io) {
    return io;
  }

  io = new SocketIOServer(httpServer, {
    path: '/api/socket',
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

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

export function emitProgress(
  jobId: string,
  data: {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    currentFile?: number;
    totalFiles?: number;
    fileName?: string;
    results?: any[];
  }
) {
  if (io) {
    io.to(`job:${jobId}`).emit('progress', data);
    console.log(`📡 Emitted progress for job ${jobId}:`, data);
  }
}
