import { workspaces } from "@/app/libs/endpoints/workspaces";
import { USER_TOKEN_NAME } from "@/app/server/constants/user-token";
import { cookies } from "next/headers";

import React from "react";
import WorkspacesComponent from "./components/workspaces-component";
import { status } from "@/app/libs/endpoints/status";
import axios from "axios";
import { priority } from "@/app/libs/endpoints/priority";

const getWorkspaces = async (id: number, token: any) => {
  const res = await axios
    .get(workspaces.getBy(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
  return res;
};

const Page = async ({ params }: { params: any }) => {
  const token = cookies().get(USER_TOKEN_NAME)?.value;

  const workspaces = await getWorkspaces(params.id, token);

  return <WorkspacesComponent workspaces={workspaces} />;
};

export default Page;
