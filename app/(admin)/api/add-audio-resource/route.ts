import { auth } from "@/app/(auth)/auth";
import { googleGenAIProvider, } from "@/lib/ai/providers";
import { newAudioFormSchema } from "@/lib/schemas/add-audio-resource";
import { type NextRequest, NextResponse } from "next/server";
import {
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import { db } from "@/lib/db/queries";
import {
  generateEmbeddingsFromChunks,
  generateChunksFromText,
} from "@/lib/ai/embedding";
import { embeddings as embeddingsTable, resources } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const userSession = await auth();

  if (!userSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const companyId = formData.get("companyId") as string;

  console.log(userSession);

  const validatedData = newAudioFormSchema.safeParse({
    name,
    description,
    file,
    companyId,
  });

  if (!validatedData.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    console.log("generating transcription");

    const myfile = await googleGenAIProvider.files.upload({
      file: validatedData.data.file,
      config: { mimeType: "audio/mpeg" },
    });

    if (!myfile.uri || !myfile.mimeType) {
      console.error("File upload failed: missing uri or mimeType");
      throw new Error("File upload failed: missing uri or mimeType");
    }

    console.log("blob uploaded successfully");
    console.log("blob", myfile.uri);

    const result = await googleGenAIProvider.models.generateContent({
      model: "gemini-2.0-flash",
      contents: createUserContent([
        createPartFromUri(myfile.uri, myfile.mimeType),
        "Generate Raw Transcript of the audio file",
      ]),
    });

    console.log("result.text=", result.text);

    const transcription = result.text;

    const content = `AUDIO FILE NAME: ${name}\nDescription: ${description}\n\n Original Content:\n\n${transcription}`;

    const kind = "audio";
    const chunks = await generateChunksFromText(content!);
    const embeddingInput = chunks.chunks.map((chunk: any) => chunk.pageContent);
    console.log("Chunks length", chunks.chunks.length);

    const embeddings = await generateEmbeddingsFromChunks(embeddingInput);
    const [resource] = await db
      .insert(resources)
      .values({
        content,
        name,
        description,
        companyId,
        kind: kind as any,
        fileUrl: myfile.uri,
      })
      .returning();

    console.log("resource created", resource);

    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        resourceId: resource.id,
        ...embedding,
      }))
    );

    console.log("embeddings created", embeddings);

    revalidatePath(`/admin/companies/${companyId}`);

    console.log("Resource and embeddings were created successfully!!!");

    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
