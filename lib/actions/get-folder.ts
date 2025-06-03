"use server"

import { getFolderNameById } from "@/lib/db/queries"

export async function getFolder(folderId: string) {
  return await getFolderNameById(folderId);
}
