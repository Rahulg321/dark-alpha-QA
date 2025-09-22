import { NextRequest, NextResponse } from "next/server";
import { jobQueue } from "@/lib/queue/job-queue";
import { auth } from "@/app/(auth)/auth";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const companyId = formData.get("companyId") as string;
    const categoryId = formData.get("categoryId") as string;

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    if (!categoryId) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    // Collect all files
    const files: Array<{ name: string; buffer: Buffer; type: string; size: number }> = [];

    // Get all file entries from formData
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('files[') && value instanceof File) {
        const file = value as File;

        // Validate file size (50MB limit per file)
        if (file.size > 50 * 1024 * 1024) {
          return NextResponse.json(
            { error: `File ${file.name} is too large. Maximum size is 50MB.` },
            { status: 400 }
          );
        }

        // Validate file type
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain',
          'image/png',
          'image/jpeg'
        ];

        if (!allowedTypes.includes(file.type)) {
          return NextResponse.json(
            { error: `File type ${file.type} is not supported for file ${file.name}` },
            { status: 400 }
          );
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        files.push({
          name: file.name,
          buffer,
          type: file.type,
          size: file.size
        });
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Validate total size (200MB limit for all files combined)
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 200 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Total file size exceeds 200MB limit" },
        { status: 400 }
      );
    }

    // Add job to queue
    const jobId = await jobQueue.addBulkUploadJob(companyId, categoryId, files);

    // Revalidate the company page to show the upload in progress
    revalidatePath(`/admin/companies/${companyId}`);

    return NextResponse.json({
      success: true,
      jobId,
      filesCount: files.length,
      message: `Started processing ${files.length} files. Job ID: ${jobId}`
    });

  } catch (error) {
    console.error("Bulk upload error:", error);
    return NextResponse.json(
      { error: "Failed to process bulk upload" },
      { status: 500 }
    );
  }
}