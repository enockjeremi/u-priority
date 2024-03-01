"use server";
import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/app/server/actions/get-session";
import SidebarComponent from "./components/sidebar-component";

const HomeLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getSession();
  if (!session) redirect("/auth/sign-in");

  return (
    <div>
      <div>
        <SidebarComponent />
      </div>
      <div className="p-2">{children}</div>
    </div>
  );
};

export default HomeLayout;
