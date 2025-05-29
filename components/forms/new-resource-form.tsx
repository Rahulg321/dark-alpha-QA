"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, FileText, Upload } from "lucide-react";
import axios from "axios";

const NewResourceForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.type;

      // Check if file is PDF, DOC, or image
      if (
        fileType === "application/pdf" ||
        fileType === "application/msword" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileType === "image/jpeg" ||
        fileType === "image/png" ||
        fileType === "image/gif" ||
        fileType === "image/webp" ||
        fileType === "application/vnd.ms-excel" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setFile(selectedFile);
        setError(null);
      } else {
        setFile(null);
        setError("Please upload a PDF, DOC, Excel Sheet or image file");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/add-resource", formData);
      console.log(response.data);
      if (response.status !== 200) {
        throw new Error("Failed to process file");
      }
      toast.success("File processed successfully");
      setFileContent(response.data.content);
    } catch (err) {
      toast.error("Failed to process file. Please try again.");
      setError("Failed to process file. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="file">Upload Document</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={!file || isLoading}
                className="shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            {file && !error && (
              <p className="text-sm text-green-600 mt-1">
                <FileText className="inline mr-1 h-4 w-4" />
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>
        </div>
      </form>
      {fileContent && (
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold mb-2">Extracted Content:</h3>
          <div className="bg-muted p-3 rounded-md w-full max-h-60 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">{fileContent}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewResourceForm;
