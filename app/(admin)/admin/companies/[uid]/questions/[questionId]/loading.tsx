import { Search, Upload, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DueDiligenceLoading() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Due Diligence Questions</h1>
            <Skeleton className="h-5 w-32 bg-gray-800" />
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              <Upload className="w-4 h-4 mr-2" />
              Bulk Upload
            </Button>
            <Button className="bg-white text-black hover:bg-gray-200">
              <Plus className="w-4 h-4 mr-2" />
              New Question
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search questions..."
            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
            disabled
          />
        </div>

        {/* Questions Section */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Questions</h2>

          {/* Loading Questions */}
          <div className="space-y-6">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton
                  className="h-6 bg-gray-800"
                  style={{
                    width: `${Math.random() * 40 + 60}%`,
                  }}
                />
                {/* Occasionally add a second line for longer questions */}
                {Math.random() > 0.6 && (
                  <Skeleton
                    className="h-6 bg-gray-800"
                    style={{
                      width: `${Math.random() * 30 + 40}%`,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
