"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const RichTextEditor = dynamic(() => import("./rich-text-editor"), {
  ssr: false,
});

type Props = ComponentProps<typeof RichTextEditor>;

export default function EditorField(props: Props) {
  return <RichTextEditor {...props} />;
} 