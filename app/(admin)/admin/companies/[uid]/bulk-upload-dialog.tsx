"use client";

import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2
} from "lucide-react";
import { BsFiletypePdf, BsFileImage, BsFiletypeExe } from "react-icons/bs";
import { PiFileAudioBold } from "react-icons/pi";
import { toast } from "sonner";

interface FileWithPreview extends File {
  id: string;
  preview?: string;
}

interface UploadResult {
  fileName: string;
  status: 'success' | 'error';
  resourceId?: string;
  error?: string;
}

interface JobStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  results?: UploadResult[];
  filesCount: number;
  fileNames: string[];
}

interface BulkUploadDialogProps {
  companyId: string;
  categoryId: string;
  trigger: React.ReactNode;
}

const getFileIcon = (type: string) => {
  if (type.includes('pdf')) return <BsFiletypePdf className="h-6 w-6" />;
  if (type.includes('word') || type.includes('document')) return <FileText className="h-6 w-6" />;
  if (type.includes('excel') || type.includes('spreadsheet')) return <BsFiletypeExe className="h-6 w-6" />;
  if (type.includes('image')) return <BsFileImage className="h-6 w-6" />;
  if (type.includes('audio')) return <PiFileAudioBold className="h-6 w-6" />;
  return <FileText className="h-6 w-6" />;
};

const allowedTypes = {
  'application/pdf': 'PDF files',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word documents',
  'application/vnd.ms-excel': 'Excel files',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel files',
  'text/plain': 'Text files',
  'image/png': 'PNG images',
  'image/jpeg': 'JPEG images'
};

export function BulkUploadDialog({ companyId, categoryId, trigger }: BulkUploadDialogProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach((error: any) => {
        toast.error(`${file.name}: ${error.message}`);
      });
    });

    // Process accepted files
    const newFiles: FileWithPreview[] = acceptedFiles.map(file => ({
      ...file,
      id: Math.random().toString(36).substr(2, 9),
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: Object.keys(allowedTypes).reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize: 50 * 1024 * 1024, // 50MB per file
    multiple: true
  });

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const startUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    // Check total size
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 200 * 1024 * 1024) {
      toast.error("Total file size exceeds 200MB limit");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('companyId', companyId);
      formData.append('categoryId', categoryId);

      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });

      const response = await fetch('/admin/api/bulk-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      toast.success(`Started processing ${result.filesCount} files`);

      // Start polling for job status
      pollJobStatus(result.jobId);

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Upload failed');
      setIsUploading(false);
    }
  };

  const pollJobStatus = async (jobId: string) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/admin/api/bulk-upload/${jobId}`);
        if (response.ok) {
          const status: JobStatus = await response.json();
          setJobStatus(status);

          if (status.status === 'completed' || status.status === 'failed') {
            setIsUploading(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }

            if (status.status === 'completed') {
              const successCount = status.results?.filter(r => r.status === 'success').length || 0;
              const errorCount = status.results?.filter(r => r.status === 'error').length || 0;

              if (successCount > 0) {
                toast.success(`Successfully processed ${successCount} files`);
              }
              if (errorCount > 0) {
                toast.error(`Failed to process ${errorCount} files`);
              }

              // Refresh the page to show new resources
              window.location.reload();
            } else {
              toast.error('Bulk upload failed');
            }
          }
        }
      } catch (error) {
        console.error('Status check error:', error);
      }
    };

    // Initial check
    await checkStatus();

    // Poll every 2 seconds
    intervalRef.current = setInterval(checkStatus, 2000);
  };

  const resetDialog = () => {
    setFiles([]);
    setIsUploading(false);
    setJobStatus(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetDialog();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Files</DialogTitle>
          <DialogDescription>
            Upload multiple files at once. Supported formats: PDF, Word, Excel, Text, Images (PNG, JPEG)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Area */}
          {!isUploading && !jobStatus && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p>Drop the files here...</p>
              ) : (
                <div>
                  <p className="text-lg font-medium mb-2">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Max 50MB per file, 200MB total
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {Object.values(allowedTypes).map((type, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* File List */}
          {files.length > 0 && !isUploading && !jobStatus && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Selected Files ({files.length})
                </h3>
                <Badge variant="outline">
                  Total: {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))}
                </Badge>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                onClick={startUpload}
                className="w-full"
                size="lg"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload {files.length} Files
              </Button>
            </div>
          )}

          {/* Progress Section */}
          {(isUploading || jobStatus) && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {isUploading && jobStatus?.status !== 'completed' && (
                  <Loader2 className="h-5 w-5 animate-spin" />
                )}
                <h3 className="text-lg font-medium">
                  {jobStatus?.status === 'completed' ? 'Upload Complete' : 'Processing Files...'}
                </h3>
              </div>

              {jobStatus && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{jobStatus.progress}%</span>
                  </div>
                  <Progress value={jobStatus.progress} className="w-full" />

                  {jobStatus.results && jobStatus.results.length > 0 && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      <h4 className="font-medium">Results:</h4>
                      {jobStatus.results.map((result, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 border rounded text-sm"
                        >
                          <div className="flex items-center gap-2">
                            {getStatusIcon(result.status)}
                            <span className="truncate">{result.fileName}</span>
                          </div>
                          {result.status === 'error' && result.error && (
                            <span className="text-red-500 text-xs truncate max-w-xs">
                              {result.error}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}