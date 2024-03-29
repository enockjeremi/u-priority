"use client";
import BasicLogo from "@/app/client/components/basic-logo";

import { Card, Typography } from "@material-tailwind/react";

export default function SidebarComponent({
  navList,
}: {
  navList: any;
}) {
  return (
    <>
      <Card
        className="hidden h-[calc(100vh)] w-full max-w-[16rem] rounded-lg rounded-t-none p-1 shadow-xl shadow-blue-gray-900/5 md:block"
        placeholder={undefined}
      >
        <div className="mb-2 p-4">
          <Typography
            as="a"
            href="#"
            variant="h6"
            className="mr-4 cursor-pointer py-1.5"
            placeholder={undefined}
          >
            <BasicLogo />
          </Typography>
        </div>
        {navList}
      </Card>
    </>
  );
}
