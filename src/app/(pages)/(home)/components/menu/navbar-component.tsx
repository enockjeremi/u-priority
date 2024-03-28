"use client";
import React, { useState } from "react";
import {
  Collapse,
  Dialog,
  IconButton,
  Navbar,
  Typography,
} from "@material-tailwind/react";

import WorkspacesCreateForm from "./../workspaces-create-form";
import BasicLogo from "@/app/client/components/basic-logo";

import { CloseIcon } from "@/app/client/components/icons/close-icon";
import NavbarIcon from "@/app/client/components/icons/navbar-icon";

const NavbarComponent = ({ navList }: { navList: any }) => {
  const [openNav, setOpenNav] = useState<boolean>(false);
  useState<boolean>(false);

  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [openNav]);

  return (
    <>
      <Navbar
        className="mx-auto block max-w-screen-xl rounded-none px-6 py-3 sm:max-w-4xl md:hidden lg:mt-2"
        placeholder={undefined}
      >
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography
            as="a"
            href="#"
            variant="h6"
            className="mr-4 cursor-pointer py-1.5"
            placeholder={undefined}
          >
            <BasicLogo />
          </Typography>
          <div className="hidden lg:block">{navList}</div>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
            placeholder={undefined}
          >
            {openNav ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <NavbarIcon className="h-6 w-6" />
            )}
          </IconButton>
        </div>
        <Collapse open={openNav}>{navList}</Collapse>
      </Navbar>
    </>
  );
};

export default NavbarComponent;
