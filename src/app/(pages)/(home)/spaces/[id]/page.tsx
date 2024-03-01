import { workspaces } from "@/app/libs/endpoints/workspaces";
import { USER_TOKEN_NAME } from "@/app/server/constants/user-token";
import { cookies } from "next/headers";

import React from "react";
import SpacesComponent from "./components/spaces-component";
import { status } from "@/app/libs/endpoints/status";

const getAllStatus = async (token: any) => {
  const res = await fetch(status.getAll, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
  return res;
};

const getWorkspaces = async (id: number, token: any) => {
  const res = await fetch(workspaces.getBy(id), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
  return res;
};

const Page = async ({ params }: { params: any }) => {
  const token = cookies().get(USER_TOKEN_NAME);

  const workspaces = await getWorkspaces(params.id, token?.value);
  const statusList = await getAllStatus(token?.value);

  return <SpacesComponent workspaces={workspaces} statusList={statusList} />;
};

export default Page;
