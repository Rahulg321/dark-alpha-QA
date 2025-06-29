"use client";

import type { UIMessage } from "ai";
import cx from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useState } from "react";
import type { Vote } from "@/lib/db/schema";
import { DocumentToolCall, DocumentToolResult } from "./document";
import { PencilEditIcon, SparklesIcon } from "./icons";
import { Markdown } from "./markdown";
import { MessageActions } from "./message-actions";
import { PreviewAttachment } from "./preview-attachment";
import { Weather } from "./weather";
import equal from "fast-deep-equal";
import { cn, sanitizeText } from "@/lib/utils";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { MessageEditor } from "./message-editor";
import { DocumentPreview } from "./document-preview";
import { MessageReasoning } from "./message-reasoning";
import type { UseChatHelpers } from "@ai-sdk/react";

const PurePreviewMessage = ({
  chatId,
  message,
  vote,
  isLoading,
  setMessages,
  reload,
  isReadonly,
  requiresScrollPadding,
}: {
  chatId: string;
  message: UIMessage;
  vote: Vote | undefined;
  isLoading: boolean;
  setMessages: UseChatHelpers["setMessages"];
  reload: UseChatHelpers["reload"];
  isReadonly: boolean;
  requiresScrollPadding: boolean;
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            {
              "w-full": mode === "edit",
              "group-data-[role=user]/message:w-fit": mode !== "edit",
            }
          )}
        >
          {message.role === "assistant" && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div
            className={cn("flex flex-col gap-4 w-full", {
              "min-h-96": message.role === "assistant" && requiresScrollPadding,
            })}
          >
            {message.experimental_attachments &&
              message.experimental_attachments.length > 0 && (
                <div
                  data-testid={`message-attachments`}
                  className="flex flex-row justify-end gap-2"
                >
                  {message.experimental_attachments.map((attachment) => (
                    <PreviewAttachment
                      key={attachment.url}
                      attachment={attachment}
                    />
                  ))}
                </div>
              )}

            {message.parts?.map((part, index) => {
              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              if (type === "reasoning") {
                return (
                  <MessageReasoning
                    key={key}
                    isLoading={isLoading}
                    reasoning={part.reasoning}
                  />
                );
              }

              if (type === "text") {
                if (mode === "view") {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      {message.role === "user" && !isReadonly && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              data-testid="message-edit-button"
                              variant="ghost"
                              className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                              onClick={() => {
                                setMode("edit");
                              }}
                            >
                              <PencilEditIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit message</TooltipContent>
                        </Tooltip>
                      )}

                      <div
                        data-testid="message-content"
                        className={cn("flex flex-col gap-4", {
                          "bg-primary text-primary-foreground px-3 py-2 rounded-xl":
                            message.role === "user",
                        })}
                      >
                        <Markdown>{sanitizeText(part.text)}</Markdown>
                      </div>
                    </div>
                  );
                }

                if (mode === "edit") {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      <div className="size-8" />

                      <MessageEditor
                        key={message.id}
                        message={message}
                        setMode={setMode}
                        setMessages={setMessages}
                        reload={reload}
                      />
                    </div>
                  );
                }
              }

              if (type === "tool-invocation") {
                const { toolInvocation } = part;
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === "call") {
                  const { args } = toolInvocation;

                  return (
                    <div
                      key={toolCallId}
                      className={cx({
                        skeleton: ["getWeather"].includes(toolName),
                      })}
                    >
                      {toolName === "getWeather" ? (
                        <Weather />
                      ) : toolName === "createDocument" ? (
                        <DocumentPreview isReadonly={isReadonly} args={args} />
                      ) : toolName === "updateDocument" ? (
                        <DocumentToolCall
                          type="update"
                          args={args}
                          isReadonly={isReadonly}
                        />
                      ) : toolName === "requestSuggestions" ? (
                        <DocumentToolCall
                          type="request-suggestions"
                          args={args}
                          isReadonly={isReadonly}
                        />
                      ) : toolName === "getInformation" ? (
                        <div className="flex flex-col gap-3 p-4 rounded-lg border bg-card">
                          <div className="flex items-center gap-2">
                            <div className="text-primary">
                              <SparklesIcon size={16} />
                            </div>
                            <h5 className="font-medium">
                              Searching Knowledge Base
                            </h5>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full size-4 border-2 border-primary border-t-transparent"></div>
                              <p className="text-sm text-muted-foreground">
                                Searching knowledge base...
                              </p>
                            </div>
                            <div className="space-y-2">
                              <div className="h-3 bg-muted rounded animate-pulse"></div>
                              <div className="h-3 bg-muted rounded animate-pulse w-3/4"></div>
                              <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
                            </div>
                          </div>
                        </div>
                      ) : toolName === "getResourcesInformation" ? (
                        <div className="flex flex-col gap-3 p-4 rounded-lg border bg-card">
                          <div className="flex items-center gap-2">
                            <div className="text-primary">
                              <SparklesIcon size={16} />
                            </div>
                            <h5 className="font-medium">Searching Resources</h5>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full size-4 border-2 border-primary border-t-transparent"></div>
                              <p className="text-sm text-muted-foreground">
                                Searching resources...
                              </p>
                            </div>
                            <div className="space-y-2">
                              <div className="h-3 bg-muted rounded animate-pulse"></div>
                              <div className="h-3 bg-muted rounded animate-pulse w-3/4"></div>
                              <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                }

                if (state === "result") {
                  const { result } = toolInvocation;

                  return (
                    <div key={toolCallId}>
                      {toolName === "getWeather" ? (
                        <Weather weatherAtLocation={result} />
                      ) : toolName === "createDocument" ? (
                        <DocumentPreview
                          isReadonly={isReadonly}
                          result={result}
                        />
                      ) : toolName === "updateDocument" ? (
                        <DocumentToolResult
                          type="update"
                          result={result}
                          isReadonly={isReadonly}
                        />
                      ) : toolName === "requestSuggestions" ? (
                        <DocumentToolResult
                          type="request-suggestions"
                          result={result}
                          isReadonly={isReadonly}
                        />
                      ) : toolName === "getInformation" ? (
                        <div className="flex flex-col gap-3 p-4 rounded-lg border bg-card">
                          <div className="flex items-center gap-2">
                            <div className="text-primary">
                              <SparklesIcon size={16} />
                            </div>
                            <h5 className="font-medium">
                              Knowledge Base Results
                            </h5>
                          </div>
                          <div className="space-y-2">
                            {Array.isArray(result) && result.length > 0 ? (
                              result.map(
                                (
                                  item: { content: string; similarity: number },
                                  index: number
                                ) => (
                                  <div
                                    key={index}
                                    className="flex whitespace-pre-wrap items-center justify-between p-2 rounded-md bg-muted/50"
                                  >
                                    <span className="whitespace-pre-wrap  prose text-sm text-muted-foreground font-medium">
                                      {item.content}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                      {Math.round(item.similarity * 100)}% match
                                    </span>
                                  </div>
                                )
                              )
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No results found
                              </p>
                            )}
                          </div>
                        </div>
                      ) : toolName === "getResourcesInformation" ? (
                        <div className="flex flex-col gap-3 p-4 rounded-lg border bg-card whitespace-pre-wrap">
                          <div className="flex items-center gap-2">
                            <div className="text-primary">
                              <SparklesIcon size={16} />
                            </div>
                            <h5 className="font-medium">Resources Results</h5>
                          </div>
                          <div className="space-y-2">
                            {result.message && (
                              <p className="text-sm text-muted-foreground">
                                {result.message}
                              </p>
                            )}
                            {result.results &&
                            Array.isArray(result.results) &&
                            result.results.length > 0 ? (
                              result.results.map(
                                (
                                  item: {
                                    resourceId: string;
                                    name: string;
                                    content: string;
                                    similarity: number;
                                  },
                                  index: number
                                ) => (
                                  <div
                                    key={index}
                                    className="flex flex-col gap-2 p-3 rounded-md bg-muted/50"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">
                                        {item.name}
                                      </span>
                                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                        {Math.round(item.similarity * 100)}%
                                        match
                                      </span>
                                    </div>
                                    <span className="text-sm break-words text-muted-foreground whitespace-pre-wrap">
                                      {item.content}
                                    </span>
                                  </div>
                                )
                              )
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No relevant content found in the selected
                                resources.
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <pre>{JSON.stringify(result, null, 2)}</pre>
                      )}
                    </div>
                  );
                }
              }
            })}

            {!isReadonly && (
              <MessageActions
                key={`action-${message.id}`}
                chatId={chatId}
                message={message}
                vote={vote}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding)
      return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;
    if (!equal(prevProps.vote, nextProps.vote)) return false;

    return true;
  }
);

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message min-h-96"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
          {
            "group-data-[role=user]/message:bg-muted": true,
          }
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Hmm...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
