export type DataPart = { type: "append-message"; message: string };

export type ResourcesWithoutContent = {
  id: string;
  name: string;
  description: string | null;
}[];
