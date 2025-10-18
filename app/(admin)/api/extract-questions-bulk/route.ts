import { auth } from "@/app/(auth)/auth";
import { NextRequest, NextResponse } from "next/server";
import { publishUploadProgress } from "@/lib/redis-publisher";
import { v4 as uuidv4 } from "uuid";
import pdf from "pdf-parse";

// Simple text extraction without AI
function extractQuestionsFromText(text: string): { title: string }[] {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const questions: { title: string }[] = [];

  for (const line of lines) {
    // Look for lines that end with '?' or start with numbers like "1.", "2.", etc.
    if (line.endsWith('?') || /^\d+[\.\)]\s/.test(line)) {
      // Clean up the line
      const cleaned = line.replace(/^\d+[\.\)]\s*/, '').trim();
      if (cleaned.length > 10) { // Only questions with meaningful length
        questions.push({ title: cleaned });
      }
    }
  }

  return questions;
}

export async function POST(req: NextRequest) {
  console.log("🚀 Starting multi-file bulk upload");

  const userSession = await auth();

  if (!userSession?.user) {
    console.log("❌ Unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const files: File[] = [];

  // Extract all files from formData
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('files[') && value instanceof File) {
      files.push(value);
    }
  }

  if (files.length === 0) {
    console.log("❌ No files provided");
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  console.log(`📁 Processing ${files.length} files`);

  // Validate each file
  for (const file of files) {
    if (!file.type.includes('pdf')) {
      return NextResponse.json({
        error: `Invalid file type: ${file.name}. Only PDF files are supported.`
      }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({
        error: `File too large: ${file.name}. Maximum size is 5MB.`
      }, { status: 400 });
    }
  }

  const jobId = uuidv4();
  const totalFiles = files.length;
  let allQuestions: { title: string }[] = [];

  // Process files sequentially
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const currentFile = i + 1;

    try {
      console.log(`📄 Processing file ${currentFile}/${totalFiles}: ${file.name}`);

      // Publish start progress
      await publishUploadProgress({
        jobId,
        currentFile,
        totalFiles,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        status: "processing",
        progress: Math.round((currentFile - 1) / totalFiles * 100),
        timestamp: Date.now(),
      });

      // Extract text from PDF
      const buffer = await file.arrayBuffer();
      const data = await pdf(Buffer.from(buffer));
      const text = data.text;

      console.log(`📝 Extracted ${text.length} characters from ${file.name}`);

      // Extract questions from text
      const questions = extractQuestionsFromText(text);

      console.log(`✅ Extracted ${questions.length} questions from ${file.name}`);
      allQuestions = [...allQuestions, ...questions];

      // Publish completion for this file
      await publishUploadProgress({
        jobId,
        currentFile,
        totalFiles,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        status: currentFile === totalFiles ? "completed" : "processing",
        progress: Math.round(currentFile / totalFiles * 100),
        timestamp: Date.now(),
      });

    } catch (error) {
      console.error(`❌ Error processing file ${file.name}:`, error);

      // Publish error for this file
      await publishUploadProgress({
        jobId,
        currentFile,
        totalFiles,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        status: "failed",
        progress: Math.round((currentFile - 1) / totalFiles * 100),
        timestamp: Date.now(),
      });

      return NextResponse.json(
        { error: `Error processing file: ${file.name}` },
        { status: 500 }
      );
    }
  }

  console.log(`✅ Bulk upload complete. Total questions extracted: ${allQuestions.length}`);

  return NextResponse.json(
    {
      message: "Questions extracted from all files",
      questions: allQuestions,
      filesProcessed: totalFiles,
      jobId
    },
    { status: 200 }
  );
}
