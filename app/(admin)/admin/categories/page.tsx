import { Metadata } from "next";
import { getAllResourceCategories } from "@/lib/db/queries";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dark Alpha QA - Categories",
  description: "Dark Alpha QA - Categories",
};

const CategoriesPage = async () => {
  const allResourceCategories = await getAllResourceCategories();

  console.log(allResourceCategories);

  if (!allResourceCategories || allResourceCategories.length === 0) {
    return (
      <div className="block-space-mini narrow-container min-h-screen">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            No categories found. Please add a category to get started.
          </p>
          <Button asChild>
            <Link href="/admin/categories/new">Add Category</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="block-space-mini narrow-container min-h-screen">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Manage your categories and their associated resources.
        </p>

        <div className="flex flex-row gap-4">
          <Button asChild>
            <Link href="/admin/categories/new">Add Category</Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {allResourceCategories.length > 0 ? (
            allResourceCategories.map((category) => (
              <Link
                key={category.id}
                href={`/admin/categories/${category.id}`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {category.name}
              </Link>
            ))
          ) : (
            <div>No categories found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
