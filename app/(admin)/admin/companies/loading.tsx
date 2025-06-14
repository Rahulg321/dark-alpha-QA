import { Skeleton } from "@/components/ui/skeleton";

export default function CompaniesLoading() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Filter and New Company Button */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Company Cards */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-6 rounded" />
            </div>

            <div className="flex gap-4 mb-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-36" />
            </div>

            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>
    </div>
  );
}
