"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useQuery } from "react-query";

import {
  Button,
  Collapse,
  Dialog,
  IconButton,
  Navbar,
  Typography,
} from "@material-tailwind/react";

import WorkspacesCreateForm from "./workspaces-create-form";
import BasicLogo from "@/app/client/components/basic-logo";
import { StackIcon } from "@/app/client/components/icons/stack-icon";

import instance from "@/app/server/utils/axios-instance";
import { workspaces } from "@/app/libs/endpoints/workspaces";

import { IWorkspaces } from "@/types/workspaces";
import { QUERY_KEY_TASKS } from "@/app/server/constants/query-keys";
import { CloseIcon } from "@/app/client/components/icons/close-icon";
import NavbarIcon from "@/app/client/components/icons/navbar-icon";

const SidebarComponent = () => {
  const [openNav, setOpenNav] = useState<boolean>(false);
  const [openDialogWorkspaces, setOpenDialogWorkspaces] =
    useState<boolean>(false);

  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const { data: workspaces_list } = useQuery<IWorkspaces[]>({
    queryKey: [QUERY_KEY_TASKS.workspaces],
    queryFn: async () =>
      await instance.get(workspaces.getAll).then((res) => res.data),
  });

  const clickToOenNav = () => setOpenNav(!openNav);
  const clickToOpenDialog = () =>
    setOpenDialogWorkspaces(!openDialogWorkspaces);

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium"
        placeholder={undefined}
      >
        <Link onClick={clickToOenNav} href={"/"}>
          Inicio
        </Link>
      </Typography>
      <Typography
        placeholder={undefined}
        variant="small"
        color="blue-gray"
        className="flex flex-col gap-2 p-1 font-medium"
      >
        <span>Proyectos en desarrollo</span>
        <Button
          placeholder={undefined}
          color="gray"
          className="text-[10px] p-1"
          size="sm"
          onClick={clickToOpenDialog}
        >
          agregar proyecto
        </Button>
      </Typography>

      {workspaces_list?.map((item) => (
        <Typography
          as="li"
          key={item.id}
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium"
          placeholder={undefined}
        >
          <StackIcon className="w-5" />
          <Link onClick={clickToOenNav} href={`/workspaces/${item.id}`}>
            {item.name}
          </Link>
        </Typography>
      ))}
    </ul>
  );

  return (
    <>
      <Dialog
        open={openDialogWorkspaces}
        handler={clickToOpenDialog}
        placeholder={undefined}
      >
        <WorkspacesCreateForm clickToOpenDialog={clickToOpenDialog} />
      </Dialog>

      <Navbar
        className="mx-auto max-w-screen-xl px-6 py-3"
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
              <CloseIcon className="w-6 h-6" />
            ) : (
             <NavbarIcon className="w-6 h-6" /> 
            )}
          </IconButton>
        </div>
        <Collapse open={openNav}>{navList}</Collapse>
      </Navbar>
    </>
  );
};

export default SidebarComponent;
