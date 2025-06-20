import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db/queries";
import { company, resources } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const userSession = await auth();

  if (!userSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const companies = await db
      .select({
        id: company.id,
        name: company.name,
        resourceCount: sql<number>`COUNT(${resources.id})`,
      })
      .from(company)
      .leftJoin(resources, eq(company.id, resources.companyId))
      .groupBy(company.id);

    return NextResponse.json({
      companies,
      message: "Companies fetched successfully",
    });
  } catch (error) {
    console.error("error fetching companies", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message:
          error instanceof Error ? error.message : "Error fetching companies",
      },
      { status: 500 }
    );
  }
}
