import { NextRequest, NextResponse } from "next/server";
import { jobQueue } from "@/lib/queue/job-queue";
import { auth } from "@/app/(auth)/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await params;

    const job = await jobQueue.getJob(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Don't send file buffers in response (they're large)
    const responseJob = {
      id: job.id,
      companyId: job.companyId,
      categoryId: job.categoryId,
      status: job.status,
      progress: job.progress,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      results: job.results,
      filesCount: job.files.length,
      fileNames: job.files.map(f => f.name)
    };

    return NextResponse.json(responseJob);

  } catch (error) {
    console.error("Job status check error:", error);
    return NextResponse.json(
      { error: "Failed to check job status" },
      { status: 500 }
    );
  }
}