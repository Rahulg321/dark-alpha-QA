"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
} from "lucide-react";

interface RichTextEditorProps {
  name: string;
  placeholder?: string;
}

export default function RichTextEditor({ name, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: {
        class: "min-h-[150px] prose dark:prose-invert focus:outline-none",
        placeholder: placeholder || "Type your message...",
      },
    },
  });

  // Sync editor content to hidden input so server actions receive it
  useEffect(() => {
    if (!editor) return;

    const update = () => {
      const html = editor.getHTML();
      const hiddenInput = document.getElementById(`rte-hidden-${name}`) as HTMLInputElement;
      if (hiddenInput) hiddenInput.value = html;
    };

    // initial sync
    update();

    editor.on("update", update);
    return () => {
      editor.off("update", update);
    };
  }, [editor, name]);

  const buttonClass =
    "p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground";

  return (
    <div className="space-y-2">
      <input type="hidden" id={`rte-hidden-${name}`} name={name} />
      {/* Toolbar */}
      {editor && (
        <div className="flex flex-wrap gap-1 border border-border rounded-t-md bg-muted/20 px-2 py-1">
          <button
            type="button"
            className={buttonClass}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Code className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Editor area */}
      <div className="border border-t-0 border-border rounded-b-md p-3 bg-background min-h-[150px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
} 