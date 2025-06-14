import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function DocumentSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-4">
      {/* Skeleton for each document item */}
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="p-4 border-0 shadow-none">
          <div className="flex items-start gap-4">
            {/* Document icon skeleton */}
            <Skeleton className="h-8 w-8 rounded-md flex-shrink-0 mt-1" />

            {/* Content area */}
            <div className="flex-1 space-y-3">
              {/* Title skeleton - varying widths for realism */}
              <Skeleton
                className={`h-5 ${
                  index === 0
                    ? "w-80"
                    : index === 1
                    ? "w-72"
                    : index === 2
                    ? "w-96"
                    : index === 3
                    ? "w-64"
                    : "w-88"
                }`}
              />

              {/* Subtitle/description skeleton - varying widths */}
              <Skeleton
                className={`h-4 ${
                  index === 0
                    ? "w-96"
                    : index === 1
                    ? "w-64"
                    : index === 2
                    ? "w-80"
                    : index === 3
                    ? "w-72"
                    : "w-56"
                }`}
              />

              {/* Category badge skeleton */}
              <Skeleton
                className={`h-6 rounded-full ${
                  index === 0
                    ? "w-48"
                    : index === 1
                    ? "w-36"
                    : index === 2
                    ? "w-20"
                    : index === 3
                    ? "w-56"
                    : "w-36"
                }`}
              />
            </div>

            {/* Menu button skeleton */}
            <Skeleton className="h-6 w-6 rounded-md flex-shrink-0" />
          </div>
        </Card>
      ))}
    </div>
  );
}
