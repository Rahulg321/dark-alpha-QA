import type { Metadata } from "next";
import React from "react";
import NewAudioForm from "./new-audio-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Add Audio Resource",
  description: "Add a new audio resource to the company",
};

const NewAudioPage = async ({
  params,
}: {
  params: Promise<{ uid: string }>;
}) => {
  const { uid } = await params;

  return (
    <div className="block-space-mini narrow-container">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Add Audio Resource</h1>
        <Link href={`/admin/companies/${uid}`}>
          <Button>Back to Company</Button>
        </Link>
      </div>
      <NewAudioForm companyId={uid} />
    </div>
  );
};

export default NewAudioPage;
