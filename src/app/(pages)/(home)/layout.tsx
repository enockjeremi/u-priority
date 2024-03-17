"use server";
import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/app/server/actions/get-session";
import SidebarComponent from "./components/sidebar-component";
import "react-toastify/dist/ReactToastify.css";

const HomeLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getSession();
  if (!session) redirect("/auth/sign-in");

  return (
    <div className="h-screen w-full flex flex-col">
      <SidebarComponent />
      <div className="w-full">{children}</div>
    </div>
  );
};

export default HomeLayout;
