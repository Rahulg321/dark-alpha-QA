"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

interface IPagination {
  totalPages: number;
}

export default function QuestionsPagination({ totalPages }: IPagination) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <>
      <div className="mt-4 flex items-center space-x-1 md:mt-8">
        <Button asChild>
          <Link
            href={createPageURL(currentPage - 1)}
            className={
              currentPage - 1 === 0 ? `pointer-events-none opacity-50` : ""
            }
            prefetch={true}
          >
            Previous
          </Link>
        </Button>
        <Button asChild>
          <Link
            href={createPageURL(currentPage + 1)}
            className={
              currentPage >= totalPages ? `pointer-events-none opacity-50` : ""
            }
            prefetch={true}
          >
            Next
          </Link>
        </Button>
      </div>
    </>
  );
}
