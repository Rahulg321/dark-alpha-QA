import { z } from "zod";

export const newAudioFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  file: z
    .instanceof(File, { message: "Audio file is required" })
    .refine((file) => {
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      return (
        fileType.startsWith("audio/") ||
        fileName.endsWith(".mp3") ||
        fileName.endsWith(".wav") ||
        fileName.endsWith(".ogg") ||
        fileName.endsWith(".m4a")
      );
    }, "Please upload an audio file (MP3, WAV, OGG, or M4A)"),
});
