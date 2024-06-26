import { redirect } from "next/navigation";
import { getSession } from "@/app/server/actions/get-session";

import BasicLogo from "@/app/client/components/basic-logo";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session) {
    redirect("/");
  }
  return (
    <div className="mx-auto h-screen px-2 md:w-[90%] md:px-0 lg:w-[65%]">
      <div className="flex h-screen w-full  flex-col items-center justify-center text-dark">
        <div className="pb-6">
          <BasicLogo />
        </div>
        {children}
      </div>
    </div>
  );
}
