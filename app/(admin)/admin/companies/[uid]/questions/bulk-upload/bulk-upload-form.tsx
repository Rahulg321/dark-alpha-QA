"use client";

import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useTransition, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, FileText, X, CheckCircle, Loader2 } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

import axios from "axios";
import { extractQuestionsSchema } from "@/lib/schemas/extract-questions-schema";
import { bulkAddQuestions } from "@/lib/actions/bulk-add-questions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";

interface JobProgress {
  currentFile: number;
  totalFiles: number;
  status: string;
  fileName: string;
  fileSize?: number;
  fileType?: string;
  progress?: number;
}

export default function BulkUploadForm({ companyId }: { companyId: string }) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [questions, setQuestions] = useState<{ title: string }[]>([]);
  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState<JobProgress | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Cleanup socket on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const connectWebSocket = (id: string) => {
    const socket = io({
      path: '/api/socket',
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌 WebSocket connected');
      socket.emit('subscribe', id);
    });

    socket.on('progress', (data: JobProgress) => {
      console.log('📡 Progress update:', data);
      setProgress(data);

      if (data.status === 'completed' || data.status === 'failed') {
        setIsUploading(false);
        socket.emit('unsubscribe', id);
        setTimeout(() => socket.disconnect(), 1000);
      }
    });

    socket.on('disconnect', () => {
      console.log('🔌 WebSocket disconnected');
    });

    socket.on('error', (error) => {
      console.error('❌ WebSocket error:', error);
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    const validFiles: File[] = [];
    let hasError = false;

    for (const file of files) {
      try {
        extractQuestionsSchema.parse({ file });
        validFiles.push(file);
      } catch (err) {
        if (err instanceof z.ZodError) {
          setError(err.errors[0].message);
          hasError = true;
          break;
        }
      }
    }

    if (!hasError) {
      setSelectedFiles(validFiles);
      setError("");
      setIsComplete(false);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();

      // Append all files
      selectedFiles.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });

      const response = await axios.post("/api/extract-questions-bulk", formData);

      setQuestions(response.data.questions);
      setJobId(response.data.jobId);
      setIsComplete(true);

      // Connect to WebSocket for progress tracking
      if (response.data.jobId) {
        connectWebSocket(response.data.jobId);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed. Please try again.");
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setSelectedFiles([]);
    setError("");
    setIsComplete(false);
    setIsUploading(false);
    setProgress(null);
  };

  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 max-w-3xl">
      {/* Navigation */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Button variant="ghost" size="sm" asChild className="h-9">
          <Link href={`/admin/companies/${companyId}/questions`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questions
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold mb-2">
          Bulk Upload Questions
        </h1>
        <p className="text-muted-foreground">
          Upload a PDF file to extract and import multiple questions at once
        </p>
      </div>

      {/* Upload Form */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="px-4 sm:px-6 py-4 border-b border-border/50">
          <CardTitle className="text-base font-medium">
            Upload PDF File
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {!isComplete ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="file-upload" className="text-sm font-medium">
                  Select PDF Files (Multiple)
                </Label>
                <div className="relative">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileSelect}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-muted file:text-muted-foreground hover:file:bg-muted/80"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 5MB per file. Select multiple PDF files for bulk upload.
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {selectedFiles.length > 0 && (
                <Card className="border-border/40">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Total: {(selectedFiles.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>

                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {selectedFiles.map((file, index) => {
                          const fileNumber = index + 1;
                          const isCurrentFile = isUploading && progress && progress.currentFile === fileNumber;
                          const isCompleted = isUploading && progress && progress.currentFile > fileNumber;

                          return (
                            <div key={index} className="p-3 border rounded space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  {isCompleted ? (
                                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                  ) : isCurrentFile ? (
                                    <Loader2 className="h-4 w-4 text-primary animate-spin flex-shrink-0" />
                                  ) : (
                                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {(file.size / 1024 / 1024).toFixed(2)} MB
                                      {isUploading && (
                                        <span className="ml-2">
                                          {isCompleted ? '✓ Completed' : isCurrentFile ? 'Processing...' : 'Pending'}
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                                {!isUploading && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFile(index)}
                                    className="h-6 w-6 flex-shrink-0"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>

                              {isCurrentFile && progress && (
                                <div className="space-y-1">
                                  <Progress value={progress.progress || 0} className="h-1.5" />
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>File {fileNumber} of {selectedFiles.length}</span>
                                    <span>{progress.progress}%</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {isUploading && progress && (
                        <div className="mt-4 space-y-2 p-3 bg-muted/30 rounded">
                          <div className="flex justify-between text-sm font-semibold">
                            <span>Processing Files</span>
                            <span className="text-primary">
                              {progress.currentFile} / {progress.totalFiles}
                            </span>
                          </div>
                          {progress.fileName && (
                            <div className="text-xs text-muted-foreground truncate">
                              Current: {progress.fileName}
                            </div>
                          )}
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{progress.progress}%</span>
                          </div>
                          <Progress value={progress.progress || 0} className="h-2" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || isUploading}
                className="w-full h-10"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading
                  ? `Processing ${progress?.currentFile || 0}/${progress?.totalFiles || selectedFiles.length}...`
                  : `Upload and Process ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}`
                }
              </Button>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-3">How it works:</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary flex-shrink-0">•</span>
                    <span>Upload one or multiple PDFs containing due diligence questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary flex-shrink-0">•</span>
                    <span>
                      Our AI will extract and parse the questions automatically
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary flex-shrink-0">•</span>
                    <span>
                      Questions will be added to your database for review
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary flex-shrink-0">•</span>
                    <span>You can edit or organize them after processing</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Questions Generated
                </h3>
                <span className="text-sm text-muted-foreground">
                  Your PDF has been processed successfully. 12 questions have
                  been extracted.
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <ViewQuestionsDialog
                  questionList={questions}
                  companyId={companyId}
                />
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1 sm:flex-initial"
                >
                  Upload Another
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ViewQuestionsDialog({
  questionList,
  companyId,
}: {
  questionList: { title: string }[];
  companyId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSave = () => {
    startTransition(async () => {
      const response = await bulkAddQuestions(companyId, questionList);
      if (response.success) {
        setIsOpen(false);
        toast.success("Uploaded🎉", {
          description: "Questions added successfully",
          action: {
            label: "View Questions",
            onClick: () => {
              router.push(`/admin/companies/${companyId}/questions`);
            },
          },
        });
      } else {
        toast.error(response.message, {
          description: "Failed to add questions",
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">
          View Questions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Extracted Questions</DialogTitle>
          <DialogDescription>
            Review the questions below before saving them to your database.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[350px] mt-4 mb-2 rounded border bg-muted/30 p-4">
          <ol className="space-y-3 list-decimal list-inside">
            {questionList.length === 0 ? (
              <li className="text-muted-foreground">No questions found.</li>
            ) : (
              questionList.map((question, idx) => (
                <li
                  key={idx}
                  className="bg-background rounded px-3 py-2 shadow-sm border"
                >
                  {question.title}
                </li>
              ))
            )}
          </ol>
        </ScrollArea>
        <DialogFooter className="flex flex-row gap-3 mt-4">
          <Button className="flex-1" onClick={handleSave}>
            {isPending ? "Saving..." : "Save"}
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Discard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
