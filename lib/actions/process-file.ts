"use server"

import { DocxLoader } from "../docx-loader"
import { PDFLoader } from "../pdf-loader"


export async function processFile(formData: FormData): Promise<string> {
  try {
    const file = formData.get("file") as File

    if (!file) {
      throw new Error("No file provided")
    }

    // Get file type
    const fileType = file.type
    const buffer = await file.arrayBuffer()

    // Process based on file type
    if (fileType === "application/pdf") {
      // Process PDF
      const pdfLoader = new PDFLoader()
      return await pdfLoader.loadFromBuffer(buffer)
    } else if (
      fileType === "application/msword" ||
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // Process DOC/DOCX
      const docxLoader = new DocxLoader()
      return await docxLoader.loadFromBuffer(buffer)
    } else {
      throw new Error("Unsupported file type")
    }
  } catch (error) {
    console.error("Error processing file:", error)
    throw new Error("Failed to process file")
  }
}
