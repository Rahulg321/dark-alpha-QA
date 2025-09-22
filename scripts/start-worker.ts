#!/usr/bin/env tsx

import { config } from 'dotenv';
import { simpleBulkUploadWorker as bulkUploadWorker } from '../lib/queue/simple-worker';

// Load environment variables
config({ path: '.env.local' });

console.log('🚀 Starting bulk upload worker...');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, stopping worker...');
  bulkUploadWorker.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, stopping worker...');
  bulkUploadWorker.stop();
  process.exit(0);
});

// Start the worker
bulkUploadWorker.start().catch((error) => {
  console.error('❌ Worker failed to start:', error);
  process.exit(1);
});