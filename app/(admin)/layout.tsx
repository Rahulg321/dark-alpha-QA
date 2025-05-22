import React from "react";
import AdminHeader from "./admin-header";
import AdminFooter from "./admin-footer";
import { auth } from "../(auth)/auth";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  return (
    <div>
      <AdminHeader session={session} />
      {children}
    </div>
  );
};

export default layout;
