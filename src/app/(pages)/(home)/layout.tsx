"use server";
import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/app/server/actions/get-session";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import MenuResponsive from "./components/menu/menu-responsive";

const HomeLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getSession();
  if (!session) redirect("/auth/sign-in");

  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      <MenuResponsive session={session} />
      <div className="w-full sm:max-w-5xl mx-auto py-4 px-2">
        <ToastContainer className={""} containerId="NotifySuccess" />
        <ToastContainer containerId="NotifyError" />
        {children}
      </div>
    </div>
  );
};

export default HomeLayout;
