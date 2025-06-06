import React from "react";

const SingleCategoryPage = async ({
  params,
}: {
  params: Promise<{
    uid: string;
  }>;
}) => {
  const { uid: categoryId } = await params;
  return (
    <div className="min-h-screen block-space-mini narrow-container">
      SingleCategoryPage
    </div>
  );
};

export default SingleCategoryPage;
