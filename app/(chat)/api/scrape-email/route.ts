import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("inside scrape email route");
  return NextResponse.json({
    message: "Hello, world inside scrape email route!",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("inside scrape email request");
    console.log("body", body);

    return NextResponse.json({
      message: "Email scraped successfully",
    });
  } catch (error) {
    console.error("Error scraping email", error);
    return NextResponse.json(
      {
        message: "Error scraping email",
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      }
    );
  }
}
