# Bulk Upload Feature

This implementation adds a comprehensive bulk file upload system with background processing for embeddings generation.

## 🚀 Features

### Frontend (React/TypeScript)
- **Drag & Drop Interface**: Modern file upload with drag and drop support
- **Multi-file Selection**: Upload multiple files simultaneously
- **Real-time Progress**: Live progress tracking for each file
- **File Validation**: Type and size validation before upload
- **Background Processing**: Non-blocking uploads with queue system
- **Error Handling**: Individual file status with retry capability

### Backend (Node.js/Redis)
- **Queue System**: Redis-based job queue for scalable processing
- **Background Workers**: Separate worker processes for embedding generation
- **Progress Tracking**: Real-time status updates via Redis pub/sub
- **File Processing**: Support for PDF, Word, Excel, Text, and Images
- **Embeddings**: Automatic AI-powered content analysis and embedding generation

## 📁 File Structure

```
lib/queue/
├── job-queue.ts          # Redis job queue management
└── worker.ts             # Background worker for processing files

app/(admin)/api/
├── bulk-upload/
│   ├── route.ts          # Main bulk upload endpoint
│   └── [jobId]/route.ts  # Job status checking endpoint

app/(admin)/admin/companies/[uid]/
├── bulk-upload-dialog.tsx   # Main upload UI component
├── resource-selection-context.tsx  # Multi-select state management
├── bulk-actions-toolbar.tsx        # Bulk operations toolbar
└── select-all-checkbox.tsx         # Select all functionality

scripts/
└── start-worker.ts       # Worker startup script
```

## 🛠️ Setup & Usage

### 1. Prerequisites
- Redis server running (for job queue)
- All existing environment variables configured
- File upload limits configured in server

### 2. Start the Background Worker
```bash
# In development
npm run worker

# In production (with process manager like PM2)
pm2 start "npm run worker" --name "bulk-upload-worker"
```

### 3. Environment Variables
```env
REDIS_URL=redis://localhost:6379  # Redis connection string
```

### 4. Using the Bulk Upload

1. **Navigate** to any company's resource page in the admin panel
2. **Click** the "Bulk Upload" button next to other resource actions
3. **Drag & Drop** or click to select multiple files
4. **Review** selected files and total size (200MB max total)
5. **Upload** - files are queued for background processing
6. **Monitor** real-time progress and individual file results
7. **Wait** for completion notification and page refresh

## 📋 Supported File Types

- **PDF** (.pdf) - With AI content analysis
- **Word** (.docx) - Text extraction and processing
- **Excel** (.xls, .xlsx) - Sheet data extraction
- **Text** (.txt) - Direct content processing
- **Images** (.png, .jpg) - OCR and visual analysis

## ⚙️ Configuration

### File Limits
- **Per File**: 50MB maximum
- **Total Upload**: 200MB maximum
- **Queue TTL**: 24 hours (jobs auto-expire)

### Queue Settings
```typescript
// In lib/queue/job-queue.ts
const QUEUE_NAME = 'bulk-upload-queue';
const JOB_TTL = 24 * 60 * 60; // 24 hours
const POLL_INTERVAL = 2000;   // 2 seconds
```

## 🔄 How It Works

### 1. Upload Flow
```
User selects files → Frontend validation → API endpoint → Redis queue → Background worker
```

### 2. Background Processing
```
Worker polls queue → Process file → Generate embeddings → Save to DB → Update progress
```

### 3. Real-time Updates
```
Worker publishes status → Redis pub/sub → Frontend polls status → UI updates
```

## 🐛 Troubleshooting

### Common Issues

1. **Worker Not Processing Jobs**
   - Check if worker script is running: `npm run worker`
   - Verify Redis connection
   - Check worker logs for errors

2. **Upload Fails**
   - Verify file types are supported
   - Check file size limits (50MB per file, 200MB total)
   - Ensure proper authentication

3. **Progress Not Updating**
   - Check Redis pub/sub connection
   - Verify frontend polling is working
   - Check browser console for errors

### Monitoring

```bash
# Check Redis queue status
redis-cli llen bulk-upload-queue

# Monitor job processing
redis-cli monitor

# View worker logs
npm run worker
```

## 🚀 Production Deployment

### Worker Management
```bash
# Using PM2
pm2 start npm --name "bulk-upload-worker" -- run worker
pm2 save
pm2 startup

# Using Docker
docker run -d --name bulk-worker --env-file .env your-app npm run worker
```

### Scaling
- Run multiple worker instances for higher throughput
- Use Redis Cluster for high availability
- Monitor queue length and add workers as needed

### Monitoring
- Track job completion rates
- Monitor Redis memory usage
- Set up alerts for failed jobs

## 🔧 Development

### Testing the System
1. Start Redis: `redis-server`
2. Start the worker: `npm run worker`
3. Start the dev server: `npm run dev`
4. Test bulk upload with various file types
5. Monitor logs for processing status

### Adding New File Types
1. Update `allowedTypes` in `bulk-upload-dialog.tsx`
2. Add processing logic in `worker.ts`
3. Update validation in `bulk-upload/route.ts`

## 📈 Performance

### Expected Throughput
- **Small files** (< 1MB): ~10-20 files/minute per worker
- **Large files** (> 10MB): ~2-5 files/minute per worker
- **PDF with AI analysis**: ~1-2 files/minute per worker

### Optimization Tips
- Use multiple workers for better throughput
- Consider file size when estimating processing time
- Monitor Redis memory for large file buffers
- Implement cleanup for completed jobs

## 🔐 Security

- File type validation on frontend and backend
- File size limits enforced
- Authentication required for all endpoints
- Redis secured with proper access controls
- Temporary file cleanup after processing