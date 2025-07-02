import React, { useRef, useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
// For icons, you might want to use a library like lucide-react or heroicons
// import { Bold, Italic, Heading1, List, ListOrdered } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { UndoIcon } from "@/components/icons";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This helps in scenarios where textareaRef might not be immediately available
    // or for operations that need the DOM to be fully ready.
    setIsMounted(true);
  }, []);

  const applyFormat = useCallback(
    (format: "bold" | "italic" | "heading" | "ulist" | "olist") => {
      if (!textareaRef.current) return;

      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);

      let newText: string;
      let cursorOffsetStart = 0; // How much the start of the selection moves
      let cursorOffsetEnd = 0; // How much the end of the selection moves (relative to new start)

      const insertText = (
        prefix: string,
        suffix: string,
        defaultText: string
      ) => {
        const textToWrap = selectedText || defaultText;
        newText =
          value.substring(0, start) +
          prefix +
          textToWrap +
          suffix +
          value.substring(end);
        cursorOffsetStart = start + prefix.length;
        cursorOffsetEnd = textToWrap.length;
      };

      const applyLineOperation = (
        operation: (
          line: string,
          index: number,
          isSelectedLine: boolean
        ) => string,
        defaultText?: string // Optional default text if selection is empty on a new line
      ) => {
        const currentLineStart = value.lastIndexOf("\n", start - 1) + 1;
        const currentLineEnd = value.indexOf("\n", end);
        const actualEnd = currentLineEnd === -1 ? value.length : currentLineEnd;

        // If selection spans multiple lines, operate on all of them
        // If selection is on a single line or empty, operate on that line
        const lines = value.substring(currentLineStart, actualEnd).split("\n");
        const processedLines = lines.map((line, index) => {
          // Determine if the current line is part of the original selection
          // This logic is simplified; for precise multi-line selection highlighting, it's more complex
          const isSelected =
            (start >= currentLineStart + line.length * index &&
              end <= currentLineStart + line.length * (index + 1)) ||
            lines.length === 1;
          return operation(line, index, isSelected);
        });

        newText =
          value.substring(0, currentLineStart) +
          processedLines.join("\n") +
          value.substring(actualEnd);

        // Attempt to set cursor. This is a bit tricky for multi-line operations.
        // For simplicity, we'll place it at the end of the modified section.
        cursorOffsetStart = currentLineStart;
        cursorOffsetEnd = processedLines.join("\n").length;
      };

      switch (format) {
        case "bold":
          insertText("**", "**", "bold text");
          break;
        case "italic":
          insertText("*", "*", "italic text");
          break;
        case "heading":
          applyLineOperation((line) => {
            if (line.startsWith("# ")) {
              return line.substring(2); // Remove heading
            } else if (line.startsWith("## ")) {
              return line.substring(3);
            } else if (line.startsWith("### ")) {
              return line.substring(4);
            }
            return `# ${line || "Heading"}`;
          });
          // Recalculate cursor for heading as it's line-based
          // The general cursor logic below might need adjustment for line ops
          // For now, the applyLineOperation sets a broad selection
          break;
        case "ulist":
          applyLineOperation((line) =>
            line.startsWith("- ") ? line.substring(2) : `- ${line}`
          );
          break;
        case "olist":
          // This is a simplified version for ordered lists.
          // True incrementing requires knowing the context of previous lines.
          applyLineOperation((line, index) =>
            line.match(/^\d+\.\s/)
              ? line.replace(/^\d+\.\s/, "")
              : `${index + 1}. ${line}`
          );
          break;
        default:
          return;
      }

      onChange(newText!);

      // Use setTimeout to allow React to re-render with the new value
      // before trying to set the selection.
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          // For insertText, cursorOffsetEnd is length of selected/default text
          // For applyLineOperation, it's the length of the entire modified block
          if (format === "bold" || format === "italic") {
            textareaRef.current.setSelectionRange(
              cursorOffsetStart,
              cursorOffsetStart + cursorOffsetEnd
            );
          } else {
            // For line operations, the selection might be better placed at the start or end of the line
            // This sets selection over the whole changed block, which might not be ideal for all cases.
            textareaRef.current.setSelectionRange(
              cursorOffsetStart,
              cursorOffsetEnd
            );
          }
        }
      }, 0);
    },
    [value, onChange]
  );

  return (
    <div className="flex flex-col font-sans border border-gray-300 rounded-lg overflow-hidden shadow-md">
      {/* Toolbar */}
      <TooltipProvider>
        <div className="flex items-center flex-wrap gap-1 p-2 bg-gray-100 border-b border-gray-300">
          {[
            { label: "H", format: "heading", title: "Heading" },
            {
              label: "B",
              format: "bold",
              title: "Bold",
              fontClass: "font-bold",
            },
            {
              label: "I",
              format: "italic",
              title: "Italic",
              fontClass: "italic",
            },
            { label: "• List", format: "ulist", title: "Unordered List" },
            { label: "1. List", format: "olist", title: "Ordered List" },
          ].map((btn) => (
            <button
              key={btn.format}
              type="button"
              title={btn.title}
              className={`px-3 py-1.5 rounded text-sm text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-200 transition-colors ${
                btn.fontClass || ""
              }`}
              onClick={() =>
                applyFormat(
                  btn.format as
                    | "bold"
                    | "italic"
                    | "heading"
                    | "ulist"
                    | "olist"
                )
              }
            >
              {btn.label}
              {/* Example for icon usage (install lucide-react first)
              {btn.format === "bold" && <Bold size={16} className="inline-block" />}
              */}
            </button>
          ))}
          {/* Reset Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="text-red-600 hover:bg-red-100 focus:ring-red-400 ml-2"
                onClick={() => onChange("")}
              >
                <UndoIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset editor</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* Editor and Preview Panes */}
      <div
        className="flex flex-col md:flex-row flex-1"
        style={{ minHeight: "300px" }}
      >
        {" "}
        {/* Minimum height for the content area */}
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 p-4 w-full md:w-1/2 min-h-[200px] md:min-h-0 border-none md:border-r md:border-gray-300 outline-none focus:ring-0 resize-none font-mono text-base bg-white"
          placeholder="Write your markdown here..."
          spellCheck="false"
        />
        {/* Preview */}
        <div className="flex-1 p-4 w-full md:w-1/2 min-h-[200px] md:min-h-0 overflow-y-auto bg-gray-50 prose prose-sm max-w-none">
          {isMounted ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <p className="text-gray-400">Loading preview...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
