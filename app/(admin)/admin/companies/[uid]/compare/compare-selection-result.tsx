"use client";

import { useSession } from "next-auth/react";

import React, { useState } from "react";
import { toast } from "sonner";

function CompanyResearch() {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (prompt.length < 10) {
      toast("Prompt must be at least 10 characters");
      return;
    }

    setIsLoading(true);
    setResponse(""); // Clear previous response

    try {
      if (!session?.accessToken) {
        throw new Error("No token available yet, please login again");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/compare`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Failed to make the initial request."
        );
      }

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          setResponse((prev) => prev + decoder.decode(value));
        }
      }

      toast.success("Successfully made the initial request.");

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Request failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to make the initial request."
      );
    }
  };

  return (
    <div>
      <h2>Company Deep Research</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your research prompt..."
          rows={4}
          cols={50}
        />
        <br />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Research"}
        </button>
      </form>
      <hr />
      <h3>Response:</h3>
      <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
        {response}
      </pre>
    </div>
  );
}

export default CompanyResearch;
