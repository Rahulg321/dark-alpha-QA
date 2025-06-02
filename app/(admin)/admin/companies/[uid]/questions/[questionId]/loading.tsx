import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface AnswerLoadingScreenProps {
  count?: number;
}

export default function AnswerLoadingScreen({
  count = 5,
}: AnswerLoadingScreenProps) {
  return (
    <div className="space-y-4 block-space-mini big-container">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Answer items skeleton */}
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} className="w-full">
            <CardContent className="p-6">
              {/* Header with user info and actions */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-6 w-16" /> {/* User label */}
                  <Skeleton className="h-4 w-24" /> {/* Timestamp */}
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded" /> {/* Edit button */}
                  <Skeleton className="h-8 w-8 rounded" /> {/* Delete button */}
                </div>
              </div>

              {/* Answer content */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 mt-2" />
                </div>
                <div className="pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5 mt-2" />
                  <Skeleton className="h-4 w-2/3 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
