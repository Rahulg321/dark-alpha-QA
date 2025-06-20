import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db/queries";
import { resources } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ companyId: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companyId = (await params).companyId;

  if (!companyId) {
    return NextResponse.json(
      { error: "Company ID is required" },
      { status: 400 }
    );
  }

  try {
    const companyResources = await db
      .select({
        id: resources.id,
        name: resources.name,
        kind: resources.kind,
        createdAt: resources.createdAt,
      })
      .from(resources)
      .where(eq(resources.companyId, companyId));

    return NextResponse.json({
      companyResources,
      message: "Resources fetched successfully",
    });
  } catch (error) {
    console.error(
      `Error fetching resources for company ${companyId}:`,
      error instanceof Error ? error.message : "Failed to fetch resources"
    );
    return NextResponse.json(
      {
        error: "Failed to fetch resources",
        message:
          error instanceof Error ? error.message : "Failed to fetch resources",
      },
      { status: 500 }
    );
  }
}
