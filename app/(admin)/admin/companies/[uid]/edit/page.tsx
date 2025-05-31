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

export default async function EditSource({
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
    type: uid === "1" ? "Enterprise" : uid === "2" ? "Startup" : "Consultancy",
    description:
      "Acme Corporation is a global leader in innovative solutions for various industries. With cutting-edge technology and a commitment to excellence, Acme has established itself as a trusted partner for businesses worldwide.",
    website: "https://example.com",
    contactEmail: "contact@example.com",
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
            <CardTitle className="text-xl">Edit Source</CardTitle>
            <p className="text-sm text-muted-foreground">
              Update the details for {source.name}
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={source.name} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select defaultValue={source.type.toLowerCase()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                      <SelectItem value="startup">Startup</SelectItem>
                      <SelectItem value="consultancy">Consultancy</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    defaultValue={source.website}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    defaultValue={source.contactEmail}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    defaultValue={source.description}
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Link href={`/admin/sources/${uid}`}>
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit">Update Source</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
