import { Metadata } from "next";
import ResourceCategoryForm from "./resource-category-form";

export const metadata: Metadata = {
  title: "Dark Alpha QA - Add New Resource Category",
  description: "Dark Alpha QA - Add New Resource Category",
};

const AddNewResourceCategory = () => {
  return (
    <div className="block-space-mini narrow-container min-h-screen">
      <h1 className="text-2xl font-bold">Add New Resource Category</h1>
      <p className="text-sm text-muted-foreground">
        Add a new resource category to the database.
      </p>
      <div className="mt-4 md:mt-8 lg:mt-12">
        <ResourceCategoryForm />
      </div>
    </div>
  );
};

export default AddNewResourceCategory;
