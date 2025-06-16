import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { openaiProvider } from "@/lib/ai/providers";
import { ticket } from "@/lib/db/schema";
import { db } from "@/lib/db/queries";

const parseEmailSchema = z.object({
  isTicketEmail: z.boolean().describe("Whether the email is a ticket email"),
  title: z.string().describe("The title of the ticket"),
  description: z.string().describe("The description of the ticket"),
  priority: z
    .enum(["low", "medium", "high"])
    .describe("The priority of the ticket"),
  fromName: z.string().describe("The name of the person who sent the email"),
  fromEmail: z
    .string()
    .describe("The email address of the person who sent the email"),
  tags: z.array(z.string()).describe("The appropriate tags of the ticket"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("inside scrape email request");
    console.log("body", body);

    const { object } = await generateObject({
      model: openaiProvider("gpt-4o"),
      system: `You are an expert support ticket classifier and extractor. Your job is to analyze incoming emails and determine if they could plausibly be handled by a support, sales, or information team. Treat any email that requests information, assistance, partnership, investment details, onboarding, or any kind of response from the company as a support ticket. This includes general inquiries, partnership requests, investment questions, or anything that is not clearly spam or irrelevant. If you are unsure, always classify as a support ticket. If the email is a support ticket, extract the relevant fields according to the schema. If not, indicate that it is not a support ticket.`,
      prompt: `Given the following email, determine if it should be considered a customer support ticket. Treat any email that could plausibly require a response from the company—including general inquiries, partnership or investment requests, onboarding, or information requests—as a support ticket. Only return isSupportTicket: false if the email is clearly spam or completely irrelevant. If isSupportTicket is true, extract the ticket fields using the schema provided. If not, return isSupportTicket: false. Email: ${JSON.stringify(
        body
      )}`,
      schema: parseEmailSchema,
    });

    if (!object.isTicketEmail) {
      console.log("AI RESPONSE:-email is not a ticket email", object);
      return NextResponse.json(
        {
          message: "Email is not a ticket email",
        },
        {
          status: 200,
        }
      );
    }

    const { title, description, priority, fromName, fromEmail, tags } = object;

    console.log("AI RESPONSE:-ticket creating", object);

    const [insertedTicket] = await db
      .insert(ticket)
      .values({
        title,
        type: "email",
        description,
        priority,
        fromName,
        fromEmail,
        tags,
        status: "open",
      })
      .returning();

    return NextResponse.json({
      message: "Email scraped and uploadedsuccessfully",
      ticket: insertedTicket,
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
