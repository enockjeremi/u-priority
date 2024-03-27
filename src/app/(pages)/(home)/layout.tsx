"use server";
import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/app/server/actions/get-session";
import SidebarComponent from "./components/sidebar-component";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";

const HomeLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getSession();
  if (!session) redirect("/auth/sign-in");

  return (
    <div className="flex h-screen w-full flex-col">
      <SidebarComponent />
      <div className="w-full sm:max-w-4xl mx-auto">
        <ToastContainer className={""} containerId="NotifySuccess" />
        <ToastContainer containerId="NotifyError" />
        {children}
      </div>
    </div>
  );
};

export default HomeLayout;
