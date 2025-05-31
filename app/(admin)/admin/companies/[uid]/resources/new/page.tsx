import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default async function NewResource({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = await params;
  const source = {
    id: Number.parseInt(uid),
    name:
      uid === "1"
        ? "Acme Corporation"
        : uid === "2"
        ? "TechStart Inc."
        : "Global Solutions",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-2xl">
        <Link
          href={`/admin/sources/${uid}`}
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Source Details
        </Link>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Add New Resource</CardTitle>
            <p className="text-sm text-muted-foreground">
              Adding resource for {source.name}
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Enter resource title" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Resource Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select resource type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="spreadsheet">Spreadsheet</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Upload File</Label>
                  <Input id="file" type="file" />
                  <p className="text-xs text-muted-foreground">
                    Maximum file size: 50MB. Supported formats: PDF, DOCX, XLSX,
                    JPG, PNG, MP4
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter a description of this resource"
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Enter tags separated by commas"
                  />
                  <p className="text-xs text-muted-foreground">
                    Example: annual report, financial, 2023
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Link href={`/admin/sources/${uid}`}>
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit">Upload Resource</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
