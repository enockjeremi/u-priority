"use client";

import React, { useState } from "react";
import SidebarComponent from "./sidebar-component";
import NavbarComponent from "./navbar-component";
import { workspaces } from "@/app/libs/endpoints/workspaces";
import { QUERY_KEY_TASKS } from "@/app/server/constants/query-keys";
import instance from "@/app/server/utils/axios-instance";
import { IWorkspaces } from "@/types/workspaces";
import { useQuery } from "react-query";
import IsLoadingComponent from "@/app/client/components/common/is-loading-component";
import LogOutIcon from "@/app/client/components/icons/logout-icon";
import PresentationIcon from "@/app/client/components/icons/presentation-icon";
import { StackIcon } from "@/app/client/components/icons/stack-icon";
import {
  List,
  ListItem,
  ListItemPrefix,
  Typography,
  Button,
  Dialog,
} from "@material-tailwind/react";
import Link from "next/link";
import WorkspacesCreateForm from "../workspaces-create-form";
import { useSignOut } from "@/app/client/hooks/useSignOut";
import UserIcon from "@/app/client/components/icons/user-icon";
import { usePathname } from "next/navigation";

type IUserSession = {
  email: string;
  username: string;
  role: string;
};

const MenuResponsive = ({ session }: { session: IUserSession }) => {
  const pathname = usePathname();

  const onSignOut = useSignOut();
  const { data, isLoading } = useQuery<IWorkspaces[]>({
    queryKey: [QUERY_KEY_TASKS.workspaces],
    queryFn: async () =>
      await instance.get(workspaces.getAll).then((res) => res.data),
  });

  const [openDialogWorkspaces, setOpenDialogWorkspaces] =
    useState<boolean>(false);

  const clickToOpenDialog = () =>
    setOpenDialogWorkspaces(!openDialogWorkspaces);

  const navList = (
    <List placeholder={undefined}>
      <Link href={"/profile"}>
        <ListItem
          selected={pathname === "/profile"}
          placeholder={undefined}
          className="text-sm"
        >
          <ListItemPrefix placeholder={undefined}>
            <UserIcon className="w-5" />
          </ListItemPrefix>
          <span className="first-letter:uppercase">{session.username}</span>
        </ListItem>
      </Link>

      <Link href={"/"}>
        <ListItem
          selected={pathname === "/"}
          placeholder={undefined}
          className="text-sm"
        >
          <ListItemPrefix placeholder={undefined}>
            <PresentationIcon className="w-5" />
          </ListItemPrefix>
          Dashboard
        </ListItem>
      </Link>
      <Typography
        placeholder={undefined}
        variant="small"
        color="blue-gray"
        className="my-1 flex flex-col gap-2 p-1 font-medium"
      >
        <Button
          placeholder={undefined}
          color="gray"
          className="p-1 text-[10px]"
          size="sm"
          onClick={clickToOpenDialog}
        >
          agregar proyecto
        </Button>
      </Typography>

      <IsLoadingComponent isLoading={isLoading}>
        {data?.length === 0 ? (
          <Typography
            variant="h6"
            color="black"
            className="text-center text-[12px]"
            placeholder={undefined}
          >
            ¡Agrega tu primer proyecto!
          </Typography>
        ) : (
          data?.map((item) => (
            <Link href={`/workspaces/${item.id}`} key={item.id}>
              <ListItem
                selected={pathname === `/workspaces/${item.id}`}
                placeholder={undefined}
                className="text-sm"
              >
                <ListItemPrefix placeholder={undefined}>
                  <StackIcon className="w-5" />
                </ListItemPrefix>
                {item.name}
              </ListItem>
            </Link>
          ))
        )}
      </IsLoadingComponent>

      <hr className="my-2 border-blue-gray-50" />
      <ListItem onClick={onSignOut} placeholder={undefined} className="text-sm">
        <ListItemPrefix placeholder={undefined}>
          <LogOutIcon className="w-5" />
        </ListItemPrefix>
        Cerrar sesion
      </ListItem>
    </List>
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
      <SidebarComponent navList={navList} />
      <NavbarComponent navList={navList} />
    </>
  );
};

export default MenuResponsive;
